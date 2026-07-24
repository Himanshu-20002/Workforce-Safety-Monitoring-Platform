import * as XLSX from 'xlsx';
import * as path from 'path';
import * as crypto from 'crypto';
import { drizzle } from 'drizzle-orm/node-postgres';
import { Pool } from 'pg';
import * as schema from '../lib/db/schema';
import { eq } from 'drizzle-orm';

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
});

const db = drizzle(pool, { schema });

async function seedWorkers() {
  console.log('Starting workers import...');
  try {
    const filePath = path.join(process.cwd(), 'workers_dataset.xlsx');
    const workbook = XLSX.readFile(filePath);
    const sheetName = workbook.SheetNames[0];
    const worksheet = workbook.Sheets[sheetName];
    const rawData = XLSX.utils.sheet_to_json(worksheet) as any[];

    console.log(`Found ${rawData.length} rows in the dataset.`);

    let insertedCount = 0;
    let skippedCount = 0;
    let errorCount = 0;

    for (const row of rawData) {
      try {
        const name = row['Name'];
        const workerId = row['Worker ID'];
        const jobProfile = row['Job Profile'];
        const department = row['Department'];
        const mobileNumber = row['Mobile Number'] ? String(row['Mobile Number']) : null;
        const aadharNumber = row['Aadhar Number'] ? String(row['Aadhar Number']) : null;

        // Validation check
        if (!name || !workerId) {
          console.warn(`⚠️ Skipping invalid row (missing Name or Worker ID):`, row);
          errorCount++;
          continue;
        }

        // Generate a deterministic or clean email
        const cleanName = name.toLowerCase().replace(/[^a-z0-9]/g, '.');
        const cleanId = workerId.toLowerCase().replace(/[^a-z0-9]/g, '');
        const email = `${cleanName}.${cleanId}@example.com`;

        // Check if employee already exists by employeeId or email
        const existingEmployee = await db.query.user.findFirst({
          where: (user, { eq, or }) => or(
            eq(user.employeeId, workerId),
            eq(user.email, email)
          ),
        });

        if (existingEmployee) {
          skippedCount++;
          continue;
        }

        // Insert new worker
        await db.insert(schema.user).values({
          id: crypto.randomUUID(),
          name: name,
          email: email,
          emailVerified: true,
          role: 'worker',
          employeeId: workerId,
          site: department || 'General Site',
          status: 'Active',
          jobProfile: jobProfile || 'General Staff',
          mobileNumber: mobileNumber,
          aadharNumber: aadharNumber,
          image: null,
        });

        insertedCount++;
      } catch (rowError) {
        console.error(`❌ Error importing row:`, row, rowError);
        errorCount++;
      }
    }

    console.log('\n--- Import Summary ---');
    console.log(`✅ Imported: ${insertedCount}`);
    console.log(`⏭️ Skipped (already exist): ${skippedCount}`);
    console.log(`⚠️ Errors/Invalid rows: ${errorCount}`);
    console.log('----------------------');

  } catch (error) {
    console.error('Fatal error during seeding:', error);
  } finally {
    await pool.end();
  }
}

seedWorkers();
