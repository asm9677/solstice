import { promises as fs } from "fs";
import idl from "../../target/idl/solstice.json" with { type: "json" };
import {
    Keypair,
    Connection,
    sendAndConfirmTransaction,
    PublicKey,
    Transaction,
    SystemProgram,
} from "@solana/web3.js";
import { AnchorProvider, Program } from "@coral-xyz/anchor";
import { Wallet } from "@coral-xyz/anchor";
import { Buffer } from "buffer";
import { loadNonceAccountsPool } from "./nonceAccout.js";
import bs58 from "bs58";
import { deserializeImageChunkTransaction, readImage, saveImage, splitIntoChunks } from "./imageChunk.js";
import connection from "./connect.js";
import { connect } from "http2";

const BATCH_SIZE = 100; // 한 배치당 nonce 계정 100개 사용

const secretKey = Uint8Array.from(
    JSON.parse(await fs.readFile(`${process.env.HOME}/.config/solana/id.json`, "utf8"))
);
const owner = Keypair.fromSecretKey(secretKey);

const wallet = new Wallet(owner);
const provider = new AnchorProvider(connection, wallet, {
    preflightCommitment: "confirmed",
    commitment: "confirmed",
    confirmTransactionInitialTimeout: 2000,
});

const programId = new PublicKey("3MSq9t7vHFU5EsoZxuCHgzN5TMvFiXAwwirP1q7C2Fy4");
const program = new Program(idl, provider);

async function createTransactionsForImageChunk(imageChunks, nonceAccountsPool) {
    let transactions = [];
    for (let i = 0; i < imageChunks.length; i++) {
        const nonceAccountKeypair = nonceAccountsPool[i];
        const noncePubkey = nonceAccountKeypair.publicKey;
        const nonceResponse = await connection.getNonceAndContext(noncePubkey);
        const currentNonce = nonceResponse.value.nonce;
        let transaction = new Transaction({
            nonceInfo: {
                nonce: currentNonce,
                nonceInstruction: SystemProgram.nonceAdvance({
                    noncePubkey: noncePubkey,
                    authorizedPubkey: wallet.publicKey,
                }),
            },
        });
        transaction.feePayer = wallet.publicKey;
        const instruction = await program.methods
            .imageChunkTransaction(Buffer.from(imageChunks[i].data), imageChunks[i].child1, imageChunks[i].child2)
            .accounts({ signer: [owner] })
            .signers([owner])
            .instruction();
        transaction.add(instruction);
        transaction.sign(owner);
        transactions.push(
            {
                ...imageChunks[i],
                transaction
            }
        );
    }
    return transactions;
}

const sendImageChunks = async (path) => {
    const imageBuffer = await readImage(path);
    const chunks = splitIntoChunks(imageBuffer, 750);
    const signatures = [];
    const nonceAccountsPool = await loadNonceAccountsPool(BATCH_SIZE)
    const total = chunks.length;
    const queue = [];

    for (let i = total - 1; i * 2 + 1 >= total; i--) {
        queue.push({
            idx: i,
            data: chunks[i],
            child1: "",
            child2: "",
        });
    }

    while (queue.length > 0) {
        console.log(queue.length, total)
        const batch = queue.splice(0, BATCH_SIZE)


        const transactions = await createTransactionsForImageChunk(batch, nonceAccountsPool)

        const results = await Promise.allSettled(
            transactions.map(({ transaction }) =>
                sendAndConfirmTransaction(connection, transaction, [owner]).catch((e) => e)
            )
        );

        results.forEach((result, i) => {
            const { idx } = transactions[i];
            let signature = ''
            if (typeof (result.value) === "string") {
                signature = result.value;
            } else if (typeof (result.value) == "object") {
                signature = result.value.signature;
            }

            if (signature) {
                signatures[idx] = signature;

                const parrent = Math.floor((idx - 1) / 2);
                const [child1, child2] = [parrent * 2 + 1, parrent * 2 + 2];

                if (idx > 0 && (child1 >= total || signatures[child1]) && (child2 >= total || signatures[child2])) {
                    queue.push({
                        idx: parrent,
                        data: chunks[parrent],
                        child1: signatures[child1],
                        child2: signatures[child2],
                    })
                }
                console.log(`✅ 트랜잭션 ${idx} 성공:`);
            } else {
                queue.push({
                    idx,
                    data: chunks[idx],
                    child1: signatures[idx * 2 + 1] || "",
                    child2: signatures[idx * 2 + 2] || "",
                })

                console.error(`❌ 트랜잭션 ${idx} 실패: `);
            }
        });
    }

    return signatures[0];
};

const createCardPDA = async (user, txHash, fileExt) => {
    const userPublicKey = new PublicKey(user);

    const tx = await program.methods
        .createCard(userPublicKey, txHash, fileExt)
        .accounts({ owner: owner.publicKey, user: userPublicKey })
        .signers([owner])
        .rpc();

    console.log("createCard: ", tx);
}

const updateCardPDA = async (user, txHash, fileExt) => {
    const userPublicKey = new PublicKey(user);

    const [cardPDA, bump] = PublicKey.findProgramAddressSync(
        [Buffer.from("card_seed"), userPublicKey.toBuffer()],
        programId
    );

    console.log(cardPDA.toBase58(), userPublicKey.toBase58(), txHash, fileExt)
    const tx = await program.methods
        .updateCard(userPublicKey, txHash, fileExt)
        .accounts({ owner: owner.publicKey, user: userPublicKey, cardAccount: cardPDA })
        .signers([owner])
        .rpc();

    console.log("updateCard: ", tx);
}

const getCardPDA = async (user) => {
    try {
        const userPublicKey = new PublicKey(user);

        const [cardPDA, bump] = PublicKey.findProgramAddressSync(
            [Buffer.from("card_seed"), userPublicKey.toBuffer()],
            programId
        );

        const cardAccountInfo = await program.account.card.fetch(cardPDA);
        return cardAccountInfo;
    } catch (e) {
        return null
    }
}

const getImageChunks = async (latestImageTx) => {
    const imageChunks = [];
    await buildImageChunks(imageChunks, 0, latestImageTx);
    return imageChunks;
}

const buildImageChunks = async (imageChunks, index, txHash) => {
    if (!txHash) {
        return;
    }
    try {
        const txInfo = await connection.getTransaction(txHash, {
            commitment: "confirmed",
            maxSupportedTransactionVersion: 0
        });

        const base58Data = txInfo.transaction.message.instructions[1].data;
        const decodedData = bs58.decode(base58Data);
        const buffer = Buffer.from(decodedData);
        const deserialized = deserializeImageChunkTransaction(buffer);
        // console.log("index : ", index);

        imageChunks[index] = deserialized.chunkData;
        await buildImageChunks(imageChunks, index * 2 + 1, deserialized.childHash1);
        await buildImageChunks(imageChunks, index * 2 + 2, deserialized.childHash2);
    }
    catch (e) {
        console.log(index, txHash)
        console.log("error : ", e);
    }
}

async function saveImageFromSignature(path) {
    const signature = await sendImageChunks(path);
    // const buffer = await getImageChunks(signature)
    // saveImage("./image/image10000.jpg", buffer);
    return signature;
}

export { saveImageFromSignature, createCardPDA, updateCardPDA, getCardPDA, getImageChunks, saveImage }