import prisma from './prisma/client.js';
import dotenv from 'dotenv';

dotenv.config();

async function testDatabase() {
  console.log('🔍 Testing Database Connection...\n');
  
  // Mask the password in DATABASE_URL for display
  const dbUrl = process.env.DATABASE_URL || 'Not set';
  const maskedUrl = dbUrl.replace(/:[^:@]+@/, ':****@');
  console.log(`📡 Database URL: ${maskedUrl}\n`);

  try {
    // Test 1: Basic Connection
    console.log('1️⃣ Testing basic connection...');
    await prisma.$connect();
    console.log('   ✅ Connected successfully!\n');

    // Small delay to ensure connection is stable
    await new Promise(resolve => setTimeout(resolve, 500));

    // Test 2: Query Users table
    console.log('2️⃣ Testing User table query...');
    const userCount = await prisma.user.count();
    console.log(`   ✅ User table accessible. Total users: ${userCount}\n`);

    // Test 3: Query Transactions table
    console.log('3️⃣ Testing Transaction table query...');
    const transactionCount = await prisma.transaction.count();
    console.log(`   ✅ Transaction table accessible. Total transactions: ${transactionCount}\n`);

    // Test 4: Query Budgets table
    console.log('4️⃣ Testing Budget table query...');
    const budgetCount = await prisma.budget.count();
    console.log(`   ✅ Budget table accessible. Total budgets: ${budgetCount}\n`);

    // Test 5: Query Reminders table
    console.log('5️⃣ Testing Reminder table query...');
    const reminderCount = await prisma.reminder.count();
    console.log(`   ✅ Reminder table accessible. Total reminders: ${reminderCount}\n`);

    // Test 6: Test a simple query with relations (only if users exist)
    if (userCount > 0) {
      console.log('6️⃣ Testing relations and joins...');
      const userWithData = await prisma.user.findFirst({
        include: {
          transactions: true,
          budgets: true,
          reminders: true,
        },
      });
      if (userWithData) {
        console.log(`   ✅ Relations working. Found user: ${userWithData.name}`);
        console.log(`      - Transactions: ${userWithData.transactions.length}`);
        console.log(`      - Budgets: ${userWithData.budgets.length}`);
        console.log(`      - Reminders: ${userWithData.reminders.length}\n`);
      }
    } else {
      console.log('6️⃣ Skipping relations test (no users found yet)\n');
    }

    // Test 7: Test raw query
    console.log('7️⃣ Testing raw SQL query...');
    const rawResult = await prisma.$queryRaw`SELECT 1 as test`;
    console.log(`   ✅ Raw queries working. Result: ${JSON.stringify(rawResult)}\n`);

    console.log('🎉 All database tests passed! Database is working correctly.\n');
    
    // Summary
    console.log('📊 Database Summary:');
    console.log(`   - Users: ${userCount}`);
    console.log(`   - Transactions: ${transactionCount}`);
    console.log(`   - Budgets: ${budgetCount}`);
    console.log(`   - Reminders: ${reminderCount}\n`);

  } catch (error) {
    console.error('❌ Database test failed!\n');
    console.error('Error details:');
    console.error(`   Message: ${error.message}`);
    console.error(`   Code: ${error.code || 'N/A'}`);
    
    if (error.code === 'P1001') {
      console.error('\n💡 Possible solutions:');
      console.error('   1. Check if your database service is running');
      console.error('   2. Verify your IP is whitelisted in Aiven');
      console.error('   3. Check DATABASE_URL in .env file');
      console.error('   4. Verify network connectivity to database host');
    } else if (error.code === 'P2002') {
      console.error('\n💡 This is a unique constraint error (expected in some cases)');
    } else if (error.code === 'P2025') {
      console.error('\n💡 Record not found (expected in some cases)');
    } else {
      console.error('\n💡 Check:');
      console.error('   1. Database schema is up to date (run: npm run prisma:push)');
      console.error('   2. Prisma client is generated (run: npm run prisma:generate)');
      console.error('   3. Database credentials are correct');
    }
    
    process.exit(1);
  } finally {
    await prisma.$disconnect();
    console.log('🔌 Disconnected from database.');
  }
}

testDatabase();

