import Stripe from 'stripe';

export const config = {
    api: { bodyParser: false },
};

async function getRawBody(req) {
    const chunks = [];
    for await (const chunk of req) {
        chunks.push(typeof chunk === 'string' ? Buffer.from(chunk) : chunk);
    }
    return Buffer.concat(chunks);
}

const SUPABASE_URL = 'https://mbruoxxqpnxcybwureku.supabase.co';

async function updateProfile(serviceKey, filters, updates) {
    const params = Object.entries(filters).map(([k, v]) => `${k}=eq.${v}`).join('&');
    const res = await fetch(`${SUPABASE_URL}/rest/v1/profiles?${params}`, {
        method: 'PATCH',
        headers: {
            'Content-Type': 'application/json',
            'apikey': serviceKey,
            'Authorization': `Bearer ${serviceKey}`,
            'Prefer': 'return=representation',
        },
        body: JSON.stringify(updates),
    });
    return res;
}

async function upsertProfile(serviceKey, profileData) {
    const res = await fetch(`${SUPABASE_URL}/rest/v1/profiles`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'apikey': serviceKey,
            'Authorization': `Bearer ${serviceKey}`,
            'Prefer': 'resolution=merge-duplicates,return=representation',
        },
        body: JSON.stringify(profileData),
    });
    return res;
}

async function findProfileByStripeCustomer(serviceKey, customerId) {
    const res = await fetch(`${SUPABASE_URL}/rest/v1/profiles?stripe_customer_id=eq.${customerId}&select=id`, {
        headers: { 'apikey': serviceKey, 'Authorization': `Bearer ${serviceKey}` },
    });
    if (!res.ok) return null;
    const data = await res.json();
    return data[0] || null;
}

// Extract plan_type from subscription metadata
function getPlanTypeFromSub(sub) {
    return sub.metadata?.plan_type || null;
}

export default async function handler(req, res) {
    if (req.method !== 'POST') {
        return res.status(405).json({ error: 'Method not allowed' });
    }

    const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);
    const sig = req.headers['stripe-signature'];
    const endpointSecret = process.env.STRIPE_WEBHOOK_SECRET;
    const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

    let event;
    try {
        const rawBody = await getRawBody(req);
        event = stripe.webhooks.constructEvent(rawBody, sig, endpointSecret);
    } catch (err) {
        console.error('Webhook signature verification failed:', err.message);
        return res.status(400).json({ error: 'Webhook signature verification failed' });
    }

    console.log(`[Webhook] Event: ${event.type}`);

    // ===== checkout.session.completed =====
    if (event.type === 'checkout.session.completed') {
        const session = event.data.object;
        const userId = session.metadata?.user_id;
        const customerId = session.customer;
        const subscriptionId = session.subscription;
        const planType = session.metadata?.plan_type || 'pro';

        if (userId && customerId) {
            const profileData = {
                id: userId,
                stripe_customer_id: customerId,
                stripe_subscription_id: subscriptionId || null,
                plan_type: planType,
            };

            const customerEmail = session.customer_details?.email || session.customer_email;
            if (customerEmail) profileData.email = customerEmail;

            if (subscriptionId) {
                try {
                    const sub = await stripe.subscriptions.retrieve(subscriptionId);
                    profileData.subscription_status = sub.status;
                    profileData.trial_end = sub.trial_end ? new Date(sub.trial_end * 1000).toISOString() : null;
                    profileData.current_period_end = sub.current_period_end ? new Date(sub.current_period_end * 1000).toISOString() : null;
                    // Also get plan_type from subscription metadata if available
                    const subPlan = getPlanTypeFromSub(sub);
                    if (subPlan) profileData.plan_type = subPlan;
                } catch (e) {
                    console.error('[Webhook] Failed to retrieve subscription:', e.message);
                }
            }

            const upsertRes = await upsertProfile(serviceKey, profileData);
            if (!upsertRes.ok) {
                console.error('[Webhook] Profile upsert failed:', await upsertRes.text());
                await updateProfile(serviceKey, { id: userId }, profileData);
            }
            console.log(`[Webhook] Profile ${userId} linked to customer ${customerId}, plan: ${planType}`);
        }
    }

    // ===== customer.subscription.created / updated =====
    if (event.type === 'customer.subscription.created' || event.type === 'customer.subscription.updated') {
        const sub = event.data.object;
        const customerId = sub.customer;

        const profile = await findProfileByStripeCustomer(serviceKey, customerId);
        if (profile) {
            const updates = {
                subscription_status: sub.status,
                stripe_subscription_id: sub.id,
                trial_end: sub.trial_end ? new Date(sub.trial_end * 1000).toISOString() : null,
                current_period_end: sub.current_period_end ? new Date(sub.current_period_end * 1000).toISOString() : null,
            };

            // Update plan_type from subscription metadata
            const subPlan = getPlanTypeFromSub(sub);
            if (subPlan) updates.plan_type = subPlan;

            // Reset track counter when trial ends and subscription becomes active
            if (event.type === 'customer.subscription.updated' && sub.status === 'active') {
                const prevAttrs = event.data.previous_attributes;
                if (prevAttrs?.status === 'trialing') {
                    updates.tracks_used_this_month = 0;
                    console.log(`[Webhook] Trial→Active upgrade for profile ${profile.id}, resetting track counter`);
                }
            }

            await updateProfile(serviceKey, { id: profile.id }, updates);
            console.log(`[Webhook] Subscription ${sub.status} for profile ${profile.id}`);
        }
    }

    // ===== customer.subscription.deleted =====
    if (event.type === 'customer.subscription.deleted') {
        const sub = event.data.object;
        const customerId = sub.customer;

        const profile = await findProfileByStripeCustomer(serviceKey, customerId);
        if (profile) {
            await updateProfile(serviceKey, { id: profile.id }, {
                subscription_status: 'canceled',
                stripe_subscription_id: null,
            });
            console.log(`[Webhook] Subscription canceled for profile ${profile.id}`);
        }
    }

    // ===== invoice.paid =====
    if (event.type === 'invoice.paid') {
        const invoice = event.data.object;
        const customerId = invoice.customer;

        if (invoice.billing_reason === 'subscription_cycle' || invoice.billing_reason === 'subscription_update') {
            const profile = await findProfileByStripeCustomer(serviceKey, customerId);
            if (profile) {
                await updateProfile(serviceKey, { id: profile.id }, {
                    tracks_used_this_month: 0,
                    subscription_status: 'active',
                });
                console.log(`[Webhook] Track counter reset for profile ${profile.id} (reason: ${invoice.billing_reason})`);
            }
        }
    }

    // ===== invoice.payment_failed =====
    if (event.type === 'invoice.payment_failed') {
        const invoice = event.data.object;
        const customerId = invoice.customer;

        const profile = await findProfileByStripeCustomer(serviceKey, customerId);
        if (profile) {
            await updateProfile(serviceKey, { id: profile.id }, {
                subscription_status: 'unpaid',
            });
            console.log(`[Webhook] Payment failed for profile ${profile.id}`);
        }
    }

    res.status(200).json({ received: true });
}
