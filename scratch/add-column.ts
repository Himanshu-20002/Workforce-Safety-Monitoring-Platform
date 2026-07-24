import { db } from '../lib/db';
import { sql } from 'drizzle-orm';

async function main() {
  try {
    console.log('Adding acknowledgedAt column to violation table...');
    await db.execute(sql`
      ALTER TABLE violation ADD COLUMN IF NOT EXISTS "acknowledgedAt" timestamp without time zone;
    `);
    console.log('Column added successfully!');
  } catch (error) {
    console.error('Error adding column:', error);
  }
}

main().then(() => process.exit(0));
