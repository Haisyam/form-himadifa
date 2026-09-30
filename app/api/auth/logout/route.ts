import { NextResponse } from 'next/server';
import { clearAdminSession } from '@/lib/auth';

export async function POST() {
  try {
    await clearAdminSession();
    return NextResponse.json({ success: true, message: 'Logout berhasil' });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, message: error.message || 'Error logging out' },
      { status: 500 }
    );
  }
}
