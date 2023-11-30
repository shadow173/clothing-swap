import { Injectable } from "@nestjs/common";
import type { Account } from "@prisma/client";
import { PrismaService } from "src/prisma.service";

@Injectable()
export class AccountService {
    public constructor(private prisma: PrismaService) {}

    public async getAccounts(): Promise<Account[]> {
        return this.prisma.account.findMany();
    }
}