const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);

export default async function handler(req, res) {
  // CORS
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  if (req.method === 'OPTIONS') return res.status(200).end();
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' });

  const { paymentMethodId, name, email, tour, date, hotel, guests } = req.body;

  if (!paymentMethodId || !name || !email || !tour) {
    return res.status(400).json({ error: 'Faltan datos requeridos' });
  }

  try {
    // Crear PaymentIntent por $299 MXN
    const paymentIntent = await stripe.paymentIntents.create({
      amount: 29900, // en centavos → $299.00 MXN
      currency: 'mxn',
      payment_method: paymentMethodId,
      confirm: true,
      automatic_payment_methods: { enabled: true, allow_redirects: 'never' },
      description: `Depósito reserva — ${tour}`,
      metadata: { tour, date, hotel, guests, name, email },
      receipt_email: email,
    });

    if (paymentIntent.status === 'succeeded') {
      return res.status(200).json({ success: true, paymentIntentId: paymentIntent.id });
    } else {
      return res.status(400).json({ error: 'Pago no completado. Intenta de nuevo.' });
    }
  } catch (err) {
    console.error('Stripe error:', err);
    return res.status(400).json({ error: err.message });
  }
}
