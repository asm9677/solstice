import * as anchor from "@coral-xyz/anchor";
import { Program } from "@coral-xyz/anchor";
import { Solstice } from "../target/types/solstice";
import { PublicKey } from "@solana/web3.js";

describe("solstice", () => {
  // Configure the client to use the local cluster.
  anchor.setProvider(anchor.AnchorProvider.env());

  const program = anchor.workspace.Solstice as Program<Solstice>;

  it("Image chunk transaction", async () => {
    const user = anchor.web3.Keypair.generate();

    const testData = Buffer.from([1, 2, 3, 4, 5]); // 바이너리 데이터
    const hash1 = null;
    const hash2 = null;

    const tx = await program.methods
      .imageChunkTransaction(testData, hash1, hash2)
      .accounts({
        signer: user.publicKey, // 유저 계정
      })
      .signers([user]) // 서명자 추가
      .rpc();
  });
});
