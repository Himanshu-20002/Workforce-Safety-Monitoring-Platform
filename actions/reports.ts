'use server';

import { db } from '@/lib/db';
import { report } from '@/lib/db/schema';

/**
 * Get all reports
 */
export async function getReports() {
  try {
    return await db.select().from(report);
  } catch (error) {
    console.error('Error fetching reports:', error);
    throw new Error('Failed to fetch reports');
  }
}
