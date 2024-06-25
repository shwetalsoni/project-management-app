// eslint-disable-next-line @typescript-eslint/ban-ts-comment
//  @ts-nocheck

import { PrismaClient } from "@prisma/client";

import { env } from "@/env";

let prisma: PrismaClient;
if (env.NODE_ENV === "production") {
  prisma = new PrismaClient();
} else {
  if (!global.prisma) {
    global.prisma = new PrismaClient();
  }
  // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
  prisma = global.prisma;
}

export default prisma;
