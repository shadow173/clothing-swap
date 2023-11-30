import { Injectable } from "@nestjs/common";
import type { User } from "@prisma/client";
import { PrismaService } from "src/prisma.service";

@Injectable()
export class UserService {
    public constructor(private prisma: PrismaService) {}

    public async getUsers(): Promise<User[]> {
        return this.prisma.user.findMany();
    }
}