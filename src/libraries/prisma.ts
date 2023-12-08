import { PrismaClient } from "@prisma/client";

export let prisma: PrismaClient;

export const prismaLibrary = (): void => {
  prisma ??= new PrismaClient();
};
