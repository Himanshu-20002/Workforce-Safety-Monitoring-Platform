'use server';

import { db } from '@/lib/db';
import { violation, user, location } from '@/lib/db/schema';
import { eq } from 'drizzle-orm';
import { revalidatePath } from 'next/cache';

export async function getViolations() {
  try {
    const results = await db
      .select({
        id: violation.id,
        type: violation.type,
        description: violation.description,
        severity: violation.severity,
        status: violation.status,
        createdAt: violation.createdAt,
        acknowledgedAt: violation.acknowledgedAt,
        workerName: user.name,
        workerSite: user.site,
        locationName: location.name,
      })
      .from(violation)
      .innerJoin(user, eq(violation.workerId, user.id))
      .leftJoin(location, eq(violation.locationId, location.id))
      .orderBy(violation.createdAt);

    return { success: true, violations: results };
  } catch (error) {
    console.error('Error fetching violations:', error);
    return { success: false, error: 'Failed to fetch violations', violations: [] };
  }
}

export async function acknowledgeViolation(id: string) {
  try {
    await db
      .update(violation)
      .set({
        status: 'Acknowledged',
        acknowledgedAt: new Date(),
        updatedAt: new Date(),
      })
      .where(eq(violation.id, id));

    revalidatePath('/supervisor/violations');
    return { success: true };
  } catch (error) {
    console.error('Error acknowledging violation:', error);
    return { success: false, error: 'Failed to acknowledge violation' };
  }
}
