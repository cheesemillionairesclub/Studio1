// Upload audio file to Supabase Storage and return public URL
export const config = { api: { bodyParser: false } };

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

    try {
        // Read raw body
        const chunks = [];
        for await (const chunk of req) { chunks.push(chunk); }
        const body = Buffer.concat(chunks);

        // Get filename from query or header
        const filename = req.query.filename || req.headers['x-filename'] || `track_${Date.now()}.wav`;
        const contentType = req.headers['content-type'] || 'audio/wav';

        // Sanitize filename and create unique path
        const safeName = filename.replace(/[^a-zA-Z0-9._-]/g, '_');
        const storagePath = `uploads/${Date.now()}_${safeName}`;

        // Upload to Supabase Storage (bucket: "tracks")
        const uploadRes = await fetch(
            `${SUPABASE_URL}/storage/v1/object/tracks/${storagePath}`,
            {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${SUPABASE_SERVICE_KEY}`,
                    'apikey': SUPABASE_SERVICE_KEY,
                    'Content-Type': contentType,
                    'x-upsert': 'true',
                },
                body: body,
            }
        );

        if (!uploadRes.ok) {
            const err = await uploadRes.text();
            console.error('Supabase upload error:', err);
            return res.status(500).json({ error: 'Upload failed', details: err });
        }

        // Return public URL
        const publicUrl = `${SUPABASE_URL}/storage/v1/object/public/tracks/${storagePath}`;
        return res.status(200).json({ url: publicUrl, path: storagePath });
    } catch (error) {
        console.error('Upload error:', error.message);
        return res.status(500).json({ error: 'Upload failed', details: error.message });
    }
}
