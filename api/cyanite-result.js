const CYANITE_API = 'https://api.cyanite.ai/graphql';

export default async function handler(req, res) {
    if (req.method !== 'GET') {
        return res.status(405).json({ error: 'Method not allowed' });
    }

    const token = process.env.CYANITE_ACCESS_TOKEN;
    if (!token) {
        return res.status(500).json({ error: 'Cyanite API token not configured' });
    }

    const analysisId = req.query.id;
    if (!analysisId) {
        return res.status(400).json({ error: 'id query parameter is required' });
    }

    try {
        const response = await fetch(CYANITE_API, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`,
            },
            body: JSON.stringify({
                query: `query InDepthAnalysisQuery($id: ID!) {
                    inDepthAnalysis(recordId: $id) {
                        ... on InDepthAnalysis {
                            id
                            title
                            status
                            fastMusicalAnalysis {
                                ... on FastMusicalAnalysisResult {
                                    bpm
                                    key {
                                        value
                                    }
                                }
                            }
                            fullScaleMusicalAnalysis {
                                ... on FullScaleMusicalAnalysisResult {
                                    bpm
                                    key {
                                        value
                                    }
                                    energyLevel
                                    energyDynamics
                                    emotionalProfile
                                    emotionalDynamics
                                    voicePresenceProfile
                                    predominantVoiceGender
                                    mood {
                                        tags
                                    }
                                    genre {
                                        tags
                                    }
                                    instrument {
                                        tags
                                    }
                                }
                            }
                        }
                        ... on InDepthAnalysisError {
                            message
                        }
                    }
                }`,
                variables: { id: analysisId },
            }),
        });

        const data = await response.json();
        console.log('[Cyanite] Analysis result:', JSON.stringify(data).slice(0, 1000));

        if (data.errors) {
            return res.status(400).json({ error: data.errors[0]?.message || 'GraphQL error' });
        }

        const analysis = data.data?.inDepthAnalysis;
        if (!analysis || analysis.message) {
            return res.status(404).json({ error: analysis?.message || 'Analysis not found' });
        }

        // Normalize result for frontend
        const fast = analysis.fastMusicalAnalysis;
        const full = analysis.fullScaleMusicalAnalysis;

        const result = {
            id: analysis.id,
            status: analysis.status,
            title: analysis.title,
        };

        // Use full-scale results if available, fall back to fast
        if (full && !full.message) {
            result.bpm = full.bpm;
            result.key = full.key?.value;
            result.energyLevel = full.energyLevel;
            result.energyDynamics = full.energyDynamics;
            result.emotionalProfile = full.emotionalProfile;
            result.voicePresenceProfile = full.voicePresenceProfile;
            result.predominantVoiceGender = full.predominantVoiceGender;
            result.mood = full.mood?.tags;
            result.genre = full.genre?.tags;
            result.instruments = full.instrument?.tags;
        } else if (fast && !fast.message) {
            result.bpm = fast.bpm;
            result.key = fast.key?.value;
        }

        return res.status(200).json(result);
    } catch (err) {
        console.error('[Cyanite] Result fetch error:', err);
        return res.status(500).json({ error: 'Failed to fetch analysis results' });
    }
}
