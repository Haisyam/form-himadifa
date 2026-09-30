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

export function getWibISOString(): string {
  const d = new Date();
  // Format to Asia/Jakarta timestamp
  return d.toLocaleString("id-ID", {
    timeZone: "Asia/Jakarta",
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
    hour12: false,
  });
}

export function formatWibDate(dateStr?: string): string {
  if (!dateStr) return "-";
  try {
    const d = new Date(dateStr);
    if (isNaN(d.getTime())) return dateStr;
    return (
      d.toLocaleString("id-ID", {
        timeZone: "Asia/Jakarta",
        day: "2-digit",
        month: "long",
        year: "numeric",
        hour: "2-digit",
        minute: "2-digit",
        hour12: false,
      }) + " WIB"
    );
  } catch (e) {
    return dateStr;
  }
}

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

function getJsonBackupPath() {
  if (process.env.VERCEL || process.env.NODE_ENV === "production") {
    return path.join("/tmp", "pengurus_backup.json");
  }
  const dataDir = path.join(process.cwd(), "data");
  if (!fs.existsSync(dataDir)) {
    fs.mkdirSync(dataDir, { recursive: true });
  }
  return path.join(dataDir, "pengurus_backup.json");
}

let memoryStore: Pengurus[] = [];
let nextId = 1;

// Load persistent data from JSON backup if available
function loadJsonBackup(): Pengurus[] | null {
  try {
    const backupPath = getJsonBackupPath();
    if (fs.existsSync(backupPath)) {
      const content = fs.readFileSync(backupPath, "utf-8");
      const parsed = JSON.parse(content);
      if (Array.isArray(parsed) && parsed.length > 0) {
        return parsed;
      }
    }
  } catch (e) {
    console.error("Failed to read JSON backup:", e);
  }
  return null;
}

// Save persistent data to JSON backup
function saveJsonBackup(data: Pengurus[]) {
  try {
    const backupPath = getJsonBackupPath();
    fs.writeFileSync(backupPath, JSON.stringify(data, null, 2), "utf-8");
  } catch (e) {
    console.error("Failed to save JSON backup:", e);
  }
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
      const backup = loadJsonBackup();
      if (backup && backup.length > 0) {
        const insert = db.prepare(`
          INSERT INTO pengurus (id, nama, nim, angkatan, asal_instansi, alamat_domisili, no_whatsapp, jabatan_hima, created_at, updated_at)
          VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
        `);
        for (const row of backup) {
          insert.run(
            row.id,
            row.nama,
            row.nim,
            row.angkatan,
            row.asal_instansi,
            row.alamat_domisili,
            row.no_whatsapp,
            row.jabatan_hima,
            row.created_at || getWibISOString(),
            row.updated_at || getWibISOString()
          );
        }
      } else {
        const insert = db.prepare(`
          INSERT INTO pengurus (nama, nim, angkatan, asal_instansi, alamat_domisili, no_whatsapp, jabatan_hima, created_at, updated_at)
          VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
        `);

        const nowWib = getWibISOString();
        const seedData = [
          [
            "Ferga Pras",
            "2200018001",
            "DIFA3",
            "Universitas Ahmad Dahlan",
            "Umbulharjo, Kota Yogyakarta",
            "081234567890",
            "Ketua Umum HIMA",
            nowWib,
            nowWib,
          ],
          [
            "Nabila Putri",
            "2300018042",
            "DIFA4",
            "Universitas Ahmad Dahlan",
            "Banguntapan, Kabupaten Bantul",
            "082345678901",
            "Sekretaris General",
            nowWib,
            nowWib,
          ],
          [
            "Rizky Ramadhan",
            "2400018105",
            "DIFA5",
            "Universitas Ahmad Dahlan",
            "Depok, Kabupaten Sleman",
            "083456789012",
            "Bendahara Utama",
            nowWib,
            nowWib,
          ],
        ];

        for (const row of seedData) {
          insert.run(...row);
        }
      }
    }

    dbInstance = db;
    saveJsonBackup(getAllPengurusFromDb(db));
    return db;
  } catch (err) {
    console.warn("SQLite storage fallback to in-memory store:", err);
    if (memoryStore.length === 0) {
      const backup = loadJsonBackup();
      if (backup && backup.length > 0) {
        memoryStore = backup;
        nextId = Math.max(...backup.map((i) => i.id)) + 1;
      } else {
        const nowWib = getWibISOString();
        memoryStore = [
          {
            id: 1,
            nama: "Ferga Pras",
            nim: "2200018001",
            angkatan: "DIFA3",
            asal_instansi: "Universitas Ahmad Dahlan",
            alamat_domisili: "Umbulharjo, Kota Yogyakarta",
            no_whatsapp: "081234567890",
            jabatan_hima: "Ketua Umum HIMA",
            created_at: nowWib,
            updated_at: nowWib,
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
            created_at: nowWib,
            updated_at: nowWib,
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
            created_at: nowWib,
            updated_at: nowWib,
          },
        ];
        nextId = 4;
        saveJsonBackup(memoryStore);
      }
    }
    return null;
  }
}

function getAllPengurusFromDb(db: any): Pengurus[] {
  try {
    const stmt = db.prepare("SELECT * FROM pengurus ORDER BY id DESC");
    return stmt.all() as Pengurus[];
  } catch (e) {
    return [];
  }
}

export function isNamaExists(nama: string, excludeId?: number): boolean {
  const cleanNama = nama.trim().toLowerCase();
  const db = getDb();
  if (db) {
    try {
      if (excludeId) {
        const stmt = db.prepare(
          "SELECT COUNT(*) as count FROM pengurus WHERE LOWER(TRIM(nama)) = ? AND id != ?"
        );
        const res = stmt.get(cleanNama, excludeId) as { count: number };
        return res.count > 0;
      } else {
        const stmt = db.prepare(
          "SELECT COUNT(*) as count FROM pengurus WHERE LOWER(TRIM(nama)) = ?"
        );
        const res = stmt.get(cleanNama) as { count: number };
        return res.count > 0;
      }
    } catch (e) {
      console.error("Error checking duplicate nama in DB:", e);
    }
  }

  return memoryStore.some(
    (item) =>
      item.nama.trim().toLowerCase() === cleanNama && item.id !== excludeId
  );
}

export function isNimExists(nim: string, excludeId?: number): boolean {
  const cleanNim = nim.trim();
  const db = getDb();
  if (db) {
    try {
      if (excludeId) {
        const stmt = db.prepare(
          "SELECT COUNT(*) as count FROM pengurus WHERE TRIM(nim) = ? AND id != ?"
        );
        const res = stmt.get(cleanNim, excludeId) as { count: number };
        return res.count > 0;
      } else {
        const stmt = db.prepare(
          "SELECT COUNT(*) as count FROM pengurus WHERE TRIM(nim) = ?"
        );
        const res = stmt.get(cleanNim) as { count: number };
        return res.count > 0;
      }
    } catch (e) {
      console.error("Error checking duplicate nim in DB:", e);
    }
  }

  return memoryStore.some(
    (item) => item.nim.trim() === cleanNim && item.id !== excludeId
  );
}

export function getAllPengurus(): Pengurus[] {
  const db = getDb();
  if (db) {
    try {
      const list = getAllPengurusFromDb(db);
      saveJsonBackup(list);
      return list;
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
  const cleanNama = data.nama.trim();
  const cleanNim = data.nim.trim();
  const nowWib = getWibISOString();

  const jabatan =
    data.jabatan_hima && data.jabatan_hima.trim() !== ""
      ? data.jabatan_hima.trim()
      : "Belum Ditentukan";

  const db = getDb();
  if (db) {
    try {
      const stmt = db.prepare(`
        INSERT INTO pengurus (nama, nim, angkatan, asal_instansi, alamat_domisili, no_whatsapp, jabatan_hima, created_at, updated_at)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
      `);
      const info = stmt.run(
        cleanNama,
        cleanNim,
        data.angkatan,
        data.asal_instansi.trim(),
        data.alamat_domisili.trim(),
        data.no_whatsapp.trim(),
        jabatan,
        nowWib,
        nowWib
      );
      const newRecord = getPengurusById(Number(info.lastInsertRowid))!;
      saveJsonBackup(getAllPengurusFromDb(db));
      return newRecord;
    } catch (e) {
      console.error("Error creating pengurus:", e);
    }
  }

  // Memory fallback
  const newEntry: Pengurus = {
    id: nextId++,
    nama: cleanNama,
    nim: cleanNim,
    angkatan: data.angkatan,
    asal_instansi: data.asal_instansi.trim(),
    alamat_domisili: data.alamat_domisili.trim(),
    no_whatsapp: data.no_whatsapp.trim(),
    jabatan_hima: jabatan,
    created_at: nowWib,
    updated_at: nowWib,
  };
  memoryStore.push(newEntry);
  saveJsonBackup(memoryStore);
  return newEntry;
}

export function updatePengurus(
  id: number,
  data: Partial<Omit<Pengurus, "id" | "created_at">>
): Pengurus | null {
  const existing = getPengurusById(id);
  if (!existing) return null;

  const updatedNama = data.nama ? data.nama.trim() : existing.nama;
  const updatedNim = data.nim ? data.nim.trim() : existing.nim;
  const updatedAngkatan = data.angkatan ?? existing.angkatan;
  const updatedAsal = data.asal_instansi ? data.asal_instansi.trim() : existing.asal_instansi;
  const updatedAlamat = data.alamat_domisili ? data.alamat_domisili.trim() : existing.alamat_domisili;
  const updatedWa = data.no_whatsapp ? data.no_whatsapp.trim() : existing.no_whatsapp;
  const updatedJabatan = data.jabatan_hima ? data.jabatan_hima.trim() : existing.jabatan_hima;
  const nowWib = getWibISOString();

  const db = getDb();
  if (db) {
    try {
      const stmt = db.prepare(`
        UPDATE pengurus 
        SET nama = ?, nim = ?, angkatan = ?, asal_instansi = ?, alamat_domisili = ?, no_whatsapp = ?, jabatan_hima = ?, updated_at = ?
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
        nowWib,
        id
      );
      const updated = getPengurusById(id);
      saveJsonBackup(getAllPengurusFromDb(db));
      return updated;
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
      updated_at: nowWib,
    };
    saveJsonBackup(memoryStore);
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
      if (info.changes > 0) {
        saveJsonBackup(getAllPengurusFromDb(db));
        return true;
      }
    } catch (e) {
      console.error("Error deleting pengurus:", e);
    }
  }

  const initialLen = memoryStore.length;
  memoryStore = memoryStore.filter((i) => i.id !== id);
  saveJsonBackup(memoryStore);
  return memoryStore.length < initialLen;
}
