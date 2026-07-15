export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  if (req.method === 'OPTIONS') return res.status(200).end();
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' });

  const { folio, nombreArchivo, contentType, base64 } = req.body;
  if (!folio || !nombreArchivo || !base64) {
    return res.status(400).json({ error: 'Faltan datos (folio, nombreArchivo o base64)' });
  }
  if (!/^[A-Z0-9-]+$/.test(folio)) {
    return res.status(400).json({ error: 'Folio inválido' });
  }

  try {
    const buffer = Buffer.from(base64, 'base64');
    if (buffer.length > 3 * 1024 * 1024) {
      return res.status(400).json({ error: 'El archivo pesa más de 3MB' });
    }

    const key = (process.env.SUPABASE_SERVICE_ROLE_KEY || '').trim();
    if (!key) {
      return res.status(500).json({ error: 'Falta la variable SUPABASE_SERVICE_ROLE_KEY en Vercel.' });
    }
    if (key.split('.').length !== 3) {
      return res.status(500).json({ error: `La llave SUPABASE_SERVICE_ROLE_KEY no tiene el formato correcto (debe tener 3 partes separadas por puntos, tiene ${key.split('.').length}). Revisa que se haya pegado completa, sin saltos de línea. Longitud actual: ${key.length} caracteres (debería ser ~220).` });
    }

    const nombreLimpio = nombreArchivo
      .normalize('NFD').replace(/[\u0300-\u036f]/g, '')
      .replace(/[^a-zA-Z0-9.\-_]/g, '_');
    const path = `tours-reservas/${folio}/${Date.now()}_${nombreLimpio}`;

    const resp = await fetch(`https://cvufvcdyanfsbcilnony.supabase.co/storage/v1/object/comprobantes/${path}`, {
      method: 'POST',
      headers: {
        'Content-Type': contentType || 'application/octet-stream',
        'apikey': key,
        'Authorization': `Bearer ${key}`,
        'x-upsert': 'true',
      },
      body: buffer,
    });

    if (!resp.ok) {
      const errText = await resp.text();
      return res.status(400).json({ error: 'Error subiendo a Supabase: ' + errText });
    }

    const url = `https://cvufvcdyanfsbcilnony.supabase.co/storage/v1/object/public/comprobantes/${path}`;
    return res.status(200).json({ success: true, url });
  } catch (err) {
    return res.status(500).json({ error: err.message || 'Error interno' });
  }
}
