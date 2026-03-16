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
    const data = await graphql(token, `mutation fileUploadRequest {
        fileUploadRequest {
            id
            uploadUrl
        }
    }`);

    console.log('[Cyanite] fileUploadRequest response:', JSON.stringify(data));

    if (data.errors) {
        return res.status(400).json({ error: data.errors[0]?.message || 'GraphQL error' });
    }

    const result = data.data?.fileUploadRequest;
    if (!result?.uploadUrl) {
        return res.status(400).json({ error: 'Failed to get upload URL' });
    }

    return res.status(200).json({ uploadUrl: result.uploadUrl, fileUploadId: result.id });
}

// POST ?action=analyze — Create library track (auto-enqueues analysis)
async function handleAnalyze(req, res, token) {
    const { fileUploadId, title } = req.body || {};
    if (!fileUploadId) {
        return res.status(400).json({ error: 'fileUploadId is required' });
    }

    const createResult = await graphql(token, `
        mutation LibraryTrackCreate($input: LibraryTrackCreateInput!) {
            libraryTrackCreate(input: $input) {
                __typename
                ... on LibraryTrackCreateSuccess {
                    createdLibraryTrack { id title }
                    enqueueResult {
                        __typename
                        ... on LibraryTrackEnqueueSuccess { success }
                        ... on LibraryTrackEnqueueError { message }
                    }
                }
                ... on LibraryTrackCreateError { code message }
            }
        }
    `, { input: { uploadId: fileUploadId, title: title || 'Uploaded Track' } });

    console.log('[Cyanite] libraryTrackCreate response:', JSON.stringify(createResult));

    if (createResult.errors) {
        return res.status(400).json({ error: createResult.errors[0]?.message || 'GraphQL error' });
    }

    const result = createResult.data?.libraryTrackCreate;
    if (result?.__typename === 'LibraryTrackCreateError') {
        return res.status(400).json({ error: result.message || result.code || 'Failed to create track' });
    }

    const track = result?.createdLibraryTrack;
    if (!track) {
        return res.status(400).json({ error: 'Failed to create library track' });
    }

    return res.status(200).json({ analysisId: track.id, title: track.title, status: 'enqueued' });
}

// GET ?action=result&id=... — Fetch analysis result from Cyanite
async function handleResult(req, res, token) {
    const trackId = req.query.id;
    if (!trackId) {
        return res.status(400).json({ error: 'id query parameter is required' });
    }

    const data = await graphql(token, `query LibraryTrackQuery($id: ID!) {
        libraryTrack(id: $id) {
            __typename
            ... on LibraryTrackNotFoundError { message }
            ... on LibraryTrack {
                id
                title
                audioAnalysisV6 {
                    __typename
                    ... on AudioAnalysisV6NotStarted { _: __typename }
                    ... on AudioAnalysisV6Enqueued { _: __typename }
                    ... on AudioAnalysisV6Processing { _: __typename }
                    ... on AudioAnalysisV6Finished {
                        result {
                            bpm
                            key
                            energyLevel
                            energyDynamics
                            emotionalProfile
                            emotionalDynamics
                            voicePresenceProfile
                            predominantVoiceGender
                            moodTags
                            genreTags
                            instrumentTags
                            advancedGenreTags
                            freeGenreTags
                        }
                    }
                    ... on AudioAnalysisV6Failed { error { message } }
                }
            }
        }
    }`, { id: trackId });

    console.log('[Cyanite] libraryTrack response:', JSON.stringify(data).slice(0, 1000));

    if (data.errors) {
        return res.status(400).json({ error: data.errors[0]?.message || 'GraphQL error' });
    }

    const track = data.data?.libraryTrack;
    if (!track || track.__typename === 'LibraryTrackNotFoundError') {
        return res.status(404).json({ error: track?.message || 'Track not found' });
    }

    const av6 = track.audioAnalysisV6;
    const status = av6?.__typename?.replace('AudioAnalysisV6', '').toLowerCase() || 'unknown';
    const result = { id: track.id, title: track.title, status };

    if (av6?.__typename === 'AudioAnalysisV6Finished' && av6.result) {
        const r = av6.result;
        Object.assign(result, {
            bpm: r.bpm, key: r.key, energyLevel: r.energyLevel,
            energyDynamics: r.energyDynamics, emotionalProfile: r.emotionalProfile,
            voicePresenceProfile: r.voicePresenceProfile,
            predominantVoiceGender: r.predominantVoiceGender,
            mood: r.moodTags, genre: r.genreTags, instruments: r.instrumentTags,
            advancedGenre: r.advancedGenreTags, freeGenre: r.freeGenreTags,
        });
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
