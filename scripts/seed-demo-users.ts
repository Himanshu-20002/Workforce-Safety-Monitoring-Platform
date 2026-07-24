/**
 * Seed demo users for testing
 * Run with: npx ts-node scripts/seed-demo-users.ts
 */

import { db } from '@/lib/db';
import { user } from '@/lib/db/schema';

async function seedDemoUsers() {
  console.log('Seeding demo users...');

  try {
    // Demo users - these will be hashed by Better Auth
    const demoUsers = [
      {
        id: 'user-admin-1',
        name: 'Admin User',
        email: 'admin@example.com',
        role: 'admin' as const,
        emailVerified: true,
      },
      {
        id: 'user-supervisor-1',
        name: 'Supervisor User',
        email: 'supervisor@example.com',
        role: 'supervisor' as const,
        emailVerified: true,
      },
      {
        id: 'user-worker-1',
        name: 'Worker User',
        email: 'worker@example.com',
        role: 'worker' as const,
        emailVerified: true,
      },
    ];

    for (const u of demoUsers) {
      const existing = await db.query.user.findFirst({
        where: (user, { eq }) => eq(user.email, u.email),
      });

      if (!existing) {
        await db.insert(user).values({
          id: u.id,
          name: u.name,
          email: u.email,
          role: u.role,
          emailVerified: true,
          image: null,
          createdAt: new Date(),
          updatedAt: new Date(),
        });
        console.log(`✓ Created ${u.role} user: ${u.email}`);
      } else {
        console.log(`- User already exists: ${u.email}`);
      }
    }

    console.log('✓ Demo users seeded successfully');
  } catch (error) {
    console.error('Error seeding demo users:', error);
    process.exit(1);
  }
}

seedDemoUsers();
