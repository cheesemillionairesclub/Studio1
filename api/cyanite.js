const CYANITE_API = 'https://api.cyanite.ai/graphql';
const SUPABASE_URL = 'https://mbruoxxqpnxcybwureku.supabase.co';

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

// POST ?action=upload-request — Get pre-signed upload URL from Cyanite
async function handleUploadRequest(req, res, token) {
    const data = await graphql(token, `mutation FileUploadRequestMutation {
        fileUploadRequest {
            ... on FileUploadRequest { id uploadUrl }
            ... on FileUploadRequestError { message }
        }
    }`);

    if (data.errors) {
        return res.status(400).json({ error: data.errors[0]?.message || 'GraphQL error' });
    }

    const result = data.data?.fileUploadRequest;
    if (!result?.uploadUrl) {
        return res.status(400).json({ error: result?.message || 'Failed to get upload URL' });
    }

    return res.status(200).json({ uploadUrl: result.uploadUrl, fileUploadId: result.id });
}

// POST ?action=analyze — Create analysis + enqueue
async function handleAnalyze(req, res, token) {
    const { fileUploadId, title } = req.body || {};
    if (!fileUploadId) {
        return res.status(400).json({ error: 'fileUploadId is required' });
    }

    // Create InDepthAnalysis
    const createResult = await graphql(token, `
        mutation InDepthAnalysisCreateMutation($input: InDepthAnalysisCreateInput!) {
            inDepthAnalysisCreate(input: $input) {
                ... on InDepthAnalysisCreateResultSuccess {
                    inDepthAnalysis { id title status }
                }
                ... on InDepthAnalysisCreateResultError { message }
            }
        }
    `, { input: { fileName: title || 'Uploaded Track', uploadId: fileUploadId } });

    if (createResult.errors) {
        return res.status(400).json({ error: createResult.errors[0]?.message || 'GraphQL error' });
    }

    const analysis = createResult.data?.inDepthAnalysisCreate?.inDepthAnalysis;
    if (!analysis) {
        return res.status(400).json({ error: createResult.data?.inDepthAnalysisCreate?.message || 'Failed to create analysis' });
    }

    // Enqueue analysis
    await graphql(token, `
        mutation InDepthAnalysisEnqueueMutation($input: InDepthAnalysisEnqueueAnalysisInput!) {
            inDepthAnalysisEnqueueAnalysis(input: $input) {
                ... on InDepthAnalysisEnqueueAnalysisResultSuccess { success }
                ... on InDepthAnalysisEnqueueAnalysisResultError { message }
            }
        }
    `, { input: { inDepthAnalysisId: analysis.id } });

    return res.status(200).json({ analysisId: analysis.id, title: analysis.title, status: analysis.status });
}

// GET ?action=result&id=... — Fetch analysis result from Cyanite
async function handleResult(req, res, token) {
    const analysisId = req.query.id;
    if (!analysisId) {
        return res.status(400).json({ error: 'id query parameter is required' });
    }

    const data = await graphql(token, `query InDepthAnalysisQuery($id: ID!) {
        inDepthAnalysis(recordId: $id) {
            ... on InDepthAnalysis {
                id title status
                fastMusicalAnalysis {
                    ... on FastMusicalAnalysisResult { bpm key { value } }
                }
                fullScaleMusicalAnalysis {
                    ... on FullScaleMusicalAnalysisResult {
                        bpm key { value } energyLevel energyDynamics
                        emotionalProfile emotionalDynamics voicePresenceProfile
                        predominantVoiceGender mood { tags } genre { tags } instrument { tags }
                    }
                }
            }
            ... on InDepthAnalysisError { message }
        }
    }`, { id: analysisId });

    if (data.errors) {
        return res.status(400).json({ error: data.errors[0]?.message || 'GraphQL error' });
    }

    const analysis = data.data?.inDepthAnalysis;
    if (!analysis || analysis.message) {
        return res.status(404).json({ error: analysis?.message || 'Analysis not found' });
    }

    const fast = analysis.fastMusicalAnalysis;
    const full = analysis.fullScaleMusicalAnalysis;
    const result = { id: analysis.id, status: analysis.status, title: analysis.title };

    if (full && !full.message) {
        Object.assign(result, {
            bpm: full.bpm, key: full.key?.value, energyLevel: full.energyLevel,
            energyDynamics: full.energyDynamics, emotionalProfile: full.emotionalProfile,
            voicePresenceProfile: full.voicePresenceProfile,
            predominantVoiceGender: full.predominantVoiceGender,
            mood: full.mood?.tags, genre: full.genre?.tags, instruments: full.instrument?.tags,
        });
    } else if (fast && !fast.message) {
        result.bpm = fast.bpm;
        result.key = fast.key?.value;
    }

    return res.status(200).json(result);
}

// GET ?action=track-analysis&cyanite_id=... — Poll our Supabase DB
async function handleTrackAnalysis(req, res) {
    const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
    if (!supabaseKey) {
        return res.status(500).json({ error: 'Database not configured' });
    }

    const cyaniteId = req.query.cyanite_id;
    if (!cyaniteId) {
        return res.status(400).json({ error: 'cyanite_id query parameter is required' });
    }

    const response = await fetch(
        `${SUPABASE_URL}/rest/v1/track_analyses?cyanite_id=eq.${encodeURIComponent(cyaniteId)}&limit=1`,
        {
            headers: {
                'apikey': supabaseKey,
                'Authorization': `Bearer ${supabaseKey}`,
            },
        }
    );

    if (!response.ok) {
        return res.status(500).json({ error: 'Database query failed' });
    }

    const data = await response.json();
    if (!data.length) {
        return res.status(200).json({ status: 'processing' });
    }

    const a = data[0];
    return res.status(200).json({
        status: a.status || 'finished',
        bpm: a.bpm, key: a.key, energyLevel: a.energy_level,
        energyDynamics: a.energy_dynamics, emotionalProfile: a.emotional_profile,
        voicePresenceProfile: a.voice_presence, predominantVoiceGender: a.predominant_voice_gender,
        mood: a.mood, genre: a.genre, instruments: a.instruments,
    });
}

export default async function handler(req, res) {
    const action = req.query.action;

    try {
        // track-analysis doesn't need Cyanite token
        if (action === 'track-analysis') {
            return handleTrackAnalysis(req, res);
        }

        const token = process.env.CYANITE_ACCESS_TOKEN;
        if (!token) {
            return res.status(500).json({ error: 'Cyanite API token not configured' });
        }

        switch (action) {
            case 'upload-request':
                return handleUploadRequest(req, res, token);
            case 'analyze':
                return handleAnalyze(req, res, token);
            case 'result':
                return handleResult(req, res, token);
            default:
                return res.status(400).json({ error: 'Invalid action. Use: upload-request, analyze, result, track-analysis' });
        }
    } catch (err) {
        console.error('[Cyanite]', action, 'error:', err);
        return res.status(500).json({ error: err.message || 'Internal error' });
    }
}
