import 'dotenv/config';

// Load environment variables
const databaseUrl = process.env.DATABASE_URL || '';

export default {
  schema: './prisma/schema.prisma',
  datasource: {
    url: databaseUrl,
  },
};

