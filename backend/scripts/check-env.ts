#!/usr/bin/env node
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

dotenv.config({ path: path.resolve(__dirname, '../.env') });

const requiredEnvVars = [
  'NODE_ENV',
  'PORT',
  'DATABASE_URL',
  'REDIS_HOST',
  'JWT_ACCESS_SECRET',
  'JWT_REFRESH_SECRET',
  'COOKIE_SECRET',
];

const optionalEnvVars = [
  'CLOUDINARY_CLOUD_NAME',
  'CLOUDINARY_API_KEY',
  'CLOUDINARY_API_SECRET',
  'EMAIL_USER',
  'EMAIL_PASSWORD',
];

console.log('🔍 Environment Variables Check\n');

let hasErrors = false;
let hasWarnings = false;

// Check required
console.log('📌 Required Variables:');
requiredEnvVars.forEach((key) => {
  const value = process.env[key];
  if (!value) {
    console.log(`  ❌ ${key} — MISSING!`);
    hasErrors = true;
  } else {
    const masked =
      key.includes('SECRET') || key.includes('PASSWORD')
        ? '***' + value.slice(-4)
        : value.length > 50
          ? value.substring(0, 50) + '...'
          : value;
    console.log(`  ✅ ${key} = ${masked}`);
  }
});

// Check secret lengths
console.log('\n🔒 Secret Security:');
const secretVars = ['JWT_ACCESS_SECRET', 'JWT_REFRESH_SECRET', 'COOKIE_SECRET'];
secretVars.forEach((key) => {
  const value = process.env[key];
  if (value && value.length < 32) {
    console.log(`  ⚠️  ${key} is only ${value.length} chars (recommend 32+)`);
    hasWarnings = true;
  } else if (value) {
    console.log(`  ✅ ${key} is ${value.length} chars`);
  }
});

// Check optional
console.log('\n📎 Optional Variables (for full features):');
optionalEnvVars.forEach((key) => {
  const value = process.env[key];
  if (!value || value.startsWith('your_')) {
    console.log(`  ⚠️  ${key} — not configured`);
    hasWarnings = true;
  } else {
    console.log(`  ✅ ${key} configured`);
  }
});

// Node version check
console.log('\n📦 Node.js Version:');
const nodeVersion = process.version;
const majorVersion = parseInt(nodeVersion.slice(1).split('.')[0]);
if (majorVersion >= 20) {
  console.log(`  ✅ ${nodeVersion} (>= 20)`);
} else {
  console.log(`  ⚠️  ${nodeVersion} (recommend >= 20)`);
  hasWarnings = true;
}

// Summary
console.log('\n' + '='.repeat(50));
if (hasErrors) {
  console.log('❌ FAILED: Missing required environment variables');
  process.exit(1);
} else if (hasWarnings) {
  console.log('⚠️  PASSED WITH WARNINGS');
  process.exit(0);
} else {
  console.log('✅ ALL CHECKS PASSED!');
  process.exit(0);
}
