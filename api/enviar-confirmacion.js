const FROM = 'Nexora <reservas@nexora-travel.com>';
const ADMIN_EMAIL = 'admkazzan@gmail.com';

function plantillaAdmin(d) {
  const linkWa = `https://wa.me/52${d.whatsapp}?text=${encodeURIComponent('Hola ' + d.nombre + ', te contactamos de Nexora sobre tu reserva ' + d.folio + '.')}`;
  return `
  <div style="font-family:Arial,sans-serif;max-width:520px;margin:0 auto;background:#0d2d3f;color:#fff;border-radius:12px;overflow:hidden">
    <div style="background:#0b9e99;padding:18px 24px"><strong style="font-size:18px;letter-spacing:1px">NUEVA RESERVA DE TOUR</strong></div>
    <div style="padding:24px">
      <p style="font-size:22px;margin:0 0 16px;color:#3ecfc4"><strong>${d.tourNombre}</strong></p>
      <table style="width:100%;font-size:14px;line-height:1.8">
        <tr><td style="color:#8ab2b0">Folio</td><td style="text-align:right"><strong>${d.folio}</strong></td></tr>
        <tr><td style="color:#8ab2b0">Nombre</td><td style="text-align:right">${d.nombre}</td></tr>
        <tr><td style="color:#8ab2b0">Correo</td><td style="text-align:right">${d.email}</td></tr>
        <tr><td style="color:#8ab2b0">WhatsApp</td><td style="text-align:right">${d.whatsapp || '—'}</td></tr>
        <tr><td style="color:#8ab2b0">Hotel / Pick-up</td><td style="text-align:right">${d.hotel}</td></tr>
        <tr><td style="color:#8ab2b0">Fecha del tour</td><td style="text-align:right">${d.fecha}</td></tr>
        <tr><td style="color:#8ab2b0">Personas</td><td style="text-align:right">${d.personas}</td></tr>
        <tr><td style="color:#8ab2b0">Total</td><td style="text-align:right">$${d.totalMXN} MXN</td></tr>
        <tr><td style="color:#8ab2b0">Anticipo</td><td style="text-align:right">$${d.deposito} MXN</td></tr>
      </table>
      <a href="${d.comprobanteUrl}" style="display:block;margin-top:16px;background:#f5c842;color:#0d2d3f;text-decoration:none;text-align:center;padding:12px;border-radius:8px;font-weight:bold">Ver comprobante subido</a>
      ${d.whatsapp ? `<a href="${linkWa}" style="display:block;margin-top:10px;background:#25D366;color:#fff;text-decoration:none;text-align:center;padding:12px;border-radius:8px;font-weight:bold">Contactar por WhatsApp</a>` : ''}
      <p style="font-size:12px;color:#8ab2b0;margin-top:16px">Tienes hasta 3 horas para validar el pago antes de que se marque como atrasada.</p>
    </div>
  </div>`;
}

function plantillaCliente(d) {
  return `
  <div style="font-family:Arial,sans-serif;max-width:520px;margin:0 auto;background:#ffffff;color:#161514;border-radius:12px;overflow:hidden;border:1px solid #eee">
    <div style="background:#0d2d3f;padding:22px 24px;text-align:center">
      <div style="color:#fff;font-size:20px;letter-spacing:2px;font-weight:bold">NEXORA</div>
      <div style="color:#3ecfc4;font-size:11px;letter-spacing:2px">VIAJA · AHORRA · MULTIPLICA</div>
    </div>
    <div style="padding:28px 24px">
      <p style="font-size:16px">Hola ${d.nombre},</p>
      <p style="font-size:14px;color:#555;line-height:1.6">Recibimos tu solicitud de reserva. Aquí está tu resumen:</p>
      <div style="background:#f7f7f5;border-radius:10px;padding:16px;margin:16px 0">
        <table style="width:100%;font-size:14px;line-height:1.9">
          <tr><td style="color:#888">Tour</td><td style="text-align:right"><strong>${d.tourNombre}</strong></td></tr>
          <tr><td style="color:#888">Fecha</td><td style="text-align:right">${d.fecha}</td></tr>
          <tr><td style="color:#888">Personas</td><td style="text-align:right">${d.personas}</td></tr>
          <tr><td style="color:#888">Total</td><td style="text-align:right">$${d.totalMXN} MXN</td></tr>
          <tr><td style="color:#888">Anticipo pagado</td><td style="text-align:right">$${d.deposito} MXN</td></tr>
        </table>
      </div>
      <div style="background:#fff8e6;border:1px solid #f5c842;border-radius:8px;padding:14px;text-align:center;margin-bottom:20px">
        <div style="font-size:11px;color:#8a7015;text-transform:uppercase;letter-spacing:1px">Tu folio</div>
        <div style="font-size:24px;font-weight:bold;color:#8a7015;letter-spacing:1px">${d.folio}</div>
      </div>
      <p style="font-size:13px;color:#666;line-height:1.6">Validamos tu comprobante en un máximo de <strong>3 horas</strong>. Guarda este folio para dar seguimiento a tu reserva.</p>
      <div style="background:#f7f7f5;border-radius:8px;padding:12px 16px;margin-top:16px;text-align:center">
        <p style="font-size:12px;color:#888;margin:0">¿No recibiste confirmación en 6 horas?<br>
        <a href="https://wa.me/529982168410?text=${encodeURIComponent('Hola, sigo esperando confirmación de mi reserva, folio ' + d.folio)}" style="color:#0b9e99;font-weight:bold;text-decoration:none">Contacta a soporte por WhatsApp →</a></p>
      </div>
    </div>
  </div>`;
}

export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  if (req.method === 'OPTIONS') return res.status(200).end();
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' });

  const d = req.body;
  if (!d || !d.folio || !d.email) {
    return res.status(400).json({ error: 'Faltan datos de la reserva' });
  }

  const enviar = async (to, subject, html) => {
    const resp = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${process.env.RESEND_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ from: FROM, to, subject, html }),
    });
    if (!resp.ok) {
      const err = await resp.text();
      throw new Error(`Resend (${to}): ${err}`);
    }
  };

  const resultados = { admin: null, cliente: null };
  try {
    await enviar(ADMIN_EMAIL, `Nueva reserva — ${d.tourNombre} — ${d.folio}`, plantillaAdmin(d));
    resultados.admin = 'ok';
  } catch (e) { resultados.admin = e.message; }

  try {
    await enviar(d.email, `Tu reserva en Nexora — folio ${d.folio}`, plantillaCliente(d));
    resultados.cliente = 'ok';
  } catch (e) { resultados.cliente = e.message; }

  return res.status(200).json({ success: true, resultados });
}
