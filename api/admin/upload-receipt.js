// Admin API: Generate signed upload URL for mastered audio, then update order
export default async function handler(req, res) {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
    if (req.method === 'OPTIONS') return res.status(200).end();
    if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' });

    const SUPABASE_URL = 'https://mbruoxxqpnxcybwureku.supabase.co';
    const SUPABASE_SERVICE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY;

    // Verify admin
    const authHeader = req.headers.authorization;
    if (!authHeader) return res.status(401).json({ error: 'Not authenticated' });
    const token = authHeader.replace('Bearer ', '');

    const userRes = await fetch(`${SUPABASE_URL}/auth/v1/user`, {
        headers: { 'Authorization': `Bearer ${token}`, 'apikey': SUPABASE_SERVICE_KEY },
    });
    if (!userRes.ok) return res.status(401).json({ error: 'Invalid token' });
    const user = await userRes.json();

    const profileRes = await fetch(`${SUPABASE_URL}/rest/v1/profiles?id=eq.${user.id}&select=is_admin`, {
        headers: { 'apikey': SUPABASE_SERVICE_KEY, 'Authorization': `Bearer ${SUPABASE_SERVICE_KEY}` },
    });
    const profiles = await profileRes.json();
    if (!profiles[0]?.is_admin) return res.status(403).json({ error: 'Not admin' });

    let body = req.body;
    if (typeof body === 'string') {
        try { body = JSON.parse(body); } catch (e) { body = {}; }
    }

    const { action, order_id, file_name, receipt_url } = body || {};

    if (!order_id) return res.status(400).json({ error: 'Missing order_id' });

    // Step 1: Generate signed upload URL
    if (action === 'get-upload-url') {
        const safeName = (file_name || 'mastered.wav').replace(/[^a-zA-Z0-9._-]/g, '_');
        const storagePath = `${order_id}/${Date.now()}_${safeName}`;

        try {
            const signRes = await fetch(
                `${SUPABASE_URL}/storage/v1/object/upload/sign/mastered/${storagePath}`,
                {
                    method: 'POST',
                    headers: {
                        'Authorization': `Bearer ${SUPABASE_SERVICE_KEY}`,
                        'apikey': SUPABASE_SERVICE_KEY,
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({ expiresIn: 600 }),
                }
            );

            if (!signRes.ok) {
                const err = await signRes.text();
                console.error('Supabase sign error:', err);
                return res.status(500).json({ error: 'Failed to create upload URL', details: err });
            }

            const signData = await signRes.json();
            const uploadUrl = `${SUPABASE_URL}/storage/v1${signData.url}`;
            const publicUrl = `${SUPABASE_URL}/storage/v1/object/public/mastered/${storagePath}`;

            return res.status(200).json({ uploadUrl, publicUrl, path: storagePath });
        } catch (error) {
            console.error('Upload URL error:', error.message);
            return res.status(500).json({ error: 'Failed to create upload URL', details: error.message });
        }
    }

    // Step 2: Confirm upload - update order with receipt URL
    if (action === 'confirm-upload') {
        if (!receipt_url) return res.status(400).json({ error: 'Missing receipt_url' });

        try {
            const updateRes = await fetch(`${SUPABASE_URL}/rest/v1/orders?id=eq.${order_id}`, {
                method: 'PATCH',
                headers: {
                    'Content-Type': 'application/json',
                    'apikey': SUPABASE_SERVICE_KEY,
                    'Authorization': `Bearer ${SUPABASE_SERVICE_KEY}`,
                },
                body: JSON.stringify({
                    receipt_url: receipt_url,
                    order_status: 'completed',
                    updated_at: new Date().toISOString(),
                }),
            });

            if (!updateRes.ok) {
                const errText = await updateRes.text();
                return res.status(500).json({ error: 'Failed to update order', details: errText });
            }

            return res.status(200).json({ success: true, receipt_url });
        } catch (error) {
            console.error('Confirm upload error:', error.message);
            return res.status(500).json({ error: 'Failed to update order', details: error.message });
        }
    }

    return res.status(400).json({ error: 'Invalid action. Use "get-upload-url" or "confirm-upload".' });
}
