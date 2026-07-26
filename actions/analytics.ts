'use server';

import { db } from '@/lib/db';
import { violation, user, location } from '@/lib/db/schema';
import { eq } from 'drizzle-orm';

export async function getAnalyticsData() {
  try {
    const rawViolations = await db
      .select({
        id: violation.id,
        type: violation.type,
        createdAt: violation.createdAt,
        workerSite: user.site,
        locationName: location.name,
      })
      .from(violation)
      .innerJoin(user, eq(violation.workerId, user.id))
      .leftJoin(location, eq(violation.locationId, location.id));

    // 1. Group by Site
    const siteMap: Record<string, number> = {};
    // 2. Group by PPE Type
    const ppeMap: Record<string, number> = {};
    // 3. Group by Date (Daily Violations)
    const dailyMap: Record<string, number> = {};

    rawViolations.forEach((v) => {
      // Resolve site name
      const site = v.locationName || v.workerSite || 'General Zone';
      siteMap[site] = (siteMap[site] || 0) + 1;

      // Resolve PPE type
      const ppe = v.type.replace('_', ' ').replace(/\b\w/g, (c) => c.toUpperCase());
      ppeMap[ppe] = (ppeMap[ppe] || 0) + 1;

      // Resolve Date
      const date = new Date(v.createdAt).toISOString().split('T')[0];
      dailyMap[date] = (dailyMap[date] || 0) + 1;
    });

    const violationsBySite = Object.entries(siteMap).map(([site, count]) => ({
      site,
      count,
    }));

    const violationsByPpeType = Object.entries(ppeMap).map(([type, count]) => ({
      name: type,
      value: count,
    }));

    const dailyViolations = Object.entries(dailyMap)
      .map(([date, count]) => ({
        date,
        count,
      }))
      .sort((a, b) => a.date.localeCompare(b.date));

    return {
      success: true,
      data: {
        violationsBySite,
        violationsByPpeType,
        dailyViolations,
      },
    };
  } catch (error) {
    console.error('Error fetching analytics data:', error);
    return {
      success: false,
      error: 'Failed to retrieve analytics data',
      data: {
        violationsBySite: [],
        violationsByPpeType: [],
        dailyViolations: [],
      },
    };
  }
}
