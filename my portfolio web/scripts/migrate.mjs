// Run: node scripts/migrate.mjs
// Executes neon-schema.sql against the Neon database

import { neon } from '@neondatabase/serverless';
import { readFileSync, existsSync } from 'fs';
import { resolve, dirname } from 'path';
import { fileURLToPath } from 'url';

const __dirname = dirname(fileURLToPath(import.meta.url));

const envPath = resolve(__dirname, '..', '.env.local');
if (!existsSync(envPath)) {
  console.error('❌ .env.local not found');
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

const schemaPath = resolve(__dirname, '..', 'neon-schema.sql');
const schema = readFileSync(schemaPath, 'utf-8');

// Remove comment lines, split by semicolons, filter empty
const statements = schema
  .split('\n')
  .filter(line => !line.trim().startsWith('--') && !line.trim().startsWith('INSERT'))
  .join('\n')
  .split(';')
  .map(s => s.trim())
  .filter(s => s.length > 0);

console.log(`Running ${statements.length} SQL statements...\n`);

for (const stmt of statements) {
  try {
    await sql.query(stmt);
    console.log(`✅ ${stmt.slice(0, 60)}...`);
  } catch (err) {
    console.error(`❌ Error:`, err.message?.slice(0, 120));
    console.error(`   Statement: ${stmt.slice(0, 80)}...`);
  }
}

console.log('\n✅ Migration complete');
