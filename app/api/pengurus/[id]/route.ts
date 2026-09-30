import { NextRequest, NextResponse } from 'next/server';
import { getPengurusById, updatePengurus, deletePengurus, isNamaExists, isNimExists } from '@/lib/db';

export async function GET(
  request: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await context.params;
    const numId = parseInt(id, 10);
    if (isNaN(numId)) {
      return NextResponse.json({ success: false, message: 'ID tidak valid' }, { status: 400 });
    }

    const item = getPengurusById(numId);
    if (!item) {
      return NextResponse.json({ success: false, message: 'Data tidak ditemukan' }, { status: 404 });
    }

    return NextResponse.json({ success: true, data: item });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, message: error.message || 'Internal Server Error' },
      { status: 500 }
    );
  }
}

export async function PUT(
  request: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await context.params;
    const numId = parseInt(id, 10);
    if (isNaN(numId)) {
      return NextResponse.json({ success: false, message: 'ID tidak valid' }, { status: 400 });
    }

    const body = await request.json();

    // Check duplicate Nama (exclude current id)
    if (body.nama && isNamaExists(body.nama, numId)) {
      return NextResponse.json(
        { success: false, message: `Nama "${body.nama.trim()}" sudah digunakan pengurus lain!` },
        { status: 400 }
      );
    }

    // Check duplicate NIM (exclude current id)
    if (body.nim && isNimExists(body.nim, numId)) {
      return NextResponse.json(
        { success: false, message: `NIM "${body.nim.trim()}" sudah digunakan pengurus lain!` },
        { status: 400 }
      );
    }

    const updated = updatePengurus(numId, body);

    if (!updated) {
      return NextResponse.json({ success: false, message: 'Data tidak ditemukan' }, { status: 404 });
    }

    return NextResponse.json({ success: true, data: updated });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, message: error.message || 'Gagal memperbarui data' },
      { status: 500 }
    );
  }
}

export async function DELETE(
  request: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await context.params;
    const numId = parseInt(id, 10);
    if (isNaN(numId)) {
      return NextResponse.json({ success: false, message: 'ID tidak valid' }, { status: 400 });
    }

    const deleted = deletePengurus(numId);
    if (!deleted) {
      return NextResponse.json({ success: false, message: 'Data tidak ditemukan' }, { status: 404 });
    }

    return NextResponse.json({ success: true, message: 'Berhasil menghapus data' });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, message: error.message || 'Gagal menghapus data' },
      { status: 500 }
    );
  }
}
