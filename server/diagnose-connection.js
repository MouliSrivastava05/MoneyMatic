import mysql from 'mysql2/promise';
import dotenv from 'dotenv';

dotenv.config();

const diagnoseConnection = async () => {
  const url = process.env.DATABASE_URL;
  console.log('🔍 Diagnosing Aiven Connection...\n');
  console.log('DATABASE_URL (masked):', url.replace(/:[^:@]+@/, ':****@'));
  console.log('');
  
  try {
    // Parse DATABASE_URL
    const urlMatch = url.match(/mysql:\/\/([^:]+):([^@]+)@([^:]+):(\d+)\/([^?]+)/);
    if (!urlMatch) {
      console.error('❌ Invalid DATABASE_URL format');
      console.error('Expected: mysql://USER:PASS@HOST:PORT/DB?sslmode=require');
      return;
    }
    
    const [, user, password, host, port, database] = urlMatch;
    
    console.log('📋 Connection Details:');
    console.log('  Host:', host);
    console.log('  Port:', port);
    console.log('  Database:', database);
    console.log('  User:', user);
    console.log('  SSL: Required\n');
    
    console.log('🔌 Attempting connection...');
    
    // Test connection with detailed error handling
    // Aiven requires SSL but doesn't verify certificate for client
    const connection = await mysql.createConnection({
      host,
      port: parseInt(port),
      user,
      password,
      database,
      ssl: {
        rejectUnauthorized: false,
        minVersion: 'TLSv1.2'
      },
      connectTimeout: 15000, // 15 second timeout
    });
    
    console.log('✅ Connection successful!');
    
    // Test a simple query
    const [rows] = await connection.execute('SELECT 1 as test');
    console.log('✅ Query test successful:', rows);
    
    await connection.end();
    
    console.log('\n✅ All tests passed! Your database is ready.');
    console.log('\n📝 Next step: Run "npm run prisma:push" to create tables.');
    
  } catch (error) {
    console.error('\n❌ Connection failed!\n');
    console.error('Error:', error.message);
    console.error('Error code:', error.code);
    
    console.log('\n🔍 Diagnostic Information:');
    
    if (error.code === 'ETIMEDOUT' || error.code === 'ECONNREFUSED') {
      console.log('\n⏱️  Connection timeout/refused. Possible causes:');
      console.log('  1. ✅ IP allowlist is "Open to all" (you confirmed this)');
      console.log('  2. ❓ Service might not be in "Running" state');
      console.log('  3. ❓ Service might still be provisioning');
      console.log('  4. ❓ Local firewall blocking port 25060');
      console.log('  5. ❓ Network connectivity issue');
      console.log('\n📋 Action Items:');
      console.log('  → Check Aiven dashboard: Is service status "Running"?');
      console.log('  → Check Aiven dashboard: Connection info matches your .env?');
      console.log('  → Wait 2-3 minutes if service was just created');
      console.log('  → Try restarting the Aiven service');
    } else if (error.code === 'ER_ACCESS_DENIED_ERROR') {
      console.log('\n🔐 Authentication failed. Check:');
      console.log('  → Username and password in .env');
      console.log('  → Password might have special characters that need URL encoding');
    } else if (error.code === 'ER_BAD_DB_ERROR') {
      console.log('\n🗄️  Database not found. Check:');
      console.log('  → Database name in .env matches Aiven dashboard');
      console.log('  → Default database is usually "defaultdb"');
    }
    
    console.log('\n💡 Tip: Verify connection details in Aiven dashboard:');
    console.log('   Service → Overview → Connection information');
  }
};

diagnoseConnection();

