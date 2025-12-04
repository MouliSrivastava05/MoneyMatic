import 'dotenv/config';
import { PrismaClient } from '@prisma/client';

// Create Prisma Client (Prisma 6 - standard configuration)
const prisma = new PrismaClient({
  log: process.env.NODE_ENV === 'development' ? ['error', 'warn'] : ['error'],
});

// Handle graceful shutdown
process.on('beforeExit', async () => {
  await prisma.$disconnect();
});

export default prisma;

