import { PrismaClient } from '@prisma/client';
import dotenv from 'dotenv';

dotenv.config();

const testConnection = async () => {
  console.log('Testing Prisma connection to Aiven...\n');
  
  const prisma = new PrismaClient({
    log: ['query', 'info', 'warn', 'error'],
  });
  
  try {
    console.log('Connecting...');
    await prisma.$connect();
    console.log('✅ Connection successful!\n');
    
    // Test a simple query
    const result = await prisma.$queryRaw`SELECT 1 as test`;
    console.log('✅ Query test:', result);
    
    await prisma.$disconnect();
    console.log('\n✅ All tests passed!');
    
  } catch (error) {
    console.error('\n❌ Connection failed:', error.message);
    console.error('Error code:', error.code);
    
    if (error.code === 'P1001') {
      console.log('\n💡 Suggestions:');
      console.log('1. Verify service is "Running" in Aiven dashboard');
      console.log('2. Check that port 26676 is correct (from Aiven dashboard)');
      console.log('3. Verify password is correct (click "Show" in Aiven)');
      console.log('4. Try restarting the Aiven service');
      console.log('5. Wait 2-3 minutes if service was just created');
    }
  }
};

testConnection();

