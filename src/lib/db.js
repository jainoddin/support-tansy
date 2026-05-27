import { PrismaClient } from '@prisma/client';
import { PrismaLibSql } from '@prisma/adapter-libsql';

process.env.DATABASE_URL = process.env.DATABASE_URL || "file:./dev.db";

const adapter = new PrismaLibSql({
  url: 'file:./dev.db',
});

const prismaClientSingleton = () => {
  return new PrismaClient({
    adapter,
  });
};

// We are bypassing globalThis.prisma caching so the dev server uses the fixed adapter
const prisma = prismaClientSingleton();

export default prisma;
