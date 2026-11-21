import express from 'express';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const isProd = process.env.NODE_ENV === 'production';
// In dev mode, server must strictly bind to port 3000 (dev proxy targets 3000, while nginx listens on 8080).
// In production, Cloud Run passes PORT (e.g. 8080).
const PORT = isProd && process.env.PORT ? parseInt(process.env.PORT, 10) : 3000;

app.use(express.json({ limit: '30mb' }));

const DATA_DIR = path.join(__dirname, 'data');
const DB_FILE = path.join(DATA_DIR, 'school-database.json');
const DEFAULT_DB_FILE = path.join(DATA_DIR, 'default-database.json');

// Ensure data directory exists
if (!fs.existsSync(DATA_DIR)) {
  fs.mkdirSync(DATA_DIR, { recursive: true });
}

function getDefaultDatabase(): any {
  try {
    if (fs.existsSync(DEFAULT_DB_FILE)) {
      return JSON.parse(fs.readFileSync(DEFAULT_DB_FILE, 'utf-8'));
    }
    if (fs.existsSync(DB_FILE)) {
      return JSON.parse(fs.readFileSync(DB_FILE, 'utf-8'));
    }
  } catch (e) {
    console.error('Error loading default database file:', e);
  }
  return {
    version: 3,
    lastUpdated: new Date().toISOString(),
    sekolahInfo: {
      nama: 'SDN 1 GEMENGGENG',
      npsn: '20537803',
      akreditasi: 'B',
      kepalaSekolah: 'VITA DEWI SUSANTI, S.Pd., M.Pd.',
      nipKepsek: '19830723 200604 2 022'
    },
    ptkList: [],
    siswaList: [],
    jadwalList: [],
    kegiatanList: [],
    albumList: [],
    nilaiList: [],
    presensiPtk: [],
    presensiSiswa: [],
    infaqMusholaList: []
  };
}

function normalizeDatabase(data: any) {
  if (!data || typeof data !== 'object') {
    return getDefaultDatabase();
  }

  const fallback = getDefaultDatabase();

  // Ensure sekolahInfo exists
  if (!data.sekolahInfo || typeof data.sekolahInfo !== 'object') {
    data.sekolahInfo = fallback.sekolahInfo;
  }

  // Ensure arrays exist
  if (!Array.isArray(data.ptkList)) {
    data.ptkList = fallback.ptkList;
  }
  if (!Array.isArray(data.siswaList)) {
    data.siswaList = fallback.siswaList;
  }
  if (!Array.isArray(data.jadwalList)) data.jadwalList = fallback.jadwalList || [];
  if (!Array.isArray(data.kegiatanList)) data.kegiatanList = fallback.kegiatanList || [];
  if (!Array.isArray(data.albumList)) data.albumList = fallback.albumList || [];
  if (!Array.isArray(data.nilaiList)) data.nilaiList = fallback.nilaiList || [];
  if (!Array.isArray(data.presensiPtk)) data.presensiPtk = fallback.presensiPtk || [];
  if (!Array.isArray(data.presensiSiswa)) data.presensiSiswa = fallback.presensiSiswa || [];
  if (!Array.isArray(data.infaqMusholaList)) {
    data.infaqMusholaList = Array.isArray(fallback.infaqMusholaList) && fallback.infaqMusholaList.length > 0
      ? fallback.infaqMusholaList
      : [
          {
            id: 'infaq-1',
            tanggal: '2026-11-02',
            uraian: 'Saldo Awal Kas Infaq Mushola SDN 1 Gemenggeng',
            uangMasuk: 1250000,
            uangKeluar: 0
          },
          {
            id: 'infaq-2',
            tanggal: '2026-11-06',
            uraian: 'Infaq Jumat Siswa Kelas 1 s/d 6 & Dewan Guru',
            uangMasuk: 285000,
            uangKeluar: 0
          },
          {
            id: 'infaq-3',
            tanggal: '2026-11-09',
            uraian: 'Pembelian Mukena, Sarung, dan Sajadah Mushola',
            uangMasuk: 0,
            uangKeluar: 350000
          },
          {
            id: 'infaq-4',
            tanggal: '2026-11-13',
            uraian: 'Infaq Jumat & Donasi Wali Murid',
            uangMasuk: 340000,
            uangKeluar: 0
          },
          {
            id: 'infaq-5',
            tanggal: '2026-11-16',
            uraian: 'Perawatan Kran Tempat Wudhu & Kebersihan Mushola',
            uangMasuk: 0,
            uangKeluar: 125000
          }
        ];
  }

  // Migrasi aman: hanya ganti jika data masih mengandung nama lama 'suyanto'
  data.ptkList = data.ptkList.map((p: any) => {
    if (p.nama && p.nama.toLowerCase().includes('suyanto')) {
      return {
        ...p,
        nama: 'VITA DEWI SUSANTI',
        gelar: 'S.Pd. M.Pd',
        nip: '19830723 200604 2 022',
        jenisKelamin: 'Perempuan',
        email: 'vitadewisusanti.gemenggeng@gmail.com',
        fotoUrl: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=400&auto=format&fit=crop&q=80'
      };
    }
    return p;
  });

  return data;
}

function readDatabase() {
  try {
    if (!fs.existsSync(DB_FILE)) {
      const initial = getDefaultDatabase();
      fs.writeFileSync(DB_FILE, JSON.stringify(initial, null, 2), 'utf-8');
      return initial;
    }
    const raw = fs.readFileSync(DB_FILE, 'utf-8');
    const parsed = JSON.parse(raw);
    const normalized = normalizeDatabase(parsed);
    return normalized;
  } catch (err) {
    console.error('Error reading database file, returning default:', err);
    return getDefaultDatabase();
  }
}

function writeDatabase(data: any) {
  try {
    const payload = {
      ...data,
      lastUpdated: new Date().toISOString()
    };
    const jsonStr = JSON.stringify(payload, null, 2);
    fs.writeFileSync(DB_FILE, jsonStr, 'utf-8');
    // Also keep backup in DEFAULT_DB_FILE to prevent any regression to factory state
    try {
      fs.writeFileSync(DEFAULT_DB_FILE, jsonStr, 'utf-8');
    } catch {
      // ignore backup write error
    }
    return payload;
  } catch (err) {
    console.error('Error writing database file:', err);
    throw err;
  }
}

// ----------------- API ROUTES ----------------- //

// Health check
app.get('/api/health', (_req, res) => {
  res.json({
    status: 'ok',
    app: 'SDN 1 Gemenggeng School Information System',
    serverTime: new Date().toISOString()
  });
});

// Get full school data with strict anti-cache headers
app.get('/api/school-data', (_req, res) => {
  try {
    res.set({
      'Cache-Control': 'no-store, no-cache, must-revalidate, proxy-revalidate, max-age=0',
      'Pragma': 'no-cache',
      'Expires': '0',
      'Surrogate-Control': 'no-store'
    });
    const db = readDatabase();
    res.json({
      success: true,
      data: db
    });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// Save or sync full/partial school data (from Laptop or HP)
app.post('/api/school-data', (req, res) => {
  try {
    const incomingData = req.body;
    if (!incomingData || typeof incomingData !== 'object') {
      return res.status(400).json({ success: false, message: 'Invalid data format' });
    }

    const current = readDatabase();
    const merged = {
      ...current,
      ...(incomingData.sekolahInfo ? { sekolahInfo: { ...current.sekolahInfo, ...incomingData.sekolahInfo } } : {}),
      ...(Array.isArray(incomingData.ptkList) ? { ptkList: incomingData.ptkList } : {}),
      ...(Array.isArray(incomingData.siswaList) ? { siswaList: incomingData.siswaList } : {}),
      ...(Array.isArray(incomingData.jadwalList) ? { jadwalList: incomingData.jadwalList } : {}),
      ...(Array.isArray(incomingData.kegiatanList) ? { kegiatanList: incomingData.kegiatanList } : {}),
      ...(Array.isArray(incomingData.albumList) ? { albumList: incomingData.albumList } : {}),
      ...(Array.isArray(incomingData.nilaiList) ? { nilaiList: incomingData.nilaiList } : {}),
      ...(Array.isArray(incomingData.presensiPtk) ? { presensiPtk: incomingData.presensiPtk } : {}),
      ...(Array.isArray(incomingData.presensiSiswa) ? { presensiSiswa: incomingData.presensiSiswa } : {}),
      ...(Array.isArray(incomingData.infaqMusholaList) ? { infaqMusholaList: incomingData.infaqMusholaList } : {}),
      ...(incomingData.pesanKepsek !== undefined ? { pesanKepsek: incomingData.pesanKepsek } : {})
    };

    const saved = writeDatabase(normalizeDatabase(merged));
    res.json({
      success: true,
      lastUpdated: saved.lastUpdated,
      countPtk: saved.ptkList?.length || 0,
      countSiswa: saved.siswaList?.length || 0
    });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// Quick sync specifically for PTK
app.post('/api/school-data/sync-ptk', (req, res) => {
  try {
    const { ptkList } = req.body;
    if (!Array.isArray(ptkList)) {
      return res.status(400).json({ success: false, message: 'ptkList must be an array' });
    }
    const current = readDatabase();
    current.ptkList = ptkList;
    const saved = writeDatabase(normalizeDatabase(current));
    res.json({
      success: true,
      lastUpdated: saved.lastUpdated,
      countPtk: saved.ptkList.length
    });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// Reset to initial official dataset
app.post('/api/school-data/reset-default', (_req, res) => {
  try {
    const fresh = getDefaultDatabase();
    writeDatabase(fresh);
    res.json({
      success: true,
      message: 'Database reset to default official data',
      data: fresh
    });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// ----------------- VITE / STATIC SERVING ----------------- //

async function start() {
  if (!isProd) {
    const { createServer: createViteServer } = await import('vite');
    const vite = await createViteServer({
      server: {
        middlewareMode: true,
        hmr: false
      },
      appType: 'spa'
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(__dirname, 'dist');
    app.use(express.static(distPath));
    app.get('*', (_req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`SDN 1 Gemenggeng Server running on port ${PORT}`);
  });
}

start();
