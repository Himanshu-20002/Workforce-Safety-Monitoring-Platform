import { NextResponse } from 'next/server';
import { auth } from '@/lib/auth';

export async function POST(req: Request) {
  try {
    const { email, password, name, role } = await req.json();

    // Use Better Auth to create user via internal API
    const result = await auth.api.signUpEmail({
      email,
      password,
      name,
      metadata: { role },
    } as any);

    if (!result || !result.user) {
      throw new Error('Failed to create user');
    }

    return NextResponse.json({
      success: true,
      user: {
        id: result.user.id,
        email: result.user.email,
        name: result.user.name,
      },
    });
  } catch (error) {
    console.error('Error creating demo user:', error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Failed to create user' },
      { status: 500 }
    );
  }
}
