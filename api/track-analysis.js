const SUPABASE_URL = 'https://mbruoxxqpnxcybwureku.supabase.co';

export default async function handler(req, res) {
    if (req.method !== 'GET') {
        return res.status(405).json({ error: 'Method not allowed' });
    }

    const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
    if (!supabaseKey) {
        return res.status(500).json({ error: 'Database not configured' });
    }

    const cyaniteId = req.query.cyanite_id;
    if (!cyaniteId) {
        return res.status(400).json({ error: 'cyanite_id query parameter is required' });
    }

    try {
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
            const errText = await response.text();
            console.error('[TrackAnalysis] Supabase error:', errText);
            return res.status(500).json({ error: 'Database query failed' });
        }

        const data = await response.json();

        if (!data.length) {
            // Not found yet — analysis still processing
            return res.status(200).json({ status: 'processing' });
        }

        const analysis = data[0];
        return res.status(200).json({
            status: analysis.status || 'finished',
            bpm: analysis.bpm,
            key: analysis.key,
            energyLevel: analysis.energy_level,
            energyDynamics: analysis.energy_dynamics,
            emotionalProfile: analysis.emotional_profile,
            voicePresenceProfile: analysis.voice_presence,
            predominantVoiceGender: analysis.predominant_voice_gender,
            mood: analysis.mood,
            genre: analysis.genre,
            instruments: analysis.instruments,
        });
    } catch (err) {
        console.error('[TrackAnalysis] Error:', err.message);
        return res.status(500).json({ error: 'Failed to fetch analysis' });
    }
}
