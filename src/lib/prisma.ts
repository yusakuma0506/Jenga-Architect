import { Pool } from 'pg';
import { PrismaPg } from '@prisma/adapter-pg';
import { PrismaClient } from '@prisma/client';

const connectionString = process.env.DATABASE_URL;

const pool = new Pool({
  connectionString,
  max: 10,
  ssl: {
    rejectUnauthorized: false,
  }
});

const adapter = new PrismaPg(pool as any); 

const prismaClientSingleton = () => {
  return new PrismaClient({
    adapter,
  });
};

// declare const globalThis: {
//   prismaGlobal: ReturnType<typeof prismaClientSingleton> | undefined;
// } & typeof global;

// export const prisma = globalThis.prismaGlobal ?? prismaClientSingleton();

// if (process.env.NODE_ENV !== 'production') {
//   globalThis.prismaGlobal = prisma;
// }

// ✅ FIX: Use 'declare global' instead of 'declare const globalThis'
declare global {
  var prismaGlobal: ReturnType<typeof prismaClientSingleton> | undefined;
}

// ✅ Use 'globalThis' directly without re-declaring it
export const prisma = globalThis.prismaGlobal ?? prismaClientSingleton();

if (process.env.NODE_ENV !== 'production') {
  globalThis.prismaGlobal = prisma;
}