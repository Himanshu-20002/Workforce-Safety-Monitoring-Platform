'use server';

import { db } from '@/lib/db';
import { alert } from '@/lib/db/schema';

/**
 * Get all alerts
 */
export async function getAlerts() {
  try {
    return await db.select().from(alert);
  } catch (error) {
    console.error('Error fetching alerts:', error);
    throw new Error('Failed to fetch alerts');
  }
}
