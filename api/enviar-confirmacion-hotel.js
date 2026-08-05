const FROM = 'Nexora <reservas@nexora-travel.com>';
const ADMIN_EMAIL = 'admkazzan@gmail.com';

function planTexto(d) {
  if (!d.esSocio) return 'No socio (tarifa normal)';
  return d.plan === 'plus' ? 'Socio Plan Plus (10% desc.)' : 'Socio Plan Básico (5% desc.)';
}

function plantillaAdmin(payload) {
  const linkWa = `https://wa.me/${payload.whatsapp}?text=${encodeURIComponent('Hola ' + payload.nombre + ', te contactamos de Nexora sobre tu reserva de hotel ' + payload.folio + '.')}`;
  return `
  <div style="font-family:Arial,sans-serif;max-width:520px;margin:0 auto;background:#0d2d3f;color:#fff;border-radius:12px;overflow:hidden">
    <div style="background:#c9a84c;padding:18px 24px"><strong style="font-size:18px;letter-spacing:1px;color:#0d2d3f">NUEVA RESERVA DE HOTEL (CONVENIO)</strong></div>
    <div style="padding:24px">
      <p style="font-size:22px;margin:0 0 16px;color:#f5c842"><strong>${payload.hotelNombre}</strong></p>
      <table style="width:100%;font-size:14px;line-height:1.8">
        <tr><td style="color:#8ab2b0">Folio</td><td style="text-align:right"><strong>${payload.folio}</strong></td></tr>
        <tr><td style="color:#8ab2b0">Nombre</td><td style="text-align:right">${payload.nombre}</td></tr>
        <tr><td style="color:#8ab2b0">Correo</td><td style="text-align:right">${payload.email}</td></tr>
        <tr><td style="color:#8ab2b0">WhatsApp</td><td style="text-align:right">${payload.whatsapp || '—'}</td></tr>
        <tr><td style="color:#8ab2b0">Check-in</td><td style="text-align:right">${payload.fechaCheckin}</td></tr>
        <tr><td style="color:#8ab2b0">Check-out</td><td style="text-align:right">${payload.fechaCheckout}</td></tr>
        <tr><td style="color:#8ab2b0">Noches</td><td style="text-align:right">${payload.noches}</td></tr>
        <tr><td style="color:#8ab2b0">Huéspedes</td><td style="text-align:right">${payload.adultos} adulto(s)${payload.menores ? ', ' + payload.menores + ' menor(es)' : ''}</td></tr>
        <tr><td style="color:#8ab2b0">Tipo de tarifa</td><td style="text-align:right">${planTexto(payload)}</td></tr>
        <tr><td style="color:#8ab2b0">Total</td><td style="text-align:right">$${payload.totalMXN} MXN</td></tr>
        <tr><td style="color:#8ab2b0">Anticipo</td><td style="text-align:right">$${payload.deposito} MXN</td></tr>
      </table>
      <a href="${payload.comprobanteUrl}" style="display:block;margin-top:16px;background:#f5c842;color:#0d2d3f;text-decoration:none;text-align:center;padding:12px;border-radius:8px;font-weight:bold">Ver comprobante subido</a>
      ${payload.whatsapp ? `<a href="${linkWa}" style="display:block;margin-top:10px;background:#25D366;color:#fff;text-decoration:none;text-align:center;padding:12px;border-radius:8px;font-weight:bold">Contactar por WhatsApp</a>` : ''}
      <p style="font-size:12px;color:#8ab2b0;margin-top:16px">Verifica el pago y confirma la reserva directo con el hotel — tienes hasta 3 horas antes de que se marque como atrasada.</p>
    </div>
  </div>`;
}

function plantillaCliente(payload) {
  return `
  <div style="font-family:Arial,sans-serif;max-width:520px;margin:0 auto;background:#ffffff;color:#161514;border-radius:12px;overflow:hidden;border:1px solid #eee">
    <div style="background:#0d2d3f;padding:22px 24px;text-align:center">
      <div style="color:#fff;font-size:20px;letter-spacing:2px;font-weight:bold">NEXORA</div>
      <div style="color:#3ecfc4;font-size:11px;letter-spacing:2px">VIAJA · AHORRA · MULTIPLICA</div>
    </div>
    <div style="padding:28px 24px">
      <p style="font-size:16px">Hola ${payload.nombre},</p>
      <p style="font-size:14px;color:#555;line-height:1.6">Recibimos tu solicitud de reserva de hotel con tarifa de convenio Nexora. Aquí está tu resumen:</p>
      <div style="background:#f7f7f5;border-radius:10px;padding:16px;margin:16px 0">
        <table style="width:100%;font-size:14px;line-height:1.9">
          <tr><td style="color:#888">Hotel</td><td style="text-align:right"><strong>${payload.hotelNombre}</strong></td></tr>
          <tr><td style="color:#888">Check-in</td><td style="text-align:right">${payload.fechaCheckin}</td></tr>
          <tr><td style="color:#888">Check-out</td><td style="text-align:right">${payload.fechaCheckout}</td></tr>
          <tr><td style="color:#888">Huéspedes</td><td style="text-align:right">${payload.adultos} adulto(s)${payload.menores ? ', ' + payload.menores + ' menor(es)' : ''}</td></tr>
          <tr><td style="color:#888">Total</td><td style="text-align:right">$${payload.totalMXN} MXN</td></tr>
          <tr><td style="color:#888">Anticipo pagado</td><td style="text-align:right">$${payload.deposito} MXN</td></tr>
        </table>
      </div>
      <div style="background:#fff8e6;border:1px solid #f5c842;border-radius:8px;padding:14px;text-align:center;margin-bottom:20px">
        <div style="font-size:11px;color:#8a7015;text-transform:uppercase;letter-spacing:1px">Tu folio</div>
        <div style="font-size:24px;font-weight:bold;color:#8a7015;letter-spacing:1px">${payload.folio}</div>
      </div>
      <a href="https://nexora-tours.vercel.app/mi-reserva.html?folio=${encodeURIComponent(payload.folio)}" style="display:block;background:#0b9e99;color:#fff;text-decoration:none;text-align:center;padding:12px;border-radius:8px;font-weight:bold;margin-bottom:16px">Ver el estado de mi reserva</a>
      <p style="font-size:13px;color:#666;line-height:1.6">Validamos tu comprobante en un máximo de <strong>3 horas</strong> y confirmamos directo con el hotel. Recuerda: una vez pagado el anticipo, la cancelación gratuita aplica hasta 24h antes de tu llegada. Guarda tu folio.</p>
      <div style="background:#f7f7f5;border-radius:8px;padding:12px 16px;margin-top:16px;text-align:center">
        <p style="font-size:12px;color:#888;margin:0">¿No recibiste confirmación en 6 horas?<br>
        <a href="https://wa.me/529982168410?text=${encodeURIComponent('Hola, sigo esperando confirmación de mi reserva de hotel, folio ' + payload.folio)}" style="color:#0b9e99;font-weight:bold;text-decoration:none">Contacta a soporte por WhatsApp →</a></p>
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
      headers: { 'Authorization': `Bearer ${process.env.RESEND_API_KEY}`, 'Content-Type': 'application/json' },
      body: JSON.stringify({ from: FROM, to, subject, html }),
    });
    if (!resp.ok) { const err = await resp.text(); throw new Error(`Resend (${to}): ${err}`); }
  };

  const resultados = { admin: null, cliente: null };
  try {
    await enviar(ADMIN_EMAIL, `Nueva reserva de hotel (convenio) — ${d.hotelNombre} — ${d.folio}`, plantillaAdmin(d));
    resultados.admin = 'ok';
  } catch (e) { resultados.admin = e.message; }

  try {
    await enviar(d.email, `Tu reserva de hotel en Nexora — folio ${d.folio}`, plantillaCliente(d));
    resultados.cliente = 'ok';
  } catch (e) { resultados.cliente = e.message; }

  return res.status(200).json({ success: true, resultados });
}
