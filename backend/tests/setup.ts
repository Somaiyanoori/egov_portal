import { beforeAll, afterAll, beforeEach } from 'vitest';
import { PrismaClient } from '@prisma/client';
import dotenv from 'dotenv';
import path from 'path';

// Load test environment variables
dotenv.config({ path: path.resolve(__dirname, '../.env.test') });

// Ensure test environment
process.env.NODE_ENV = 'test';

const prisma = new PrismaClient();

beforeAll(async () => {
  // Connect to test database
  await prisma.$connect();
});

beforeEach(async () => {
  // Clean database before each test
  const tablenames = await prisma.$queryRaw<Array<{ tablename: string }>>`
    SELECT tablename FROM pg_tables WHERE schemaname='public'
  `;

  const tables = tablenames
    .map(({ tablename }) => tablename)
    .filter((name) => name !== '_prisma_migrations')
    .map((name) => `"public"."${name}"`)
    .join(', ');

  if (tables.length > 0) {
    try {
      await prisma.$executeRawUnsafe(`TRUNCATE TABLE ${tables} CASCADE;`);
    } catch (error) {
      console.error('Failed to truncate tables:', error);
    }
  }
});

afterAll(async () => {
  await prisma.$disconnect();
});

export { prisma };
