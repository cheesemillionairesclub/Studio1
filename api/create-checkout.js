import Stripe from 'stripe';

export default async function handler(req, res) {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
    if (req.method === 'OPTIONS') return res.status(200).end();
    if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' });

    let body = req.body;
    if (typeof body === 'string') {
        try { body = JSON.parse(body); } catch (e) { body = {}; }
    }
    if (!body) body = {};

    const user_id = body.user_id || '';
    const user_email = body.user_email || '';
    const skip_trial = body.skip_trial || false;

    const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);
    const origin = req.headers.origin || 'https://alphastudios.app';

    try {
        // Create or retrieve Stripe price for the Pro Plan ($1/month)
        // Use a fixed price ID if set in env, otherwise create inline
        let priceId = process.env.STRIPE_PRO_PRICE_ID;

        if (!priceId) {
            // Find or create the product and price
            const products = await stripe.products.list({ limit: 1, active: true });
            let product = products.data.find(p => p.name === 'AlphaStudios Pro Plan');
            if (!product) {
                product = await stripe.products.create({
                    name: 'AlphaStudios Pro Plan',
                    description: 'Up to 5 tracks/month: professional feedback, mastering, label recommendations, demo message generation, Trackstack submission.',
                });
            }
            const prices = await stripe.prices.list({ product: product.id, active: true, limit: 1 });
            if (prices.data.length) {
                priceId = prices.data[0].id;
            } else {
                const price = await stripe.prices.create({
                    product: product.id,
                    unit_amount: 100, // $1.00
                    currency: 'eur',
                    recurring: { interval: 'month' },
                });
                priceId = price.id;
            }
        }

        const subscriptionData = { metadata: { user_id } };
        if (!skip_trial) {
            subscriptionData.trial_period_days = 7;
        }

        const sessionParams = {
            payment_method_types: ['card'],
            line_items: [{ price: priceId, quantity: 1 }],
            mode: 'subscription',
            subscription_data: subscriptionData,
            metadata: { user_id },
            success_url: `${origin}/dashboard?session_id={CHECKOUT_SESSION_ID}`,
            cancel_url: `${origin}/`,
            allow_promotion_codes: true,
        };

        // Pre-fill email if available
        if (user_email) {
            sessionParams.customer_email = user_email;
        }

        const session = await stripe.checkout.sessions.create(sessionParams);
        return res.status(200).json({ url: session.url });
    } catch (error) {
        console.error('Stripe checkout error:', error.message, error.type, error.code);
        return res.status(500).json({
            error: 'Failed to create checkout session',
            details: error.message,
            type: error.type || '',
            code: error.code || '',
        });
    }
}
