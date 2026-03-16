// Admin API: Upload mastered audio file to Supabase Storage
export const config = {
    api: { bodyParser: false },
};

async function getRawBody(req, limit = 10 * 1024 * 1024) {
    const chunks = [];
    let size = 0;
    for await (const chunk of req) {
        size += chunk.length;
        if (size > limit) throw new Error('File too large');
        chunks.push(chunk);
    }
    return Buffer.concat(chunks);
}

export default async function handler(req, res) {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization, X-Order-Id, X-File-Name');
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

    const orderId = req.headers['x-order-id'];
    const fileName = req.headers['x-file-name'] || 'mastered.wav';
    const contentType = req.headers['content-type'] || 'audio/wav';
    if (!orderId) return res.status(400).json({ error: 'Missing order ID' });

    try {
        const rawBody = await getRawBody(req, 200 * 1024 * 1024); // 200MB limit for audio
        const storagePath = `${orderId}/${fileName}`;

        // Upload to Supabase Storage (mastered bucket)
        const uploadRes = await fetch(`${SUPABASE_URL}/storage/v1/object/mastered/${storagePath}`, {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${SUPABASE_SERVICE_KEY}`,
                'apikey': SUPABASE_SERVICE_KEY,
                'Content-Type': contentType,
                'x-upsert': 'true',
            },
            body: rawBody,
        });

        if (!uploadRes.ok) {
            const errText = await uploadRes.text();
            return res.status(500).json({ error: 'Upload failed', details: errText });
        }

        // Get public URL
        const fileUrl = `${SUPABASE_URL}/storage/v1/object/public/mastered/${storagePath}`;

        // Update order with mastered file URL and mark as completed
        await fetch(`${SUPABASE_URL}/rest/v1/orders?id=eq.${orderId}`, {
            method: 'PATCH',
            headers: {
                'Content-Type': 'application/json',
                'apikey': SUPABASE_SERVICE_KEY,
                'Authorization': `Bearer ${SUPABASE_SERVICE_KEY}`,
            },
            body: JSON.stringify({
                receipt_url: fileUrl,
                order_status: 'completed',
                updated_at: new Date().toISOString(),
            }),
        });

        return res.status(200).json({ success: true, receipt_url: fileUrl });
    } catch (error) {
        console.error('Upload error:', error.message);
        return res.status(500).json({ error: 'Upload failed', details: error.message });
    }
}
