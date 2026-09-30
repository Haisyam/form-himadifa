import { NextResponse } from 'next/server';
import { isVerifiedAdmin } from '@/lib/auth';

export async function GET() {
  try {
    const isAdmin = await isVerifiedAdmin();
    if (isAdmin) {
      return NextResponse.json({
        authenticated: true,
        user: { username: 'admin', role: 'Administrator HIMA' },
      });
    }
    return NextResponse.json({ authenticated: false }, { status: 401 });
  } catch (error) {
    return NextResponse.json({ authenticated: false }, { status: 500 });
  }
}
