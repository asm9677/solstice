use anchor_lang::prelude::*;

declare_id!("3yC1TZXgWjH25ULMC1ibj8csVdArPXFKt6tNAnqUqBLt");

#[program]
pub mod solstice {
    use super::*;

    pub fn imageChunkTransaction(_ctx: Context<ImageChunkTransactionAccounts>, data: Vec<u8>, hash1: Option<Pubkey>, hash2: Option<Pubkey>) -> Result<String> {
        msg!("Received data length: {}", data.len());
        // msg!("Received key1: {}", hash1.unwrap());
        // msg!("Received key2: {}", hash2.unwrap());
        Ok(data.len().to_string())
    }
}

#[derive(Accounts)]
pub struct ImageChunkTransactionAccounts<'info> {
    pub signer: Signer<'info>,
}