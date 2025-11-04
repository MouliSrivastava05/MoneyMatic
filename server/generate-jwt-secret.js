// Quick script to generate a secure JWT secret
import crypto from 'crypto';

const secret = crypto.randomBytes(64).toString('hex');
console.log('\n🔐 Generated JWT Secret:');
console.log('='.repeat(60));
console.log(secret);
console.log('='.repeat(60));
console.log('\n📝 Add this to your .env file:');
console.log(`JWT_SECRET=${secret}\n`);

