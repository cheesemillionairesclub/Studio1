// Generate a signed upload URL for Supabase Storage (client uploads directly)
// Supports both audio and artwork uploads via ?type=artwork query param
export default async function handler(req, res) {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
    if (req.method === 'OPTIONS') return res.status(200).end();
    if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' });

    const SUPABASE_URL = 'https://mbruoxxqpnxcybwureku.supabase.co';
    const SUPABASE_SERVICE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY;

    if (!SUPABASE_SERVICE_KEY) {
        return res.status(500).json({ error: 'Missing Supabase service key' });
    }

    let body = req.body;
    if (typeof body === 'string') {
        try { body = JSON.parse(body); } catch (e) { body = {}; }
    }

    const isArtwork = req.query.type === 'artwork';
    const defaultName = isArtwork ? `artwork_${Date.now()}.jpg` : `track_${Date.now()}.wav`;
    const folder = isArtwork ? 'artworks' : 'uploads';

    const filename = body.filename || defaultName;
    const safeName = filename.replace(/[^a-zA-Z0-9._-]/g, '_');
    const storagePath = `${folder}/${Date.now()}_${safeName}`;

    try {
        const signRes = await fetch(
            `${SUPABASE_URL}/storage/v1/object/upload/sign/tracks/${storagePath}`,
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
        const publicUrl = `${SUPABASE_URL}/storage/v1/object/public/tracks/${storagePath}`;

        return res.status(200).json({ uploadUrl, publicUrl, path: storagePath });
    } catch (error) {
        console.error('Upload URL error:', error.message);
        return res.status(500).json({ error: 'Failed to create upload URL', details: error.message });
    }
}
