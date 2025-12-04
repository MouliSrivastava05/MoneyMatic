import 'dotenv/config';
import { PrismaClient } from '@prisma/client';
import { PrismaMariaDb } from '@prisma/adapter-mariadb';
import mariadb from 'mariadb';

// Parse DATABASE_URL for better compatibility
const parseDatabaseUrl = (url) => {
  const match = url.match(/mysql:\/\/([^:]+):([^@]+)@([^:]+):(\d+)\/([^?]+)/);
  if (!match) {
    throw new Error('Invalid DATABASE_URL format');
  }
  const [, user, password, host, port, database] = match;
  return { host, port: parseInt(port), user, password, database };
};

const dbConfig = parseDatabaseUrl(process.env.DATABASE_URL);

const pool = mariadb.createPool({
  ...dbConfig,
  connectionLimit: 10,
  acquireTimeout: 60000, // 60 seconds
  timeout: 60000, // 60 seconds
  reconnect: true,
  idleTimeout: 300000, // 5 minutes
  ssl: {
    rejectUnauthorized: false
  }
});

const adapter = new PrismaMariaDb(pool);

const prisma = new PrismaClient({
  adapter,
  log: process.env.NODE_ENV === 'development' ? ['query', 'error', 'warn'] : ['error'],
});

// Handle graceful shutdown
process.on('beforeExit', async () => {
  await prisma.$disconnect();
});

export default prisma;

