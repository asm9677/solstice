import { promises as fs } from "fs";
import idl from "../../target/idl/solstice.json" with { type: "json" };
import { Keypair, Connection, sendAndConfirmTransaction, PublicKey } from "@solana/web3.js";
import { AnchorProvider, Program } from "@coral-xyz/anchor";
import { Wallet } from "@coral-xyz/anchor";
import { Buffer } from "buffer";
import { deserialize } from 'borsh';
import bs58 from 'bs58';

const path = "/Users/jangminjoo/Desktop/image2.png";

const secretKey = Uint8Array.from(
  JSON.parse(
    await fs.readFile(`${process.env.HOME}/.config/solana/id.json`, "utf8")
  )
);
const user = Keypair.fromSecretKey(secretKey);
const connection = new Connection(
  "http://localhost:8899",
  "confirmed"
);
const wallet = new Wallet(user);
const provider = new AnchorProvider(connection, wallet, {
  commitment: "confirmed",
});
const programId = new PublicKey("BnZ9zAhrmfTZT9tcWVZiHkcdh9jfgtwNyMUbaZ8GKqFk");
const program = new Program(idl, provider);

async function readImage() {
  try {
    const data = await fs.readFile(path);
    const byteArray = data.toJSON().data;

    const childHash1 = "string";
    const childHash2 = "string";
    splitBytes(byteArray, childHash1, childHash2);
  } catch (error) {
    console.error(error);
  }
}

readImage();

const splitBytes = async (byteArray, childHash1, childHash2) => {
  try {
    const chunks = splitIntoChunks(byteArray, 700);

    const txHashs = [];
    let transactions = [];
    const test = [];

    for (let i = chunks.length - 1; i >= 0; i -= 1) {
      let flag = false;
      let childHash1 = "";
      let childHash2 = "";

      if (i * 2 + 1 < chunks.length) {
        if (txHashs[i * 2 + 1] != null) {
          childHash1 = txHashs[i * 2 + 1];
        } else {
          flag = true;
        }
      }

      if (i * 2 + 2 < chunks.length) {
        if (txHashs[i * 2 + 2] != null) {
          childHash2 = txHashs[i * 2 + 2];
        } else {
          flag = true;
        }
      }

      // if (flag || transactions.length == 10) {
      //   const txSignatures = await provider.sendAll(transactions.map(tx => ({ tx, signers: [user]})));
      //   txSignatures.forEach((v, j) => {
      //     txHashs[i+j+1] = v;
      //   })
      //   transactions = [];
      //   i += 1;
      //   continue;
      // }

      // if (flag || transactions.length == 5) {
      //   const blockhash = await provider.connection.getLatestBlockhash();
      //   let txSignatures = transactions.map(tx => {
      //     tx.recentBlockhash = blockhash.blockhash;
      //     return sendAndConfirmTransaction(connection, tx, [user]);
      //   });
      //   txSignatures = await Promise.allSettled(txSignatures);

      //   txSignatures.forEach((txSignature, index) => {
      //     if (txSignature.status === 'fulfilled') {
      //       console.log(`트랜잭션 ${index} 성공: `, txSignature.value);
      //     } else {
      //       console.error(`트랜잭션 ${index} 실패`, txSignature.reason);
      //     }
      //   })
      //   break;
      // }

      test[i] = { childHash1, childHash2 };

      const transaction = await program.methods
        .imageChunkTransaction(Buffer.from(chunks[i]), childHash1, childHash2)
        .accounts({ signer: user.publicKey })
        .signers([user])
        .rpc();

      // transactions.push(transaction);
      txHashs[i] = transaction;
    }

    for (let i = 0; i < chunks.length; i++) {
      if (i * 2 + 1 < chunks.length) {
        console.log("왼쪽 ", test[i].childHash1 == txHashs[i * 2 + 1]);
      }
      if (i * 2 + 2 < chunks.length) {
        console.log("오른쪽 ", test[i].childHash2 == txHashs[i * 2 + 2]);
      }

      console.log(test[i]);
      console.log("1: ", txHashs[i * 2 + 1]);
      console.log("2: ", txHashs[i * 2 + 2]);
    }

    // const txSignatures = await provider.sendAll(transactions.map(tx => ({ tx, signers: [user]})));
    // txHashs[0] = txSignatures[0];

    console.log("tx: ", txHashs[0]);
    await createCardPDA(user, txHashs[0]);
    const cardAccountInfo = await getCardPDA(user.publicKey);
    const imageChunks = await getImageChunks(cardAccountInfo.latestImageTx);
    const imageBuffer = Buffer.concat(imageChunks);
    saveImage(imageBuffer, "iiiiimage.png");
  } catch (error) {
    console.error("청크 에러 : ", error);
  }
};

const splitIntoChunks = (byteArray, size) => {
  const chunks = [];
  let start = 0;
  const length = byteArray.length;

  while (start < length) {
    const chunk = byteArray.slice(start, start + size);
    chunks.push(chunk);
    start += size;
  }

  return chunks;
};

const createCardPDA = async (user, txHash) => {
  const tx = await program.methods
    .createCard(user.publicKey, txHash)
    .accounts({ signer: user.publicKey })
    .signers([user])
    .rpc();

  console.log("createCard: ", tx);
}

const getCardPDA = async (userPublicKey) => {
  const [cardPDA, bump] = await PublicKey.findProgramAddressSync(
    [Buffer.from("card_seed"), userPublicKey.toBuffer()],
    programId
  );

  const cardAccountInfo = await program.account.card.fetch(cardPDA);
  console.log(cardAccountInfo);
  return cardAccountInfo;
}

const getImageChunks = async (latestImageTx) => {
  const imageChunks = [];
  await buildImageChunks(imageChunks, 0, latestImageTx);
  return imageChunks;
}

function deserializeImageChunkTransaction(buffer) {
  let offset = 0;

  // Anchor 프로그램을 사용한다면, 8바이트의 discriminator를 건너뛰어야 합니다.
  const DISCRIMINATOR_LENGTH = 8;
  offset += DISCRIMINATOR_LENGTH;

  // 1. vec<u8> chunkData
  // 배열 길이(u32, Little Endian)를 읽습니다.
  const chunkDataLength = buffer.readUInt32LE(offset);
  offset += 4;
  const chunkData = buffer.slice(offset, offset + chunkDataLength);
  offset += chunkDataLength;

  // 3. Option<string> childHash1
  let childHash1 = null;
  const hasChildHash1 = buffer.readUInt8(offset);
  offset += 1;
  if (hasChildHash1 === 1) {
    const strLength = buffer.readUInt32LE(offset);
    offset += 4;
    childHash1 = buffer.slice(offset, offset + strLength).toString('utf-8');
    offset += strLength;
  }

  // 4. Option<string> childHash2
  let childHash2 = null;
  const hasChildHash2 = buffer.readUInt8(offset);
  offset += 1;
  if (hasChildHash2 === 1) {
    const strLength = buffer.readUInt32LE(offset);
    offset += 4;
    childHash2 = buffer.slice(offset, offset + strLength).toString('utf-8');
    offset += strLength;
  }

  return {
    chunkData,
    childHash1,
    childHash2,
  };
}

const buildImageChunks = async (imageChunks, index, txHash) => {
  if (!txHash) {
    return;
  }

  const txInfo = await connection.getTransaction(txHash, {
    commitment: "confirmed",
    maxSupportedTransactionVersion: 0
  });

  const base58Data = txInfo.transaction.message.instructions[0].data;
  const decodedData = bs58.decode(base58Data);
  const buffer = Buffer.from(decodedData);
  const deserialized = deserializeImageChunkTransaction(buffer);
  console.log("index : ", index);

  imageChunks[index] = deserialized.chunkData;
  await buildImageChunks(imageChunks, index * 2 + 1, deserialized.childHash1);
  await buildImageChunks(imageChunks, index * 2 + 2, deserialized.childHash2);
}

async function saveImage(buffer, filename) {
  await fs.writeFile(filename, buffer);
  console.log(`${filename} 저장 완료!`);
}


// 0번 tx를 pda저장하고 create_card에 넣기
// pda에 저장된 트랜잭션 해시 불러와서
// 0번부터 트리구조로 읽어오기
// 읽어온 데이터를 이미지로 합치기