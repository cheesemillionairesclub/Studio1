import Stripe from 'stripe';

export default async function handler(req, res) {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
    if (req.method === 'OPTIONS') return res.status(200).end();
    if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' });

    const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

    try {
        // Check if coupon already exists
        try {
            const existing = await stripe.coupons.retrieve('ALPHA1_10PCT');
            return res.status(200).json({
                message: 'Promo code ALPHA1 already exists',
                coupon: existing.id,
            });
        } catch (e) {
            // Coupon doesn't exist, create it
        }

        // Create a 10% off coupon
        const coupon = await stripe.coupons.create({
            id: 'ALPHA1_10PCT',
            percent_off: 10,
            duration: 'forever',
            name: 'ALPHA1 - 10% OFF',
        });

        // Create the promotion code that customers can enter at checkout
        const promoCode = await stripe.promotionCodes.create({
            coupon: coupon.id,
            code: 'ALPHA1',
            active: true,
        });

        return res.status(200).json({
            message: 'Promo code ALPHA1 created successfully',
            coupon: coupon.id,
            promo_code: promoCode.code,
            promo_code_id: promoCode.id,
        });
    } catch (error) {
        console.error('Promo code setup error:', error.message);
        return res.status(500).json({
            error: 'Failed to create promo code',
            details: error.message,
        });
    }
}
