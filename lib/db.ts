import Database from "better-sqlite3";
import path from "path";
import fs from "fs";

export interface Pengurus {
  id: number;
  nama: string;
  nim: string;
  angkatan: string;
  asal_instansi: string;
  alamat_domisili: string;
  no_whatsapp: string;
  jabatan_hima: string;
  created_at: string;
  updated_at: string;
}

// In-memory fallback for environments without filesystem write access
let memoryStore: Pengurus[] = [
  {
    id: 1,
    nama: "Ferga Pras",
    nim: "2200018001",
    angkatan: "DIFA3",
    asal_instansi: "Universitas Ahmad Dahlan",
    alamat_domisili: "Umbulharjo, Kota Yogyakarta",
    no_whatsapp: "081234567890",
    jabatan_hima: "Ketua Umum HIMA",
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  },
  {
    id: 2,
    nama: "Nabila Putri",
    nim: "2300018042",
    angkatan: "DIFA4",
    asal_instansi: "Universitas Ahmad Dahlan",
    alamat_domisili: "Banguntapan, Kabupaten Bantul",
    no_whatsapp: "082345678901",
    jabatan_hima: "Sekretaris General",
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  },
  {
    id: 3,
    nama: "Rizky Ramadhan",
    nim: "2400018105",
    angkatan: "DIFA5",
    asal_instansi: "Universitas Ahmad Dahlan",
    alamat_domisili: "Depok, Kabupaten Sleman",
    no_whatsapp: "083456789012",
    jabatan_hima: "Bendahara Utama",
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  },
];

let nextId = 4;
let dbInstance: any = null;

function getDbPath() {
  if (process.env.VERCEL || process.env.NODE_ENV === "production") {
    return path.join("/tmp", "himadifa.db");
  }
  const dataDir = path.join(process.cwd(), "data");
  if (!fs.existsSync(dataDir)) {
    fs.mkdirSync(dataDir, { recursive: true });
  }
  return path.join(dataDir, "himadifa.db");
}

export function getDb() {
  if (dbInstance) return dbInstance;

  try {
    const dbPath = getDbPath();
    const db = new Database(dbPath);
    db.pragma("journal_mode = WAL");

    db.exec(`
      CREATE TABLE IF NOT EXISTS pengurus (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        nama TEXT NOT NULL,
        nim TEXT NOT NULL,
        angkatan TEXT NOT NULL,
        asal_instansi TEXT NOT NULL,
        alamat_domisili TEXT NOT NULL,
        no_whatsapp TEXT NOT NULL,
        jabatan_hima TEXT DEFAULT 'Belum Ditentukan',
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
      );
    `);

    const count = db
      .prepare("SELECT COUNT(*) as count FROM pengurus")
      .get() as { count: number };
    if (count.count === 0) {
      const insert = db.prepare(`
        INSERT INTO pengurus (nama, nim, angkatan, asal_instansi, alamat_domisili, no_whatsapp, jabatan_hima)
        VALUES (?, ?, ?, ?, ?, ?, ?)
      `);

      const seedData = [
        [
          "Ferga Pras",
          "2200018001",
          "DIFA3",
          "Universitas Ahmad Dahlan",
          "Umbulharjo, Kota Yogyakarta",
          "081234567890",
          "Ketua Umum HIMA",
        ],
        [
          "Nabila Putri",
          "2300018042",
          "DIFA4",
          "Universitas Ahmad Dahlan",
          "Banguntapan, Kabupaten Bantul",
          "082345678901",
          "Sekretaris General",
        ],
        [
          "Rizky Ramadhan",
          "2400018105",
          "DIFA5",
          "Universitas Ahmad Dahlan",
          "Depok, Kabupaten Sleman",
          "083456789012",
          "Bendahara Utama",
        ],
      ];

      for (const row of seedData) {
        insert.run(...row);
      }
    }

    dbInstance = db;
    return db;
  } catch (err) {
    console.warn("SQLite storage fallback to in-memory store:", err);
    return null;
  }
}

// Data Access Layer with Safe Fallbacks
export function getAllPengurus(): Pengurus[] {
  const db = getDb();
  if (db) {
    try {
      const stmt = db.prepare("SELECT * FROM pengurus ORDER BY id DESC");
      return stmt.all() as Pengurus[];
    } catch (e) {
      console.error("Error fetching pengurus:", e);
    }
  }
  return [...memoryStore].sort((a, b) => b.id - a.id);
}

export function getPengurusById(id: number): Pengurus | null {
  const db = getDb();
  if (db) {
    try {
      const stmt = db.prepare("SELECT * FROM pengurus WHERE id = ?");
      return (stmt.get(id) as Pengurus) || null;
    } catch (e) {
      console.error("Error fetching pengurus by id:", e);
    }
  }
  return memoryStore.find((item) => item.id === id) || null;
}

export function createPengurus(data: {
  nama: string;
  nim: string;
  angkatan: string;
  asal_instansi: string;
  alamat_domisili: string;
  no_whatsapp: string;
  jabatan_hima?: string;
}): Pengurus {
  const jabatan =
    data.jabatan_hima && data.jabatan_hima.trim() !== ""
      ? data.jabatan_hima.trim()
      : "Belum Ditentukan";

  const db = getDb();
  if (db) {
    try {
      const stmt = db.prepare(`
        INSERT INTO pengurus (nama, nim, angkatan, asal_instansi, alamat_domisili, no_whatsapp, jabatan_hima)
        VALUES (?, ?, ?, ?, ?, ?, ?)
      `);
      const info = stmt.run(
        data.nama,
        data.nim,
        data.angkatan,
        data.asal_instansi,
        data.alamat_domisili,
        data.no_whatsapp,
        jabatan,
      );
      return getPengurusById(Number(info.lastInsertRowid))!;
    } catch (e) {
      console.error("Error creating pengurus:", e);
    }
  }

  // Memory fallback
  const newEntry: Pengurus = {
    id: nextId++,
    nama: data.nama,
    nim: data.nim,
    angkatan: data.angkatan,
    asal_instansi: data.asal_instansi,
    alamat_domisili: data.alamat_domisili,
    no_whatsapp: data.no_whatsapp,
    jabatan_hima: jabatan,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  };
  memoryStore.push(newEntry);
  return newEntry;
}

export function updatePengurus(
  id: number,
  data: Partial<Omit<Pengurus, "id" | "created_at">>,
): Pengurus | null {
  const existing = getPengurusById(id);
  if (!existing) return null;

  const updatedNama = data.nama ?? existing.nama;
  const updatedNim = data.nim ?? existing.nim;
  const updatedAngkatan = data.angkatan ?? existing.angkatan;
  const updatedAsal = data.asal_instansi ?? existing.asal_instansi;
  const updatedAlamat = data.alamat_domisili ?? existing.alamat_domisili;
  const updatedWa = data.no_whatsapp ?? existing.no_whatsapp;
  const updatedJabatan = data.jabatan_hima ?? existing.jabatan_hima;
  const now = new Date().toISOString();

  const db = getDb();
  if (db) {
    try {
      const stmt = db.prepare(`
        UPDATE pengurus 
        SET nama = ?, nim = ?, angkatan = ?, asal_instansi = ?, alamat_domisili = ?, no_whatsapp = ?, jabatan_hima = ?, updated_at = CURRENT_TIMESTAMP
        WHERE id = ?
      `);
      stmt.run(
        updatedNama,
        updatedNim,
        updatedAngkatan,
        updatedAsal,
        updatedAlamat,
        updatedWa,
        updatedJabatan,
        id,
      );
      return getPengurusById(id);
    } catch (e) {
      console.error("Error updating pengurus:", e);
    }
  }

  // Memory fallback
  const idx = memoryStore.findIndex((i) => i.id === id);
  if (idx !== -1) {
    memoryStore[idx] = {
      ...memoryStore[idx],
      nama: updatedNama,
      nim: updatedNim,
      angkatan: updatedAngkatan,
      asal_instansi: updatedAsal,
      alamat_domisili: updatedAlamat,
      no_whatsapp: updatedWa,
      jabatan_hima: updatedJabatan,
      updated_at: now,
    };
    return memoryStore[idx];
  }
  return null;
}

export function deletePengurus(id: number): boolean {
  const db = getDb();
  if (db) {
    try {
      const stmt = db.prepare("DELETE FROM pengurus WHERE id = ?");
      const info = stmt.run(id);
      if (info.changes > 0) return true;
    } catch (e) {
      console.error("Error deleting pengurus:", e);
    }
  }

  const initialLen = memoryStore.length;
  memoryStore = memoryStore.filter((i) => i.id !== id);
  return memoryStore.length < initialLen;
}
