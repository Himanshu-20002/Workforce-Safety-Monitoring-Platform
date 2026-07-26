'use server';

import { db } from '@/lib/db';
import { user, alert, violation, location } from '@/lib/db/schema';
import { eq, and, gte, sql, lt, desc } from 'drizzle-orm';

/**
 * Get statistics for the Admin Dashboard
 */
export async function getAdminStats() {
  try {
    const tenMinutesAgo = new Date(Date.now() - 10 * 60 * 1000);

    const [
      workersResult,
      supervisorsResult,
      pendingViolationsResult,
      escalatedAlertsResult,
      resolvedResult,
      recentViolations,
      recentEscalated,
      rawViolations
    ] = await Promise.all([
      db.select({ count: sql<number>`count(*)` }).from(user).where(eq(user.role, 'worker')),
      db.select({ count: sql<number>`count(*)` }).from(user).where(eq(user.role, 'supervisor')),
      db.select({ count: sql<number>`count(*)` }).from(violation).where(eq(violation.status, 'open')),
      db.select({ count: sql<number>`count(*)` }).from(violation).where(
        and(
          sql`status in ('open', 'pending', 'Open', 'Pending')`,
          lt(violation.createdAt, tenMinutesAgo)
        )
      ),
      db.select({ count: sql<number>`count(*)` }).from(violation).where(
        sql`status in ('Acknowledged', 'acknowledged', 'resolved', 'Resolved')`
      ),
      db.select({
        id: violation.id,
        type: violation.type,
        description: violation.description,
        severity: violation.severity,
        status: violation.status,
        createdAt: violation.createdAt,
        workerName: user.name,
        locationName: location.name,
      })
      .from(violation)
      .innerJoin(user, eq(violation.workerId, user.id))
      .leftJoin(location, eq(violation.locationId, location.id))
      .orderBy(desc(violation.createdAt))
      .limit(5),
      db.select({
        id: violation.id,
        type: violation.type,
        description: violation.description,
        severity: violation.severity,
        status: violation.status,
        createdAt: violation.createdAt,
        workerName: user.name,
        locationName: location.name,
      })
      .from(violation)
      .innerJoin(user, eq(violation.workerId, user.id))
      .leftJoin(location, eq(violation.locationId, location.id))
      .where(
        and(
          sql`violation.status in ('open', 'pending', 'Open', 'Pending')`,
          lt(violation.createdAt, tenMinutesAgo)
        )
      )
      .orderBy(desc(violation.createdAt))
      .limit(5),
      db.select({
        type: violation.type,
        workerSite: user.site,
        locationName: location.name,
      })
      .from(violation)
      .innerJoin(user, eq(violation.workerId, user.id))
      .leftJoin(location, eq(violation.locationId, location.id))
    ]);

    const siteMap: Record<string, number> = {};
    const ppeMap: Record<string, number> = {};

    rawViolations.forEach((v) => {
      const site = v.locationName || v.workerSite || 'General Zone';
      siteMap[site] = (siteMap[site] || 0) + 1;

      const ppe = v.type.replace('_', ' ').replace(/\b\w/g, (c) => c.toUpperCase());
      ppeMap[ppe] = (ppeMap[ppe] || 0) + 1;
    });

    const violationsBySite = Object.entries(siteMap).map(([site, count]) => ({
      site,
      count,
    }));

    const violationsByPpeType = Object.entries(ppeMap).map(([type, count]) => ({
      name: type,
      value: count,
    }));

    return {
      totalWorkers: workersResult[0]?.count || 0,
      totalSupervisors: supervisorsResult[0]?.count || 0,
      pendingViolations: pendingViolationsResult[0]?.count || 0,
      escalatedAlerts: escalatedAlertsResult[0]?.count || 0,
      resolvedViolations: resolvedResult[0]?.count || 0,
      recentViolations,
      recentEscalated,
      analyticsData: {
        violationsBySite,
        violationsByPpeType,
      }
    };
  } catch (error) {
    console.error('Error fetching admin dashboard statistics:', error);
    throw new Error('Failed to fetch admin stats');
  }
}

export async function getSupervisorStats() {
  try {
    const startOfToday = new Date();
    startOfToday.setHours(0, 0, 0, 0);
    const tenMinutesAgo = new Date(Date.now() - 10 * 60 * 1000);

    const [
      todayViolationsResult,
      pendingViolationsResult,
      ackViolationsResult,
      resolvedResult,
      recentViolations,
      recentEscalated,
      rawViolations
    ] = await Promise.all([
      db.select({ count: sql<number>`count(*)` }).from(violation).where(gte(violation.createdAt, startOfToday)),
      db.select({ count: sql<number>`count(*)` }).from(violation).where(eq(violation.status, 'open')),
      db.select({ count: sql<number>`count(*)` }).from(violation).where(eq(violation.status, 'acknowledged')),
      db.select({ count: sql<number>`count(*)` }).from(violation).where(
        sql`status in ('Acknowledged', 'acknowledged', 'resolved', 'Resolved')`
      ),
      db.select({
        id: violation.id,
        type: violation.type,
        description: violation.description,
        severity: violation.severity,
        status: violation.status,
        createdAt: violation.createdAt,
        workerName: user.name,
        locationName: location.name,
      })
      .from(violation)
      .innerJoin(user, eq(violation.workerId, user.id))
      .leftJoin(location, eq(violation.locationId, location.id))
      .orderBy(desc(violation.createdAt))
      .limit(5),
      db.select({
        id: violation.id,
        type: violation.type,
        description: violation.description,
        severity: violation.severity,
        status: violation.status,
        createdAt: violation.createdAt,
        workerName: user.name,
        locationName: location.name,
      })
      .from(violation)
      .innerJoin(user, eq(violation.workerId, user.id))
      .leftJoin(location, eq(violation.locationId, location.id))
      .where(
        and(
          sql`violation.status in ('open', 'pending', 'Open', 'Pending')`,
          lt(violation.createdAt, tenMinutesAgo)
        )
      )
      .orderBy(desc(violation.createdAt))
      .limit(5),
      db.select({
        type: violation.type,
        workerSite: user.site,
        locationName: location.name,
      })
      .from(violation)
      .innerJoin(user, eq(violation.workerId, user.id))
      .leftJoin(location, eq(violation.locationId, location.id))
    ]);

    const siteMap: Record<string, number> = {};
    const ppeMap: Record<string, number> = {};

    rawViolations.forEach((v) => {
      const site = v.locationName || v.workerSite || 'General Zone';
      siteMap[site] = (siteMap[site] || 0) + 1;

      const ppe = v.type.replace('_', ' ').replace(/\b\w/g, (c) => c.toUpperCase());
      ppeMap[ppe] = (ppeMap[ppe] || 0) + 1;
    });

    const violationsBySite = Object.entries(siteMap).map(([site, count]) => ({
      site,
      count,
    }));

    const violationsByPpeType = Object.entries(ppeMap).map(([type, count]) => ({
      name: type,
      value: count,
    }));

    return {
      todayViolations: todayViolationsResult[0]?.count || 0,
      pendingViolations: pendingViolationsResult[0]?.count || 0,
      acknowledgedViolations: ackViolationsResult[0]?.count || 0,
      resolvedViolations: resolvedResult[0]?.count || 0,
      recentViolations,
      recentEscalated,
      analyticsData: {
        violationsBySite,
        violationsByPpeType,
      }
    };
  } catch (error) {
    console.error('Error fetching supervisor dashboard statistics:', error);
    throw new Error('Failed to fetch supervisor stats');
  }
}
