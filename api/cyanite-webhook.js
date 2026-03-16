import crypto from 'crypto';

const CYANITE_API = 'https://api.cyanite.ai/graphql';
const SUPABASE_URL = 'https://mbruoxxqpnxcybwureku.supabase.co';

export const config = {
    api: { bodyParser: false },
};

async function getRawBody(req) {
    const chunks = [];
    for await (const chunk of req) {
        chunks.push(typeof chunk === 'string' ? Buffer.from(chunk) : chunk);
    }
    return Buffer.concat(chunks);
}

async function fetchCyaniteAnalysis(trackId, token) {
    const response = await fetch(CYANITE_API, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify({
            query: `query LibraryTrackQuery($id: ID!) {
                libraryTrack(id: $id) {
                    __typename
                    ... on LibraryTrackNotFoundError { message }
                    ... on LibraryTrack {
                        id
                        title
                        audioAnalysisV6 {
                            __typename
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
                                }
                            }
                            ... on AudioAnalysisV6Failed { error { message } }
                        }
                    }
                }
            }`,
            variables: { id: trackId },
        }),
    });
    return response.json();
}

function normalizeAnalysis(track) {
    const av6 = track.audioAnalysisV6;
    const status = av6?.__typename?.replace('AudioAnalysisV6', '').toLowerCase() || 'unknown';

    const result = {
        cyanite_id: track.id,
        title: track.title,
        status: status === 'finished' ? 'finished' : status,
    };

    if (av6?.__typename === 'AudioAnalysisV6Finished' && av6.result) {
        const r = av6.result;
        result.bpm = r.bpm;
        result.key = r.key;
        result.energy_level = r.energyLevel;
        result.energy_dynamics = r.energyDynamics;
        result.emotional_profile = r.emotionalProfile;
        result.voice_presence = r.voicePresenceProfile;
        result.predominant_voice_gender = r.predominantVoiceGender;
        result.mood = r.moodTags || [];
        result.genre = r.genreTags || [];
        result.instruments = r.instrumentTags || [];
    }

    return result;
}

async function storeInSupabase(analysisData, supabaseKey) {
    // Upsert into track_analyses table (by cyanite_id)
    const response = await fetch(`${SUPABASE_URL}/rest/v1/track_analyses`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'apikey': supabaseKey,
            'Authorization': `Bearer ${supabaseKey}`,
            'Prefer': 'resolution=merge-duplicates,return=representation',
        },
        body: JSON.stringify({
            cyanite_id: analysisData.cyanite_id,
            title: analysisData.title || '',
            status: analysisData.status || 'finished',
            bpm: analysisData.bpm || null,
            key: analysisData.key || null,
            energy_level: analysisData.energy_level || null,
            energy_dynamics: analysisData.energy_dynamics || null,
            emotional_profile: analysisData.emotional_profile || null,
            voice_presence: analysisData.voice_presence || null,
            predominant_voice_gender: analysisData.predominant_voice_gender || null,
            mood: analysisData.mood || [],
            genre: analysisData.genre || [],
            instruments: analysisData.instruments || [],
            raw_data: analysisData,
        }),
    });

    if (!response.ok) {
        const errText = await response.text();
        console.error('[Cyanite Webhook] Supabase insert error:', errText);
        throw new Error(errText);
    }

    return response.json();
}

export default async function handler(req, res) {
    if (req.method !== 'POST') {
        return res.status(405).json({ error: 'Method not allowed' });
    }

    try {
        const rawBody = await getRawBody(req);
        const bodyStr = rawBody.toString('utf-8');

        console.log('[Cyanite Webhook] Received request');
        console.log('[Cyanite Webhook] Body:', bodyStr.slice(0, 1000));

        // Verify signature if secret is configured
        const secret = process.env.CYANITE_WEBHOOK_SECRET;
        if (secret) {
            const signature = req.headers['x-cyanite-signature']
                || req.headers['x-webhook-signature']
                || req.headers['x-signature']
                || '';

            if (signature) {
                try {
                    const computed = crypto
                        .createHmac('sha256', secret)
                        .update(rawBody)
                        .digest('hex');

                    const sigBuffer = Buffer.from(signature, 'hex');
                    const computedBuffer = Buffer.from(computed, 'hex');

                    if (sigBuffer.length === computedBuffer.length) {
                        const valid = crypto.timingSafeEqual(computedBuffer, sigBuffer);
                        if (!valid) {
                            console.warn('[Cyanite Webhook] Signature mismatch');
                        }
                    }
                } catch (sigErr) {
                    console.warn('[Cyanite Webhook] Signature check error:', sigErr.message);
                }
            }
        }

        // Parse webhook payload
        let payload = {};
        if (bodyStr.trim()) {
            try { payload = JSON.parse(bodyStr); } catch (e) {
                console.warn('[Cyanite Webhook] Body is not JSON');
            }
        }

        // Extract track ID from webhook v2 payload
        // Webhook v2 sends: { event, libraryTrackId, ... } or nested variants
        const trackId = payload.libraryTrackId
            || payload.inDepthAnalysisId
            || payload.analysisId
            || payload.id
            || payload.data?.libraryTrackId
            || payload.data?.inDepthAnalysisId
            || payload.data?.id;

        if (!trackId) {
            console.log('[Cyanite Webhook] No track ID found in payload, acknowledging test event');
            return res.status(200).json({ received: true });
        }

        console.log('[Cyanite Webhook] Processing track:', trackId);

        // Fetch full analysis results from Cyanite
        const cyaniteToken = process.env.CYANITE_ACCESS_TOKEN;
        const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

        if (!cyaniteToken) {
            console.error('[Cyanite Webhook] CYANITE_ACCESS_TOKEN not configured');
            return res.status(200).json({ received: true });
        }

        const result = await fetchCyaniteAnalysis(trackId, cyaniteToken);
        console.log('[Cyanite Webhook] Analysis result:', JSON.stringify(result).slice(0, 500));

        const track = result.data?.libraryTrack;
        if (!track || track.__typename === 'LibraryTrackNotFoundError') {
            console.error('[Cyanite Webhook] Track error:', track?.message || 'Not found');
            return res.status(200).json({ received: true });
        }

        // Normalize and store in Supabase
        const normalized = normalizeAnalysis(track);
        console.log('[Cyanite Webhook] Normalized:', JSON.stringify(normalized).slice(0, 500));

        if (supabaseKey) {
            await storeInSupabase(normalized, supabaseKey);
            console.log('[Cyanite Webhook] Stored in Supabase');
        } else {
            console.warn('[Cyanite Webhook] SUPABASE_SERVICE_ROLE_KEY not configured, skipping storage');
        }

        return res.status(200).json({ received: true });
    } catch (err) {
        console.error('[Cyanite Webhook] Error:', err.message);
        return res.status(200).json({ received: true, error: err.message });
    }
}
