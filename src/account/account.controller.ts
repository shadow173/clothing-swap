import { Body, Controller, Get, Post } from "@nestjs/common";
import { AccountService } from "./account.service";
import { Account } from "@prisma/client";

@Controller("account")
export class AccountController {
    public constructor(private accountService: AccountService) {}

    @Get("getAccounts")
    public async getAccounts(): Promise<Account[]> {
        return this.accountService.getAccounts();
    }

    @Post("createAccount")
    public async createAccount(@Body() accountData: Account) {
        await this.accountService.createAccount(
            accountData.email,
            accountData.password,
            "accountData",
            ""
        );

        return { success: true };
    }
}