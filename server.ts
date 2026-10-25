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
      akreditasi: 'A (Unggul)',
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
    presensiSiswa: []
  };
}

function normalizeDatabase(data: any) {
  if (!data || typeof data !== 'object' || !Array.isArray(data.ptkList)) {
    return getDefaultDatabase();
  }

  // Ensure Kepala Sekolah matches official record
  data.ptkList = data.ptkList.map((p: any) => {
    if (
      p.id === 'ptk-1' ||
      p.jabatan?.toLowerCase().includes('kepala sekolah') ||
      p.jabatan?.toLowerCase().includes('kepsek') ||
      p.nama?.toLowerCase().includes('suyanto')
    ) {
      return {
        ...p,
        nama: 'VITA DEWI SUSANTI',
        gelar: 'S.Pd. M.Pd',
        nip: '19830723 200604 2 022',
        jenisKelamin: 'Perempuan',
        email: 'vitadewisusanti.gemenggeng@gmail.com',
        fotoUrl:
          p.fotoUrl && !p.fotoUrl.includes('photo-1544717305')
            ? p.fotoUrl
            : 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=400&auto=format&fit=crop&q=80'
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
    fs.writeFileSync(DB_FILE, JSON.stringify(payload, null, 2), 'utf-8');
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

// Get full school data
app.get('/api/school-data', (_req, res) => {
  try {
    const db = readDatabase();
    res.json({
      success: true,
      data: db
    });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// Save or sync full school data (from Laptop or HP)
app.post('/api/school-data', (req, res) => {
  try {
    const incomingData = req.body;
    if (!incomingData || !Array.isArray(incomingData.ptkList)) {
      return res.status(400).json({ success: false, message: 'Invalid data format' });
    }

    const current = readDatabase();
    const merged = {
      ...current,
      ...incomingData,
      ptkList: incomingData.ptkList || current.ptkList,
      siswaList: incomingData.siswaList || current.siswaList,
      jadwalList: incomingData.jadwalList || current.jadwalList,
      kegiatanList: incomingData.kegiatanList || current.kegiatanList,
      albumList: incomingData.albumList || current.albumList,
      nilaiList: incomingData.nilaiList || current.nilaiList,
      presensiPtk: incomingData.presensiPtk || current.presensiPtk,
      presensiSiswa: incomingData.presensiSiswa || current.presensiSiswa,
      pesanKepsek: incomingData.pesanKepsek ?? current.pesanKepsek
    };

    const saved = writeDatabase(normalizeDatabase(merged));
    res.json({
      success: true,
      lastUpdated: saved.lastUpdated,
      countPtk: saved.ptkList.length,
      countSiswa: saved.siswaList.length
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
