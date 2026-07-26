'use server';

import { db } from '@/lib/db';
import { user } from '@/lib/db/schema';
import { eq, and, ilike, sql, or } from 'drizzle-orm';

interface FetchWorkersOptions {
  search?: string;
  site?: string;
  page?: number;
  limit?: number;
}

/**
 * Get all workers with search, filter, and pagination
 */
export async function getWorkers(options: FetchWorkersOptions = {}) {
  try {
    const { search, site, page = 1, limit = 10 } = options;
    const offset = (page - 1) * limit;

    const conditions = [eq(user.role, 'worker')];

    if (search) {
      conditions.push(
        or(
          ilike(user.name, `%${search}%`),
          ilike(user.employeeId, `%${search}%`),
          ilike(user.mobileNumber, `%${search}%`),
          ilike(user.aadharNumber, `%${search}%`)
        )!
      );
    }

    if (site && site !== 'all') {
      conditions.push(eq(user.site, site));
    }

    const whereClause = and(...conditions);

    // Fetch workers, total count, and unique sites in parallel
    const [workers, totalCountResult, sitesResult] = await Promise.all([
      db
        .select()
        .from(user)
        .where(whereClause)
        .limit(limit)
        .offset(offset),
      db
        .select({ count: sql<number>`count(*)` })
        .from(user)
        .where(whereClause),
      db
        .selectDistinct({ site: user.site })
        .from(user)
        .where(eq(user.role, 'worker'))
    ]);

    const totalWorkers = totalCountResult[0]?.count || 0;
    const totalPages = Math.ceil(totalWorkers / limit);
    const sites = sitesResult.map((s) => s.site).filter(Boolean) as string[];

    return {
      workers,
      totalPages,
      totalWorkers,
      sites,
    };
  } catch (error) {
    console.error('Error fetching workers:', error);
    throw new Error('Failed to fetch workers');
  }
}

export async function deleteWorker(id: string) {
  try {
    await db.delete(user).where(eq(user.id, id));
    return { success: true };
  } catch (error) {
    console.error('Failed to delete worker:', error);
    return { success: false, error: 'Failed to delete worker' };
  }
}

export async function updateWorker(
  id: string,
  data: {
    name: string;
    site: string;
    status: string;
    jobProfile?: string;
    mobileNumber?: string;
    aadharNumber?: string;
  }
) {
  try {
    await db
      .update(user)
      .set({
        name: data.name,
        site: data.site,
        status: data.status,
        jobProfile: data.jobProfile || null,
        mobileNumber: data.mobileNumber || null,
        aadharNumber: data.aadharNumber || null,
        updatedAt: new Date(),
      })
      .where(eq(user.id, id));
    return { success: true };
  } catch (error) {
    console.error('Failed to update worker:', error);
    return { success: false, error: 'Failed to update worker' };
  }
}
