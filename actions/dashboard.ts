'use server';

import { db } from '@/lib/db';
import { user, alert, violation } from '@/lib/db/schema';
import { eq, and, gte, sql } from 'drizzle-orm';

/**
 * Get statistics for the Admin Dashboard
 */
export async function getAdminStats() {
  try {
    // Total Workers count
    const workersResult = await db
      .select({ count: sql<number>`count(*)` })
      .from(user)
      .where(eq(user.role, 'worker'));
    const totalWorkers = workersResult[0]?.count || 0;

    // Total Supervisors count
    const supervisorsResult = await db
      .select({ count: sql<number>`count(*)` })
      .from(user)
      .where(eq(user.role, 'supervisor'));
    const totalSupervisors = supervisorsResult[0]?.count || 0;

    // Pending Violations count (status = 'open')
    const pendingViolationsResult = await db
      .select({ count: sql<number>`count(*)` })
      .from(violation)
      .where(eq(violation.status, 'open'));
    const pendingViolations = pendingViolationsResult[0]?.count || 0;

    // Escalated Alerts count (severity = 'critical' or 'high')
    const escalatedAlertsResult = await db
      .select({ count: sql<number>`count(*)` })
      .from(alert)
      .where(
        and(
          eq(alert.status, 'open'),
          sql`severity in ('critical', 'high')`
        )
      );
    const escalatedAlerts = escalatedAlertsResult[0]?.count || 0;

    return {
      totalWorkers,
      totalSupervisors,
      pendingViolations,
      escalatedAlerts,
    };
  } catch (error) {
    console.error('Error fetching admin dashboard statistics:', error);
    throw new Error('Failed to fetch admin stats');
  }
}

/**
 * Get statistics for the Supervisor Dashboard
 */
export async function getSupervisorStats() {
  try {
    const startOfToday = new Date();
    startOfToday.setHours(0, 0, 0, 0);

    // Today's Violations count (created >= start of today)
    const todayViolationsResult = await db
      .select({ count: sql<number>`count(*)` })
      .from(violation)
      .where(gte(violation.createdAt, startOfToday));
    const todayViolations = todayViolationsResult[0]?.count || 0;

    // Pending Violations count (status = 'open')
    const pendingViolationsResult = await db
      .select({ count: sql<number>`count(*)` })
      .from(violation)
      .where(eq(violation.status, 'open'));
    const pendingViolations = pendingViolationsResult[0]?.count || 0;

    // Acknowledged Violations count (status = 'acknowledged')
    const ackViolationsResult = await db
      .select({ count: sql<number>`count(*)` })
      .from(violation)
      .where(eq(violation.status, 'acknowledged'));
    const acknowledgedViolations = ackViolationsResult[0]?.count || 0;

    return {
      todayViolations,
      pendingViolations,
      acknowledgedViolations,
    };
  } catch (error) {
    console.error('Error fetching supervisor dashboard statistics:', error);
    throw new Error('Failed to fetch supervisor stats');
  }
}
