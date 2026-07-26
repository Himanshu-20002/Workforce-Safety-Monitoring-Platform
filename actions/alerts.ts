'use server';

import { db } from '@/lib/db';
import { violation, user, location } from '@/lib/db/schema';
import { eq, or, and, lt } from 'drizzle-orm';

/**
 * Get all safety violations that are escalated
 * Conditions:
 * - status is 'open' or 'pending' (or variants)
 * - createdAt is older than 10 minutes
 */
export async function getEscalatedAlerts() {
  try {
    const tenMinutesAgo = new Date(Date.now() - 10 * 60 * 1000);

    const escalated = await db
      .select({
        id: violation.id,
        type: violation.type,
        description: violation.description,
        severity: violation.severity,
        status: violation.status,
        createdAt: violation.createdAt,
        workerName: user.name,
        workerEmployeeId: user.employeeId,
        workerSite: user.site,
        locationName: location.name,
      })
      .from(violation)
      .innerJoin(user, eq(violation.workerId, user.id))
      .leftJoin(location, eq(violation.locationId, location.id))
      .where(
        and(
          or(
            eq(violation.status, 'open'),
            eq(violation.status, 'pending'),
            eq(violation.status, 'Open'),
            eq(violation.status, 'Pending')
          ),
          lt(violation.createdAt, tenMinutesAgo)
        )
      )
      .orderBy(violation.createdAt);

    return { success: true, alerts: escalated };
  } catch (error) {
    console.error('Error fetching escalated alerts:', error);
    return { success: false, error: 'Failed to fetch escalated alerts', alerts: [] };
  }
}
