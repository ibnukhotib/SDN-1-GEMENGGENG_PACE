// Vercel Serverless Function for /api/school-data
// Supports Upstash Redis / Vercel KV via REST API (env: UPSTASH_REDIS_REST_URL & UPSTASH_REDIS_REST_TOKEN, or KV_REST_API_URL & KV_REST_API_TOKEN)

const CHUNK_SIZE = 400_000; // 400 KB per chunk so free-tier Redis limits are never exceeded
const KEY_PREFIX = 'sdn1_gemenggeng_db_v1';

function getRedisConfig() {
  const url = process.env.UPSTASH_REDIS_REST_URL || process.env.KV_REST_API_URL;
  const token = process.env.UPSTASH_REDIS_REST_TOKEN || process.env.KV_REST_API_TOKEN;
  if (!url || !token) return null;
  return { url: url.replace(/\/+$/, ''), token };
}

async function redisCommand(config: { url: string; token: string }, args: (string | number)[]) {
  const res = await fetch(config.url, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${config.token}`,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(args)
  });
  if (!res.ok) {
    const text = await res.text();
    throw new Error(`Redis error ${res.status}: ${text}`);
  }
  const json = await res.json();
  return json.result;
}

async function readDbFromRedis(config: { url: string; token: string }) {
  const metaRaw = await redisCommand(config, ['GET', `${KEY_PREFIX}:meta`]);
  if (!metaRaw) {
    // Fallback to single legacy key if present
    const singleRaw = await redisCommand(config, ['GET', KEY_PREFIX]);
    if (!singleRaw) return null;
    return typeof singleRaw === 'string' ? JSON.parse(singleRaw) : singleRaw;
  }

  const meta = typeof metaRaw === 'string' ? JSON.parse(metaRaw) : metaRaw;
  const chunkCount = Number(meta.chunks || 0);
  if (chunkCount <= 0) return null;

  const keys = Array.from({ length: chunkCount }, (_, i) => `${KEY_PREFIX}:chunk:${i}`);
  const chunks = (await redisCommand(config, ['MGET', ...keys])) as (string | null)[];
  if (!Array.isArray(chunks) || chunks.some((c) => c === null)) {
    return null;
  }

  const fullJson = chunks.join('');
  return JSON.parse(fullJson);
}

async function writeDbToRedis(config: { url: string; token: string }, data: any) {
  const payload = {
    ...data,
    lastUpdated: new Date().toISOString()
  };
  const jsonStr = JSON.stringify(payload);
  const chunks: string[] = [];
  for (let i = 0; i < jsonStr.length; i += CHUNK_SIZE) {
    chunks.push(jsonStr.slice(i, i + CHUNK_SIZE));
  }

  for (let i = 0; i < chunks.length; i++) {
    await redisCommand(config, ['SET', `${KEY_PREFIX}:chunk:${i}`, chunks[i]]);
  }

  await redisCommand(config, [
    'SET',
    `${KEY_PREFIX}:meta`,
    JSON.stringify({ chunks: chunks.length, lastUpdated: payload.lastUpdated })
  ]);

  return payload;
}

function setNoCacheHeaders(res: any) {
  res.setHeader('Cache-Control', 'no-store, no-cache, must-revalidate, proxy-revalidate, max-age=0');
  res.setHeader('Pragma', 'no-cache');
  res.setHeader('Expires', '0');
}

export default async function handler(req: any, res: any) {
  setNoCacheHeaders(res);

  const config = getRedisConfig();
  if (!config) {
    return res.status(503).json({
      success: false,
      needsStorageSetup: true,
      message:
        'Database cloud Vercel belum dihubungkan. Tambahkan Upstash Redis gratis di Vercel Storage agar data tersimpan & sinkron antar Laptop dan HP.'
    });
  }

  try {
    if (req.method === 'GET') {
      const db = await readDbFromRedis(config);
      if (!db) {
        return res.status(200).json({
          success: true,
          isEmpty: true,
          data: null
        });
      }
      return res.status(200).json({
        success: true,
        data: db
      });
    }

    if (req.method === 'POST') {
      const incoming = typeof req.body === 'string' ? JSON.parse(req.body) : req.body;
      if (!incoming || typeof incoming !== 'object') {
        return res.status(400).json({ success: false, message: 'Format data tidak valid' });
      }

      const current = (await readDbFromRedis(config)) || { version: 3 };
      const merged = {
        ...current,
        ...(incoming.sekolahInfo
          ? { sekolahInfo: { ...(current.sekolahInfo || {}), ...incoming.sekolahInfo } }
          : {}),
        ...(Array.isArray(incoming.ptkList) ? { ptkList: incoming.ptkList } : {}),
        ...(Array.isArray(incoming.siswaList) ? { siswaList: incoming.siswaList } : {}),
        ...(Array.isArray(incoming.jadwalList) ? { jadwalList: incoming.jadwalList } : {}),
        ...(Array.isArray(incoming.kegiatanList) ? { kegiatanList: incoming.kegiatanList } : {}),
        ...(Array.isArray(incoming.albumList) ? { albumList: incoming.albumList } : {}),
        ...(Array.isArray(incoming.nilaiList) ? { nilaiList: incoming.nilaiList } : {}),
        ...(Array.isArray(incoming.presensiPtk) ? { presensiPtk: incoming.presensiPtk } : {}),
        ...(Array.isArray(incoming.presensiSiswa) ? { presensiSiswa: incoming.presensiSiswa } : {}),
        ...(Array.isArray(incoming.infaqMusholaList)
          ? { infaqMusholaList: incoming.infaqMusholaList }
          : {}),
        ...(incoming.pesanKepsek !== undefined ? { pesanKepsek: incoming.pesanKepsek } : {})
      };

      const saved = await writeDbToRedis(config, merged);
      return res.status(200).json({
        success: true,
        lastUpdated: saved.lastUpdated
      });
    }

    return res.status(405).json({ success: false, message: 'Method not allowed' });
  } catch (err: any) {
    console.error('Vercel /api/school-data error:', err);
    return res.status(500).json({
      success: false,
      message: err?.message || 'Gagal memproses database server'
    });
  }
}
