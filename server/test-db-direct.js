import mariadb from 'mariadb';
import dotenv from 'dotenv';

dotenv.config();

async function testDirectConnection() {
  console.log('🔍 Testing Direct Database Connection...\n');
  
  const dbUrl = process.env.DATABASE_URL || 'Not set';
  const maskedUrl = dbUrl.replace(/:[^:@]+@/, ':****@');
  console.log(`📡 Database URL: ${maskedUrl}\n`);

  try {
    // Parse DATABASE_URL
    const urlMatch = dbUrl.match(/mysql:\/\/([^:]+):([^@]+)@([^:]+):(\d+)\/([^?]+)/);
    if (!urlMatch) {
      console.error('❌ Invalid DATABASE_URL format');
      return;
    }
    
    const [, user, password, host, port, database] = urlMatch;
    
    console.log('1️⃣ Testing direct MariaDB connection...');
    const connection = await mariadb.createConnection({
      host,
      port: parseInt(port),
      user,
      password,
      database,
      ssl: {
        rejectUnauthorized: false
      },
      connectTimeout: 30000,
    });
    
    console.log('   ✅ Direct connection successful!\n');
    
    // Check what tables exist first
    console.log('2️⃣ Checking available tables...');
    const tablesResult = await connection.query('SHOW TABLES');
    const tables = Array.isArray(tablesResult) ? tablesResult : [tablesResult];
    const tableNames = tables.map(t => {
      const values = Object.values(t);
      return values[0];
    }).filter(Boolean);
    
    if (tableNames.length > 0) {
      console.log(`   ✅ Found ${tableNames.length} table(s): ${tableNames.join(', ')}\n`);
      
      // Test all tables
      console.log('3️⃣ Testing table queries...');
      
      for (const table of tableNames) {
        try {
          const rows = await connection.query(`SELECT COUNT(*) as count FROM \`${table}\``);
          const count = Array.isArray(rows) ? rows[0]?.count : rows?.count;
          console.log(`   ✅ ${table}: ${count || 0} records`);
        } catch (err) {
          console.log(`   ⚠️  ${table}: ${err.message}`);
        }
      }
      console.log();
    } else {
      console.log('   ⚠️  No tables found. Database might need migrations.\n');
      console.log('   💡 Run: npm run prisma:push\n');
    }
    
    await connection.end();
    console.log('\n✅ All direct connection tests passed!\n');
    
  } catch (error) {
    console.error('❌ Direct connection test failed!\n');
    console.error('Error details:');
    console.error(`   Message: ${error.message}`);
    console.error(`   Code: ${error.code || 'N/A'}`);
    
    if (error.code === 'ECONNREFUSED') {
      console.error('\n💡 Possible solutions:');
      console.error('   1. Database service might be down');
      console.error('   2. Check if your IP is whitelisted in Aiven');
      console.error('   3. Verify the host and port are correct');
    } else if (error.code === 'ER_ACCESS_DENIED_ERROR') {
      console.error('\n💡 Authentication failed - check username and password');
    } else if (error.code === 'ER_BAD_DB_ERROR') {
      console.error('\n💡 Database does not exist - check database name');
    }
    
    process.exit(1);
  }
}

testDirectConnection();

