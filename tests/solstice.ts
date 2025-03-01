import * as anchor from "@coral-xyz/anchor";
import { Program } from "@coral-xyz/anchor";
import { Solstice } from "../target/types/solstice";
import { Keypair, SystemProgram } from "@solana/web3.js";
import fs from "fs";
import { expect } from "chai";

describe("solstice", () => {
  anchor.setProvider(anchor.AnchorProvider.env());

  const program = anchor.workspace.Solstice as Program<Solstice>;

  async function getCard(owner: anchor.web3.Keypair) {
    const [cardAccount, bump] = anchor.web3.PublicKey.findProgramAddressSync(
      [Buffer.from("card_seed"), owner.publicKey.toBuffer()],
      program.programId
    );
    return { cardAccount, bump };
  }

  it("Image Chunk Transaction", async () => {
    const user = anchor.web3.Keypair.generate();

    const testData = Buffer.from([1, 2, 3, 4, 5]);
    const hash1 = "string";
    const hash2 = "string";

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
    const latest_image_tx = owner.publicKey.toString();
    const payer = owner;

    const { cardAccount, bump } = await getCard(owner);

    const tx = await program.methods
      .createCard(owner.publicKey, latest_image_tx.toString())
      .accounts({
        cardAccount: cardAccount,
        user: payer.publicKey,
        systemProgram: SystemProgram.programId,
      })
      .signers([payer])
      .rpc();

    const accountData = await program.account.card.fetch(cardAccount);
    expect(accountData.owner.toString()).to.equal(owner.publicKey.toString());
  });

  it("Update Card", async () => {
    const secretKey = Uint8Array.from(
      JSON.parse(
        fs.readFileSync(`${process.env.HOME}/.config/solana/id.json`, "utf8")
      )
    );
    const owner = Keypair.fromSecretKey(secretKey);
    const { cardAccount, bump } = await getCard(owner);

    const update_image_tx = "11111111111111111111111111111111";

    const tx2 = await program.methods
      .updateCard(owner.publicKey, update_image_tx)
      .accounts({ cardAccount: cardAccount })
      .rpc();

    const cardDataAfter = await program.account.card.fetch(cardAccount);
    expect(cardDataAfter.latestImageTx.toString()).to.equal(update_image_tx);
  });
});
