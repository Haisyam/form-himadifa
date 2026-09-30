import { NextRequest, NextResponse } from 'next/server';
import { getAllPengurus, createPengurus } from '@/lib/db';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const q = searchParams.get('q')?.toLowerCase() || '';
    const angkatan = searchParams.get('angkatan') || '';

    let data = getAllPengurus();

    if (angkatan && angkatan !== 'ALL') {
      data = data.filter(item => item.angkatan === angkatan);
    }

    if (q) {
      data = data.filter(
        item =>
          item.nama.toLowerCase().includes(q) ||
          item.nim.toLowerCase().includes(q) ||
          item.asal_instansi.toLowerCase().includes(q) ||
          item.alamat_domisili.toLowerCase().includes(q) ||
          item.no_whatsapp.toLowerCase().includes(q) ||
          item.jabatan_hima.toLowerCase().includes(q)
      );
    }

    return NextResponse.json({ success: true, data });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, message: error.message || 'Internal Server Error' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    const { nama, nim, angkatan, asal_instansi, alamat_domisili, no_whatsapp, jabatan_hima } = body;

    // Validation
    if (!nama || !nim || !angkatan || !asal_instansi || !alamat_domisili || !no_whatsapp) {
      return NextResponse.json(
        { success: false, message: 'Harap isi semua kolom wajib!' },
        { status: 400 }
      );
    }

    const newPengurus = createPengurus({
      nama,
      nim,
      angkatan,
      asal_instansi,
      alamat_domisili,
      no_whatsapp,
      jabatan_hima,
    });

    return NextResponse.json({ success: true, data: newPengurus }, { status: 201 });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, message: error.message || 'Gagal menyimpan data' },
      { status: 500 }
    );
  }
}
