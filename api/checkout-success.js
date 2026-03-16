import Stripe from 'stripe';

export default async function handler(req, res) {
    const { session_id } = req.query;

    if (!session_id) {
        return res.status(400).json({ error: 'Missing session_id' });
    }

    const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

    try {
        const session = await stripe.checkout.sessions.retrieve(session_id);

        // For subscription sessions, get subscription details
        let subscription_status = null;
        let trial_end = null;
        if (session.subscription) {
            try {
                const sub = await stripe.subscriptions.retrieve(session.subscription);
                subscription_status = sub.status;
                trial_end = sub.trial_end ? new Date(sub.trial_end * 1000).toISOString() : null;
            } catch (e) {
                console.error('Failed to retrieve subscription:', e.message);
            }
        }

        res.status(200).json({
            status: session.payment_status || subscription_status,
            customer_email: session.customer_details?.email || null,
            metadata: session.metadata || {},
            amount_total: session.amount_total,
            currency: session.currency,
            mode: session.mode,
            subscription_status,
            trial_end,
            upgrade_from_trial: session.metadata?.upgrade_from_trial === 'true',
        });
    } catch (error) {
        console.error('Checkout success error:', error.message);
        res.status(500).json({ error: 'Failed to retrieve session' });
    }
}
