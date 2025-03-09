import { promises as fs } from "fs";
// import idl from "../../target/idl/solstice.json" with { type: "json" };
import storedAccounts from "../accounts/nonceAccounts.json" with { type: "json" };

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
import connection from "./connect.js";

const NONCE_ACCOUNTS_FILE = "/root/solstice/scripts/accounts/nonceAccounts.json";

const secretKey = Uint8Array.from(
    JSON.parse(await fs.readFile(`${process.env.HOME}/.config/solana/id.json`, "utf8"))
);
const user = Keypair.fromSecretKey(secretKey);

const wallet = new Wallet(user);
const provider = new AnchorProvider(connection, wallet, {
    preflightCommitment: "confirmed",
    commitment: "confirmed",
    confirmTransactionInitialTimeout: 2000,
});

/**
 * nonce 계정을 생성하고 초기화한 후 Keypair를 반환합니다.
 */
async function createNonceAccount() {
    const nonceAccount = Keypair.generate();
    const lamports = await connection.getMinimumBalanceForRentExemption(80);

    const createAccountIx = SystemProgram.createAccount({
        fromPubkey: wallet.publicKey,
        newAccountPubkey: nonceAccount.publicKey,
        lamports,
        space: 80,
        programId: SystemProgram.programId,
    });

    const initNonceIx = SystemProgram.nonceInitialize({
        noncePubkey: nonceAccount.publicKey,
        authorizedPubkey: wallet.publicKey,
    });

    let transaction = new Transaction();
    transaction.add(createAccountIx, initNonceIx);
    transaction.feePayer = wallet.publicKey;
    const latestBlockhash = await connection.getLatestBlockhash();
    transaction.recentBlockhash = latestBlockhash.blockhash;

    // nonce 계정 생성에는 user와 nonceAccount의 서명이 필요합니다.
    transaction.sign(user, nonceAccount);
    await sendAndConfirmTransaction(connection, transaction, [user, nonceAccount]);
    return nonceAccount;
}

/**
 * nonce 계정 풀을 가져옵니다.
 * JSON 파일이 있으면 저장된 nonce 계정들을 불러오고,
 * 파일이 없거나 개수가 부족하면 추가로 생성 후 파일에 저장합니다.
 * 여기서는 BATCH_SIZE(20)개만 필요합니다.
 */
async function loadNonceAccountsPool(totalNeeded) {
    let nonceAccounts = [];
    console.log("hi")
    try {
        nonceAccounts = storedAccounts.map((sk) =>
            Keypair.fromSecretKey(Uint8Array.from(sk))
        );
        console.log(`저장된 nonce 계정 ${nonceAccounts.length}개 로드 완료.`);
    } catch (err) {
        console.log("nonce 계정 파일을 찾을 수 없습니다. 새로 생성합니다...");
    }

    if (nonceAccounts.length < totalNeeded) {
        const additionalCount = totalNeeded - nonceAccounts.length;
        console.log(`추가로 ${additionalCount}개의 nonce 계정을 생성합니다...`);
        for (let i = 0; i < additionalCount; i++) {
            const kp = await createNonceAccount();
            console.log(`${i}번째 nonce`)
            nonceAccounts.push(kp);
            storedAccounts.push(Array.from(kp.secretKey));
        }
        await fs.writeFile(
            NONCE_ACCOUNTS_FILE,
            JSON.stringify(storedAccounts, null, 2)
        );
        console.log("nonce 계정 파일 저장 완료.");
    }

    return nonceAccounts;
}

export { loadNonceAccountsPool }
