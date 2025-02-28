import * as anchor from "@coral-xyz/anchor";
import { Program } from "@coral-xyz/anchor";
import { Solstice } from "../target/types/solstice";
import { Keypair, SystemProgram } from "@solana/web3.js";
import fs from "fs";
import { expect } from "chai";

describe("solstice", () => {
  anchor.setProvider(anchor.AnchorProvider.env());

  const program = anchor.workspace.Solstice as Program<Solstice>;

  it("Image Chunk Transaction", async () => {
    const user = anchor.web3.Keypair.generate();

    const testData = Buffer.from([1, 2, 3, 4, 5]);
    const hash1 = null;
    const hash2 = null;

    const tx = await program.methods
      .imageChunkTransaction(testData, hash1, hash2)
      .accounts({
        signer: user.publicKey,
      })
      .signers([user])
      .rpc();
  });

  it("Create Card", async () => {
    const secretKey = Uint8Array.from(
      JSON.parse(
        fs.readFileSync(`${process.env.HOME}/.config/solana/id.json`, "utf8")
      )
    );
    const owner = Keypair.fromSecretKey(secretKey);
    const latest_image_tx = owner;
    const payer = owner;
    const cardAccount = Keypair.generate();

    const tx = await program.methods
      .createCard(owner.publicKey, latest_image_tx.publicKey)
      .accounts({
        cardAccount: cardAccount.publicKey,
        user: payer.publicKey,
        systemProgram: SystemProgram.programId,
      })
      .signers([payer, cardAccount])
      .rpc();

    const accountData = await program.account.card.fetch(cardAccount.publicKey);
    expect(accountData.owner.toString()).to.equal(owner.publicKey.toString());
  });
});
