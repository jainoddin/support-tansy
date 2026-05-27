let prismaInstance = null;

const getPrisma = () => {
  if (!prismaInstance) {
    const { PrismaClient } = require('@prisma/client');
    const { PrismaLibSql } = require('@prisma/adapter-libsql');
    
    process.env.DATABASE_URL = process.env.DATABASE_URL || "file:./dev.db";
    const adapter = new PrismaLibSql({
      url: process.env.DATABASE_URL,
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
