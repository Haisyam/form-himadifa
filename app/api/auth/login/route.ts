import { NextRequest, NextResponse } from 'next/server';
import { getAdminPassword, setAdminSession } from '@/lib/auth';

export async function POST(request: NextRequest) {
  try {
    const { username, password } = await request.json();

    const expectedPassword = getAdminPassword();

    if ((username === 'admin' || username === 'admin@himadifa.or.id') && password === expectedPassword) {
      await setAdminSession();
      return NextResponse.json({
        success: true,
        message: 'Login berhasil',
        user: { username: 'admin', role: 'Administrator HIMA' },
      });
    }

    return NextResponse.json(
      { success: false, message: 'Username atau Password salah!' },
      { status: 401 }
    );
  } catch (error: any) {
    return NextResponse.json(
      { success: false, message: error.message || 'Internal Server Error' },
      { status: 500 }
    );
  }
}
