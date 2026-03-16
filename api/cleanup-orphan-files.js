// Cron job: delete orphan files from Supabase Storage (no matching order after 2 hours)
// Triggered hourly via Vercel cron

export default async function handler(req, res) {
    // Only allow GET (Vercel cron) or POST
    if (req.method !== 'GET' && req.method !== 'POST') {
        return res.status(405).json({ error: 'Method not allowed' });
    }

    // Verify cron secret to prevent unauthorized access
    const cronSecret = (process.env.CRON_SECRET || '').trim();
    if (cronSecret && req.headers.authorization !== `Bearer ${cronSecret}`) {
        return res.status(401).json({ error: 'Unauthorized' });
    }

    const SUPABASE_URL = 'https://mbruoxxqpnxcybwureku.supabase.co';
    const SUPABASE_SERVICE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY;

    if (!SUPABASE_SERVICE_KEY) {
        return res.status(500).json({ error: 'Missing Supabase service key' });
    }

    const headers = {
        'Authorization': `Bearer ${SUPABASE_SERVICE_KEY}`,
        'apikey': SUPABASE_SERVICE_KEY,
        'Content-Type': 'application/json',
    };

    const BUCKET = 'tracks';
    const MAX_AGE_MS = 2 * 60 * 60 * 1000; // 2 hours — files older than this without an order get deleted
    const now = Date.now();

    try {
        // 1. Get all track_url and track_artwork values from orders
        const ordersRes = await fetch(
            `${SUPABASE_URL}/rest/v1/orders?select=track_url,track_artwork`,
            { headers }
        );
        if (!ordersRes.ok) {
            const err = await ordersRes.text();
            return res.status(500).json({ error: 'Failed to fetch orders', details: err });
        }
        const orders = await ordersRes.json();

        // Build a Set of all URLs referenced by orders
        const usedUrls = new Set();
        for (const order of orders) {
            if (order.track_url) usedUrls.add(order.track_url);
            if (order.track_artwork) usedUrls.add(order.track_artwork);
        }

        // 2. List files in both folders
        const folders = ['uploads', 'artworks'];
        let deletedCount = 0;
        let skippedCount = 0;

        for (const folder of folders) {
            const listRes = await fetch(
                `${SUPABASE_URL}/storage/v1/object/list/${BUCKET}`,
                {
                    method: 'POST',
                    headers,
                    body: JSON.stringify({
                        prefix: `${folder}/`,
                        limit: 1000,
                        sortBy: { column: 'created_at', order: 'asc' },
                    }),
                }
            );

            if (!listRes.ok) {
                console.error(`Failed to list ${folder}:`, await listRes.text());
                continue;
            }

            const files = await listRes.json();

            for (const file of files) {
                if (!file.name || file.name === '.emptyFolderPlaceholder') continue;

                const filePath = `${folder}/${file.name}`;
                const publicUrl = `${SUPABASE_URL}/storage/v1/object/public/${BUCKET}/${filePath}`;

                // Check if this file is referenced by any order
                if (usedUrls.has(publicUrl)) {
                    skippedCount++;
                    continue;
                }

                // Check file age — extract timestamp from filename (format: {timestamp}_{name})
                const timestampMatch = file.name.match(/^(\d+)_/);
                const fileTimestamp = timestampMatch ? parseInt(timestampMatch[1], 10) : 0;
                const fileAge = now - fileTimestamp;

                // Also check created_at from Supabase metadata
                const createdAt = file.created_at ? new Date(file.created_at).getTime() : 0;
                const metaAge = createdAt ? now - createdAt : Infinity;

                // Use the most reliable age — file is old enough if either indicates > MAX_AGE
                const isOldEnough = (fileTimestamp && fileAge > MAX_AGE_MS) ||
                                    (createdAt && metaAge > MAX_AGE_MS);

                if (!isOldEnough) {
                    skippedCount++;
                    continue;
                }

                // Delete orphan file
                const delRes = await fetch(
                    `${SUPABASE_URL}/storage/v1/object/${BUCKET}`,
                    {
                        method: 'DELETE',
                        headers,
                        body: JSON.stringify({ prefixes: [filePath] }),
                    }
                );

                if (delRes.ok) {
                    deletedCount++;
                    console.log(`[Cleanup] Deleted orphan: ${filePath}`);
                } else {
                    console.error(`[Cleanup] Failed to delete ${filePath}:`, await delRes.text());
                }
            }
        }

        return res.status(200).json({
            success: true,
            deleted: deletedCount,
            skipped: skippedCount,
            ordersChecked: orders.length,
        });
    } catch (error) {
        console.error('[Cleanup] Error:', error.message);
        return res.status(500).json({ error: 'Cleanup failed', details: error.message });
    }
}
