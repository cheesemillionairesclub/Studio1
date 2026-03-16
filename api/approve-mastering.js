// API endpoint: User approves their track for mastering after feedback
export default async function handler(req, res) {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
    if (req.method === 'OPTIONS') return res.status(200).end();
    if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' });

    const SUPABASE_URL = 'https://mbruoxxqpnxcybwureku.supabase.co';
    const SUPABASE_SERVICE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY;

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

    const { order_id } = body || {};
    if (!order_id) return res.status(400).json({ error: 'Missing order_id' });

    // Verify ownership
    const orderRes = await fetch(
        `${SUPABASE_URL}/rest/v1/orders?id=eq.${order_id}&user_id=eq.${user.id}&select=id`,
        { headers: { 'apikey': SUPABASE_SERVICE_KEY, 'Authorization': `Bearer ${SUPABASE_SERVICE_KEY}` } }
    );
    const orders = await orderRes.json();
    if (!orders.length) return res.status(404).json({ error: 'Order not found' });

    const updateRes = await fetch(`${SUPABASE_URL}/rest/v1/orders?id=eq.${order_id}`, {
        method: 'PATCH',
        headers: {
            'Content-Type': 'application/json',
            'apikey': SUPABASE_SERVICE_KEY,
            'Authorization': `Bearer ${SUPABASE_SERVICE_KEY}`,
            'Prefer': 'return=representation',
        },
        body: JSON.stringify({ mastering_approved: true, updated_at: new Date().toISOString() }),
    });

    if (!updateRes.ok) {
        const err = await updateRes.text();
        return res.status(500).json({ error: 'Update failed', details: err });
    }

    const updated = await updateRes.json();
    return res.status(200).json({ success: true, order: updated[0] });
}
