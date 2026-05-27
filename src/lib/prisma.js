import { PrismaClient } from '../generated/client/client.ts';

let prismaInstance = null;

const getPrisma = () => {
  if (!prismaInstance) {
    const { PrismaLibSql } = require('@prisma/adapter-libsql');
    
    let dbUrl = process.env.DATABASE_URL;
    if (!dbUrl) {
      dbUrl = process.env.VERCEL ? "file:/tmp/dev.db" : "file:./dev.db";
    }
    
    const adapter = new PrismaLibSql({
      url: dbUrl,
    });
    prismaInstance = new PrismaClient({ adapter });
  }
  return prismaInstance;
};

const prisma = new Proxy({}, {
  get(target, prop) {
    return getPrisma()[prop];
  }
});

export default prisma;
