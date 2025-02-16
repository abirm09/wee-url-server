import { Prisma, PrismaClient } from "@prisma/client";
import { DefaultArgs } from "@prisma/client/runtime/library";

export type TPrismaClientInstance =
  | PrismaClient<Prisma.PrismaClientOptions, never, DefaultArgs>
  | Omit<
      PrismaClient<Prisma.PrismaClientOptions, never, DefaultArgs>,
      "$connect" | "$disconnect" | "$on" | "$transaction" | "$use" | "$extends"
    >;
