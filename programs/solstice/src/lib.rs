use anchor_lang::prelude::*;

declare_id!("EsjGSxfqv9jtBDWmUpPypj58uatCaqppPD7sCULujXAu");

#[program]
pub mod solstice {
    use super::*;

    pub fn initialize(ctx: Context<Initialize>) -> Result<()> {
        msg!("Greetings from: {:?}", ctx.program_id);
        Ok(())
    }
}

#[derive(Accounts)]
pub struct Initialize {}
