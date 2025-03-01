use anchor_lang::prelude::*;

declare_id!("4gwbY6ojH76FH4FkXeFyP4Miopi6G3dqU5fYwYeVzJa4");

#[program]
pub mod solstice {
    use super::*;

    pub fn image_chunk_transaction(_ctx: Context<ImageChunkTransactionAccounts>, _chunk_data: Vec<u8>, _child_hash1: String, _child_hash2: String) -> Result<()> {
        Ok(())
    }

    pub fn create_card(ctx: Context<CardAccounts>, owner: Pubkey, latest_image_tx: String) -> Result<()> {
        ctx.accounts.card_account.owner = owner;
        ctx.accounts.card_account.latest_image_tx = latest_image_tx;
        Ok(())
    }

    pub fn update_card(ctx: Context<UpdateAccount>, owner: Pubkey, latest_image_tx: String) -> Result<()> {
        let program_owner = &ID;

        if ctx.accounts.card_account.owner == owner || *program_owner == ctx.accounts.card_account.owner {
            ctx.accounts.card_account.latest_image_tx = latest_image_tx;
            Ok(())
        } else {
            Err(CardError::Unauthorized.into())
        }
    }

    #[error_code]
    pub enum CardError {
        #[msg("Unauthorized: Only the owner or the program owner can update this card.")]
        Unauthorized,
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
        seeds = [b"card_seed", user.key.as_ref()],
        bump,
    )]
    pub card_account: Account<'info, Card>,

    #[account(mut)]
    pub user: Signer<'info>,
    pub system_program: Program<'info, System>,
}

#[derive(Accounts)]
pub struct UpdateAccount<'info> {
    #[account(mut)]
    pub card_account: Account<'info, Card>,
    pub user: Signer<'info>,
    pub system_program: Program<'info, System>,
}

#[account]
pub struct Card {
    owner: Pubkey,
    latest_image_tx: String,
}