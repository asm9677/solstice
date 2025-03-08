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
import bs58 from "bs58";

const NONCE_ACCOUNTS_FILE = "./nonceAccounts.json";
const TOTAL_TRANSACTIONS = 700;
const BATCH_SIZE = 5; // 한 배치당 nonce 계정 20개 사용

const secretKey = Uint8Array.from(
  JSON.parse(await fs.readFile(`${process.env.HOME}/.config/solana/id.json`, "utf8"))
);
const user = Keypair.fromSecretKey(secretKey);

const connection = new Connection("http://localhost:8899", {
  commitment: "confirmed",
  confirmTransactionInitialTimeout: 1000, // 3초
});

const wallet = new Wallet(user);
const provider = new AnchorProvider(connection, wallet, {
  preflightCommitment: "confirmed",
  commitment: "confirmed",
  confirmTransactionInitialTimeout: 1000,
});

const programId = new PublicKey("EsjGSxfqv9jtBDWmUpPypj58uatCaqppPD7sCULujXAu");
const program = new Program(idl, provider);

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
  let storedAccounts = [];

  try {
    const data = await fs.readFile(NONCE_ACCOUNTS_FILE, "utf8");
    storedAccounts = JSON.parse(data);
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

/**
 * 주어진 배치 내에서 nonce 계정 풀(20개)을 재사용하여 트랜잭션을 생성합니다.
 * 각 트랜잭션은 nonce 계정 풀의 해당 인덱스(i)를 사용합니다.
 */
async function createTransactionsForBatch(startIndex, batchSize, totalTransactions, nonceAccountsPool) {
  let transactions = [];
  for (let i = 0; i < batchSize; i++) {
    const overallIndex = startIndex + i;
    if (overallIndex >= totalTransactions) break;

    // 배치마다 같은 nonce 계정 풀에서 순서대로 사용
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

    // 프로그램 인스트럭션 추가 (예제)
    const buffer = Buffer.alloc(800, overallIndex); // 실제 데이터에 맞게 변경
    const instruction = await program.methods
      .imageChunkTransaction(buffer, "", "") // 실제 메서드명과 인자에 맞게 수정
      .accounts({ signer: [user] })
      .signers([user])
      .instruction();
    transaction.add(instruction);

    transaction.sign(user);
    transactions.push(transaction);
  }
  return transactions;
}

/**
 * 700개의 트랜잭션을 20개씩 배치하여 병렬 전송합니다.
 * 각 배치에서는 동일한 20개의 nonce 계정을 재사용합니다.
 */
const sendBatches = async () => {
  const totalBatches = Math.ceil(TOTAL_TRANSACTIONS / BATCH_SIZE);
  // BATCH_SIZE(20)개의 nonce 계정만 준비합니다.
  const nonceAccountsPool = await loadNonceAccountsPool(BATCH_SIZE);

  for (let b = 0; b < totalBatches; b++) {
    const startIndex = b * BATCH_SIZE;
    console.log(`배치 ${b + 1}/${totalBatches} 시작 (트랜잭션 ${startIndex} 부터)...`);

    const transactions = await createTransactionsForBatch(
      startIndex,
      BATCH_SIZE,
      TOTAL_TRANSACTIONS,
      nonceAccountsPool
    );

    const results = await Promise.allSettled(
      transactions.map((tx) =>
        sendAndConfirmTransaction(connection, tx, [user]).catch((e) => e)
      )
    );

    results.forEach((result, i) => {
      const overallIndex = startIndex + i;
      if (result.status === "fulfilled") {
        console.log(`✅ 트랜잭션 ${overallIndex} 성공:`, result.value.signature);
      } else {
        console.error(`❌ 트랜잭션 ${overallIndex} 실패:`, result.reason);
      }
    });
  }
};

sendBatches();
