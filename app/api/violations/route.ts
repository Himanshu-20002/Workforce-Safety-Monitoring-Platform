import { type NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { violation, location, user } from '@/lib/db/schema';
import { eq } from 'drizzle-orm';
import * as crypto from 'crypto';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { workerId, site, violationType } = body;

    // 1. Basic validation
    if (!workerId || !site || !violationType) {
      return NextResponse.json(
        { success: false, error: 'Missing required fields: workerId, site, violationType' },
        { status: 400 }
      );
    }

    // Verify worker exists
    const workerExists = await db.query.user.findFirst({
      where: (user, { eq }) => eq(user.id, workerId),
    });

    if (!workerExists) {
      return NextResponse.json(
        { success: false, error: `Worker with ID '${workerId}' does not exist` },
        { status: 404 }
      );
    }

    // 2. Resolve or create location (site)
    let loc = await db.query.location.findFirst({
      where: (location, { eq }) => eq(location.name, site),
    });

    if (!loc) {
      const newLocId = crypto.randomUUID();
      await db.insert(location).values({
        id: newLocId,
        name: site,
        description: `Automatically created for safety monitoring site: ${site}`,
        riskLevel: 'medium',
      });
      loc = {
        id: newLocId,
        name: site,
        description: null,
        riskLevel: 'medium',
        createdAt: new Date(),
        updatedAt: new Date(),
      };
    }

    // 3. Create PPE safety violation record in the database
    const violationId = crypto.randomUUID();
    await db.insert(violation).values({
      id: violationId,
      type: violationType,
      description: `IoT camera alert: Detected ${violationType.replace('_', ' ')} safety violation.`,
      severity: 'high',
      status: 'Pending',
      workerId,
      locationId: loc.id,
      createdAt: new Date(),
      updatedAt: new Date(),
    });

    return NextResponse.json({
      success: true,
      violationId,
      message: 'Violation recorded successfully.',
    });
  } catch (error: any) {
    console.error('Error in simulation endpoint:', error);
    return NextResponse.json(
      { success: false, error: error.message || 'Internal Server Error' },
      { status: 500 }
    );
  }
}
