// Run: node scripts/create-admin.mjs
// Make sure DATABASE_URL is set in .env.local

import { neon } from '@neondatabase/serverless';
import bcrypt from 'bcryptjs';
import { createInterface } from 'readline';
import { createHash, randomBytes } from 'crypto';
import { readFileSync, existsSync } from 'fs';
import { resolve, dirname } from 'path';
import { fileURLToPath } from 'url';

const __dirname = dirname(fileURLToPath(import.meta.url));

// Load .env.local
const envPath = resolve(__dirname, '..', '.env.local');
if (!existsSync(envPath)) {
  console.error('❌ .env.local not found. Create it with DATABASE_URL first.');
  process.exit(1);
}

const envContent = readFileSync(envPath, 'utf-8');
const match = envContent.match(/DATABASE_URL=(.+)/);
if (!match) {
  console.error('❌ DATABASE_URL not found in .env.local');
  process.exit(1);
}

const connectionString = match[1].trim();
const sql = neon(connectionString);

const rl = createInterface({ input: process.stdin, output: process.stdout });

function ask(query) {
  return new Promise(resolve => rl.question(query, resolve));
}

async function main() {
  console.log('\n🔧 Create Admin User\n');

  // Check if users exist
  const existing = await sql('SELECT COUNT(*) as count FROM users');
  if (Number(existing[0]?.count ?? 0) > 0) {
    console.log('⚠ An admin user already exists.');
    const answer = await ask('Create another? (y/N): ');
    if (answer.toLowerCase() !== 'y') {
      console.log('Exiting.');
      rl.close();
      return;
    }
  }

  const email = await ask('Email: ');
  const password = await ask('Password: ');

  if (!email || !password) {
    console.error('❌ Email and password required');
    rl.close();
    return;
  }

  const passwordHash = await bcrypt.hash(password, 12);
  await sql(
    'INSERT INTO users (email, password_hash) VALUES ($1, $2)',
    [email, passwordHash]
  );

  console.log(`\n✅ Admin user created: ${email}`);
  rl.close();
}

main().catch(err => {
  console.error('Error:', err);
  rl.close();
  process.exit(1);
});
