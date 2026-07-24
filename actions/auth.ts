'use server';

import { auth } from '@/lib/auth';
import { db } from '@/lib/db';
import { user } from '@/lib/db/schema';
import { headers } from 'next/headers';
import { eq } from 'drizzle-orm';

/**
 * Get current user from session
 */
export async function getCurrentUser() {
  try {
    const session = await auth.api.getSession({ headers: await headers() });
    return session?.user || null;
  } catch {
    return null;
  }
}

/**
 * Sign out user
 */
export async function signOut() {
  return await auth.api.signOut({ headers: await headers() });
}

/**
 * Get all users (admin only)
 */
export async function getUsers() {
  try {
    const allUsers = await db.select().from(user);
    return allUsers.map(({ ...u }) => ({ ...u }));
  } catch (error) {
    console.error('Error fetching users:', error);
    throw new Error('Failed to fetch users');
  }
}
