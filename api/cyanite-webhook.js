import crypto from 'crypto';

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

function verifySignature(rawBody, signature, secret) {
    if (!secret || !signature) return false;
    const computed = crypto
        .createHmac('sha256', secret)
        .update(rawBody)
        .digest('hex');
    return crypto.timingSafeEqual(
        Buffer.from(computed, 'hex'),
        Buffer.from(signature, 'hex')
    );
}

export default async function handler(req, res) {
    if (req.method !== 'POST') {
        return res.status(405).json({ error: 'Method not allowed' });
    }

    const secret = process.env.CYANITE_WEBHOOK_SECRET;
    const rawBody = await getRawBody(req);
    const signature = req.headers['x-cyanite-signature'] || req.headers['x-webhook-signature'] || '';

    // Verify signature if secret is configured
    if (secret && signature) {
        const valid = verifySignature(rawBody, signature, secret);
        if (!valid) {
            console.error('[Cyanite Webhook] Signature verification failed');
            return res.status(401).json({ error: 'Invalid signature' });
        }
    }

    let payload;
    try {
        payload = JSON.parse(rawBody.toString('utf-8'));
    } catch (err) {
        return res.status(400).json({ error: 'Invalid JSON' });
    }

    console.log('[Cyanite Webhook] Received:', JSON.stringify(payload).slice(0, 500));

    // TODO: When Cyanite API key is configured:
    // 1. Extract analysis data (BPM, key, energy, danceability, vocals, etc.)
    // 2. Store in Supabase linked to the track/order
    // 3. Optionally notify the frontend via polling or realtime

    res.status(200).json({ received: true });
}
