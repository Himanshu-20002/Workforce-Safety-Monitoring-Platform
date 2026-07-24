import { db } from '../lib/db';
import { sql } from 'drizzle-orm';

async function main() {
  try {
    const result = await db.execute(sql`
      SELECT column_name, data_type 
      FROM information_schema.columns 
      WHERE table_name = 'violation'
    `);
    console.log('Columns in violation table:', result.rows);
  } catch (error) {
    console.error('Error querying columns:', error);
  }
}

main().then(() => process.exit(0));
