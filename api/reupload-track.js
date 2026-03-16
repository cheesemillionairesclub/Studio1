// API endpoint: Re-upload track after feedback OR approve mastering
// ?action=approve → approve mastering (default: reupload)
export default async function handler(req, res) {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
    if (req.method === 'OPTIONS') return res.status(200).end();
    if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' });

    const SUPABASE_URL = 'https://mbruoxxqpnxcybwureku.supabase.co';
    const SUPABASE_SERVICE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY;

    // Verify user token
    const authHeader = req.headers.authorization;
    if (!authHeader) return res.status(401).json({ error: 'Not authenticated' });
    const token = authHeader.replace('Bearer ', '');

    const userRes = await fetch(`${SUPABASE_URL}/auth/v1/user`, {
        headers: { 'Authorization': `Bearer ${token}`, 'apikey': SUPABASE_SERVICE_KEY },
    });
    if (!userRes.ok) return res.status(401).json({ error: 'Invalid token' });
    const user = await userRes.json();

    let body = req.body;
    if (typeof body === 'string') {
        try { body = JSON.parse(body); } catch (e) { body = {}; }
    }

    const { order_id, track_url, track_artwork } = body || {};
    if (!order_id) return res.status(400).json({ error: 'Missing order_id' });

    const action = req.query.action || 'reupload';

    // Verify ownership
    const orderRes = await fetch(
        `${SUPABASE_URL}/rest/v1/orders?id=eq.${order_id}&user_id=eq.${user.id}&select=id,reupload_count,user_id,track_versions`,
        { headers: { 'apikey': SUPABASE_SERVICE_KEY, 'Authorization': `Bearer ${SUPABASE_SERVICE_KEY}` } }
    );
    const orders = await orderRes.json();
    if (!orders.length) return res.status(404).json({ error: 'Order not found' });

    let updates;

    if (action === 'approve') {
        // Approve mastering
        updates = { mastering_approved: true, updated_at: new Date().toISOString() };
    } else {
        // Re-upload track
        const currentCount = orders[0].reupload_count || 0;
        if (currentCount >= 3) {
            return res.status(400).json({ error: 'Maximum re-uploads reached (3/3)' });
        }
        const existingVersions = Array.isArray(orders[0].track_versions) ? orders[0].track_versions : [];
        const newVersion = { url: track_url || '', artwork: track_artwork || '', label: `Upload ${existingVersions.length + 1}`, date: new Date().toISOString() };
        updates = {
            track_url: track_url || '',
            track_artwork: track_artwork || '',
            track_versions: [...existingVersions, newVersion],
            feedback: null,
            receipt_url: null,
            reupload_count: currentCount + 1,
            mastering_approved: false,
            order_status: 'in_progress',
            updated_at: new Date().toISOString(),
        };
    }

    const updateRes = await fetch(`${SUPABASE_URL}/rest/v1/orders?id=eq.${order_id}`, {
        method: 'PATCH',
        headers: {
            'Content-Type': 'application/json',
            'apikey': SUPABASE_SERVICE_KEY,
            'Authorization': `Bearer ${SUPABASE_SERVICE_KEY}`,
            'Prefer': 'return=representation',
        },
        body: JSON.stringify(updates),
    });

    if (!updateRes.ok) {
        const err = await updateRes.text();
        return res.status(500).json({ error: 'Update failed', details: err });
    }

    const updated = await updateRes.json();
    return res.status(200).json({ success: true, order: updated[0] });
}
