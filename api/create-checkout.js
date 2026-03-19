import Stripe from 'stripe';

const PLAN_CONFIG = {
    access: { name: 'Studio Access', amount: 99, trackLimit: 1 },
    pro:    { name: 'Studio Pro',    amount: 399, trackLimit: 5 },
    elite:  { name: 'Studio Elite',  amount: 799, trackLimit: 10 },
};

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
    const plan = body.plan || 'pro'; // default to pro for backwards compat

    const config = PLAN_CONFIG[plan];
    if (!config) {
        return res.status(400).json({ error: 'Invalid plan. Must be: access, pro, or elite' });
    }

    const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);
    const origin = req.headers.origin || 'https://alphastudios.app';

    try {
        // Find or create the product and price for this plan
        const productName = `AlphaStudios ${config.name}`;
        const products = await stripe.products.list({ limit: 100, active: true });
        let product = products.data.find(p => p.name === productName);
        if (!product) {
            product = await stripe.products.create({
                name: productName,
                description: `${config.name}: ${config.trackLimit} track${config.trackLimit > 1 ? 's' : ''}/month — professional feedback, mastering, WhatsApp access.`,
                metadata: { plan_type: plan, track_limit: String(config.trackLimit) },
            });
        }

        // Find existing price or create one
        const prices = await stripe.prices.list({ product: product.id, active: true, limit: 10 });
        let priceId;
        const matchingPrice = prices.data.find(p =>
            p.unit_amount === config.amount &&
            p.currency === 'usd' &&
            p.recurring?.interval === 'month'
        );
        if (matchingPrice) {
            priceId = matchingPrice.id;
        } else {
            const price = await stripe.prices.create({
                product: product.id,
                unit_amount: config.amount,
                currency: 'usd',
                recurring: { interval: 'month' },
            });
            priceId = price.id;
        }

        const subscriptionData = { metadata: { user_id, plan_type: plan } };
        if (!skip_trial) {
            subscriptionData.trial_period_days = 3;
        }

        const sessionParams = {
            payment_method_types: ['card'],
            line_items: [{ price: priceId, quantity: 1 }],
            mode: 'subscription',
            subscription_data: subscriptionData,
            metadata: { user_id, plan_type: plan, upgrade_from_trial: skip_trial ? 'true' : 'false' },
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
