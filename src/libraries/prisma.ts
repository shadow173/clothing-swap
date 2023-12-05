import { PrismaClient } from "@prisma/client";

export let prisma: PrismaClient;

export const prismaLibrary = (): void => {
  prisma ??= new PrismaClient({
    datasources: {
      db: {
        url: `postgresql://cswap:cswap@localhost:5432/cswap`,
      },
    },
  });
};
