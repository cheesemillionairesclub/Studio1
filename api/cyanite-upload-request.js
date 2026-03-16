const CYANITE_API = 'https://api.cyanite.ai/graphql';

export default async function handler(req, res) {
    if (req.method !== 'POST') {
        return res.status(405).json({ error: 'Method not allowed' });
    }

    const token = process.env.CYANITE_ACCESS_TOKEN;
    if (!token) {
        return res.status(500).json({ error: 'Cyanite API token not configured' });
    }

    try {
        // Step 1: Request a file upload URL from Cyanite
        const response = await fetch(CYANITE_API, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`,
            },
            body: JSON.stringify({
                query: `mutation FileUploadRequestMutation {
                    fileUploadRequest {
                        ... on FileUploadRequest {
                            id
                            uploadUrl
                        }
                        ... on FileUploadRequestError {
                            message
                        }
                    }
                }`,
            }),
        });

        const data = await response.json();
        console.log('[Cyanite] fileUploadRequest response:', JSON.stringify(data));

        if (data.errors) {
            return res.status(400).json({ error: data.errors[0]?.message || 'GraphQL error' });
        }

        const result = data.data?.fileUploadRequest;
        if (!result?.uploadUrl) {
            return res.status(400).json({ error: result?.message || 'Failed to get upload URL' });
        }

        return res.status(200).json({
            uploadUrl: result.uploadUrl,
            fileUploadId: result.id,
        });
    } catch (err) {
        console.error('[Cyanite] Upload request error:', err);
        return res.status(500).json({ error: 'Failed to request upload URL' });
    }
}
