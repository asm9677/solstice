use anchor_lang::prelude::*;

declare_id!("EsjGSxfqv9jtBDWmUpPypj58uatCaqppPD7sCULujXAu");

#[program]
pub mod solstice {
    use super::*;

    pub fn image_chunk_transaction(_ctx: Context<ImageChunkTransactionAccounts>, _chunk_data: Vec<u8>, _child_hash1: Option<String>, _child_hash2: Option<String>) -> Result<()> {
        Ok(())
    }

    pub fn create_card(ctx: Context<CardAccounts>, owner: Pubkey, latest_image_tx: String, file_ext: String) -> Result<()> {
        ctx.accounts.card_account.owner = owner;
        ctx.accounts.card_account.latest_image_tx = latest_image_tx;
        ctx.accounts.card_account.file_ext = file_ext;
        Ok(())
    }

    pub fn update_card(ctx: Context<UpdateAccount>, owner: Pubkey, latest_image_tx: String, file_ext: String) -> Result<()> {
        ctx.accounts.card_account.latest_image_tx = latest_image_tx;
        ctx.accounts.card_account.file_ext = file_ext;      
        Ok(())        
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
        payer = owner,
        space = 8 + 33 + 88 + 10,
        seeds = [b"card_seed", user.key.as_ref()],
        bump,
    )]
    pub card_account: Account<'info, Card>,    

    /// CHECK: This account is used only for deriving the PDA and does not require any checks.
    pub user: AccountInfo<'info>,

    #[account(mut)]
    pub owner: Signer<'info>,
    pub system_program: Program<'info, System>,
}

#[derive(Accounts)]
pub struct UpdateAccount<'info> {
    #[account(mut)]
    pub card_account: Account<'info, Card>,
    pub owner: Signer<'info>,
    pub system_program: Program<'info, System>,
}

#[account]
pub struct Card {
    owner: Pubkey,
    latest_image_tx: String,
    file_ext: String
}