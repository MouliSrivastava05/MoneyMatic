import mysql from 'mysql2/promise';
import dotenv from 'dotenv';

dotenv.config();

const testConnection = async () => {
  const url = process.env.DATABASE_URL;
  console.log('Testing connection to:', url.replace(/:[^:@]+@/, ':****@')); // Hide password
  
  try {
    // Parse DATABASE_URL
    const urlMatch = url.match(/mysql:\/\/([^:]+):([^@]+)@([^:]+):(\d+)\/([^?]+)/);
    if (!urlMatch) {
      console.error('❌ Invalid DATABASE_URL format');
      return;
    }
    
    const [, user, password, host, port, database] = urlMatch;
    
    const connection = await mysql.createConnection({
      host,
      port: parseInt(port),
      user,
      password,
      database,
      ssl: {
        rejectUnauthorized: false
      }
    });
    
    console.log('✅ Connection successful!');
    await connection.end();
    
    // Test with Prisma
    console.log('\nTesting Prisma connection...');
    const { PrismaClient } = await import('@prisma/client');
    const prisma = new PrismaClient();
    
    await prisma.$connect();
    console.log('✅ Prisma connection successful!');
    await prisma.$disconnect();
    
  } catch (error) {
    console.error('❌ Connection failed:', error.message);
    console.error('\nPossible issues:');
    console.error('1. Aiven service might not be running');
    console.error('2. Your IP might not be whitelisted in Aiven');
    console.error('3. Check Aiven dashboard → Service → Overview → Connection info');
    console.error('4. Verify the service is in "Running" state');
  }
};

testConnection();

