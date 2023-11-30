import { Controller, Get } from "@nestjs/common";
import { UserService } from "./user.service";
import type { User } from "@prisma/client";

@Controller("user")
export class UserController {
    public constructor(private userService: UserService) {}

    @Get("getUsers")
    public async getUsers(): Promise<User[]> {
        return this.userService.getUsers();
    }
}