import { neon } from '@neondatabase/serverless';
import bcrypt from 'bcryptjs';
import { readFileSync, existsSync } from 'fs';
import { resolve, dirname } from 'path';
import { fileURLToPath } from 'url';

const __dirname = dirname(fileURLToPath(import.meta.url));

const envPath = resolve(__dirname, '..', '.env.local');
const envContent = readFileSync(envPath, 'utf-8');
const match = envContent.match(/DATABASE_URL=(.+)/);
const sql = neon(match[1].trim());

async function main() {
  const existing = await sql.query('SELECT COUNT(*) as count FROM users');
  if (Number(existing[0]?.count ?? 0) === 0) {
    const hash = await bcrypt.hash('admin123', 12);
    await sql.query('INSERT INTO users (email, password_hash) VALUES ($1, $2)', [
      'usman.ashfaq1916@gmail.com', hash
    ]);
    console.log('Admin user created: usman.ashfaq1916@gmail.com / admin123');
  } else {
    console.log('Admin user already exists');
  }
}

main().catch(console.error);
