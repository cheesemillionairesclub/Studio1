const CYANITE_API = 'https://api.cyanite.ai/graphql';

async function graphql(token, query, variables = {}) {
    const response = await fetch(CYANITE_API, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify({ query, variables }),
    });
    return response.json();
}

export default async function handler(req, res) {
    if (req.method !== 'POST') {
        return res.status(405).json({ error: 'Method not allowed' });
    }

    const token = process.env.CYANITE_ACCESS_TOKEN;
    if (!token) {
        return res.status(500).json({ error: 'Cyanite API token not configured' });
    }

    const { fileUploadId, title } = req.body || {};
    if (!fileUploadId) {
        return res.status(400).json({ error: 'fileUploadId is required' });
    }

    try {
        // Step 1: Create InDepthAnalysis from the uploaded file
        const createResult = await graphql(token, `
            mutation InDepthAnalysisCreateMutation($input: InDepthAnalysisCreateInput!) {
                inDepthAnalysisCreate(input: $input) {
                    ... on InDepthAnalysisCreateResultSuccess {
                        inDepthAnalysis {
                            id
                            title
                            status
                        }
                    }
                    ... on InDepthAnalysisCreateResultError {
                        message
                    }
                }
            }
        `, {
            input: {
                fileName: title || 'Uploaded Track',
                uploadId: fileUploadId,
            },
        });

        console.log('[Cyanite] inDepthAnalysisCreate:', JSON.stringify(createResult));

        if (createResult.errors) {
            return res.status(400).json({ error: createResult.errors[0]?.message || 'GraphQL error' });
        }

        const analysis = createResult.data?.inDepthAnalysisCreate?.inDepthAnalysis;
        if (!analysis) {
            const errMsg = createResult.data?.inDepthAnalysisCreate?.message || 'Failed to create analysis';
            return res.status(400).json({ error: errMsg });
        }

        // Step 2: Enqueue the analysis for processing
        const enqueueResult = await graphql(token, `
            mutation InDepthAnalysisEnqueueMutation($input: InDepthAnalysisEnqueueAnalysisInput!) {
                inDepthAnalysisEnqueueAnalysis(input: $input) {
                    ... on InDepthAnalysisEnqueueAnalysisResultSuccess {
                        success
                    }
                    ... on InDepthAnalysisEnqueueAnalysisResultError {
                        message
                    }
                }
            }
        `, {
            input: {
                inDepthAnalysisId: analysis.id,
            },
        });

        console.log('[Cyanite] enqueueAnalysis:', JSON.stringify(enqueueResult));

        return res.status(200).json({
            analysisId: analysis.id,
            title: analysis.title,
            status: analysis.status,
        });
    } catch (err) {
        console.error('[Cyanite] Analyze error:', err);
        return res.status(500).json({ error: 'Failed to create analysis' });
    }
}
