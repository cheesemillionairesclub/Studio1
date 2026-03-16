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

export default async function handler(req, res) {
    if (req.method !== 'POST') {
        return res.status(405).json({ error: 'Method not allowed' });
    }

    try {
        const rawBody = await getRawBody(req);
        const bodyStr = rawBody.toString('utf-8');

        console.log('[Cyanite Webhook] Received request');
        console.log('[Cyanite Webhook] Headers:', JSON.stringify(req.headers));
        console.log('[Cyanite Webhook] Body:', bodyStr.slice(0, 1000));

        // Verify signature if secret is configured
        const secret = process.env.CYANITE_WEBHOOK_SECRET;
        if (secret) {
            const signature = req.headers['x-cyanite-signature']
                || req.headers['x-webhook-signature']
                || req.headers['x-signature']
                || '';

            if (signature) {
                try {
                    const computed = crypto
                        .createHmac('sha256', secret)
                        .update(rawBody)
                        .digest('hex');

                    const sigBuffer = Buffer.from(signature, 'hex');
                    const computedBuffer = Buffer.from(computed, 'hex');

                    if (sigBuffer.length === computedBuffer.length) {
                        const valid = crypto.timingSafeEqual(computedBuffer, sigBuffer);
                        if (!valid) {
                            console.warn('[Cyanite Webhook] Signature mismatch');
                        }
                    } else {
                        console.warn('[Cyanite Webhook] Signature length mismatch');
                    }
                } catch (sigErr) {
                    console.warn('[Cyanite Webhook] Signature check error:', sigErr.message);
                }
            }
        }

        // Parse body if present
        let payload = {};
        if (bodyStr.trim()) {
            try {
                payload = JSON.parse(bodyStr);
            } catch (e) {
                console.warn('[Cyanite Webhook] Body is not JSON:', bodyStr.slice(0, 200));
            }
        }

        console.log('[Cyanite Webhook] Payload:', JSON.stringify(payload).slice(0, 500));

        // TODO: Process Cyanite analysis data
        // 1. Extract BPM, key, energy, danceability, vocals, etc.
        // 2. Store in Supabase linked to the track/order
        // 3. Notify frontend via polling or realtime

        return res.status(200).json({ received: true });
    } catch (err) {
        console.error('[Cyanite Webhook] Error:', err.message);
        return res.status(200).json({ received: true, error: err.message });
    }
}
