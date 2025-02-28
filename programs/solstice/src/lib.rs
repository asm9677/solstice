use anchor_lang::prelude::*;

declare_id!("3yC1TZXgWjH25ULMC1ibj8csVdArPXFKt6tNAnqUqBLt");

#[program]
pub mod solstice {
    use super::*;

    pub fn image_chunk_transaction(_ctx: Context<ImageChunkTransactionAccounts>, _chunk_data: Vec<u8>, _child_hash1: String, _child_hash2: String) -> Result<()> {
        Ok(())
    }

    pub fn create_card(ctx: Context<CardAccounts>, owner: Option<Pubkey>, latest_image_tx: String) -> Result<()> {
        ctx.accounts.card_account.owner = owner.unwrap();
        ctx.accounts.card_account.latest_image_tx = latest_image_tx;
        Ok(())
    }
}

#[derive(Accounts)]
pub struct ImageChunkTransactionAccounts<'info> {
    pub signer: Signer<'info>,
}

#[derive(Accounts)]
pub struct CardAccounts<'info> {
    #[account(
        init,
        payer = user,
        space = 8 + 33 + 88,
    )]
    pub card_account: Account<'info, Card>,

    #[account(mut)]
    pub user: Signer<'info>,
    pub system_program: Program<'info, System>,
}

#[account]
pub struct Card {
    owner: Pubkey,
    latest_image_tx: String,
}