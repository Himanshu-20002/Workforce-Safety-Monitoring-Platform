'use server';

import { db } from '@/lib/db';
import { user } from '@/lib/db/schema';
import { eq } from 'drizzle-orm';
import { auth } from '@/lib/auth';
import { revalidatePath } from 'next/cache';

export async function getSupervisors() {
  try {
    const supervisors = await db
      .select()
      .from(user)
      .where(eq(user.role, 'supervisor'))
      .orderBy(user.createdAt);
    return { success: true, supervisors };
  } catch (error) {
    console.error('Error fetching supervisors:', error);
    return { success: false, error: 'Failed to fetch supervisors' };
  }
}

export async function createSupervisor(data: { name: string; email: string; password?: string }) {
  try {
    // Call Better Auth's server-side signUpEmail API to insert user and hash password
    const result = await auth.api.signUpEmail({
      body: {
        email: data.email,
        password: data.password || 'Supervisor@123',
        name: data.name,
        role: 'supervisor',
      },
    });

    if (!result) {
      return { success: false, error: 'Failed to register supervisor' };
    }

    revalidatePath('/admin/supervisors');
    return { success: true };
  } catch (error: any) {
    console.error('Error creating supervisor:', error);
    return { success: false, error: error.message || 'Failed to create supervisor' };
  }
}

export async function deleteSupervisor(id: string) {
  try {
    await db.delete(user).where(eq(user.id, id));
    revalidatePath('/admin/supervisors');
    return { success: true };
  } catch (error) {
    console.error('Error deleting supervisor:', error);
    return { success: false, error: 'Failed to delete supervisor' };
  }
}
