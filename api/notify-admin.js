// API: Send notification email to admin when user performs dashboard actions
import { Resend } from 'resend';

export default async function handler(req, res) {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
    if (req.method === 'OPTIONS') return res.status(200).end();
    if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' });

    const SUPABASE_URL = 'https://mbruoxxqpnxcybwureku.supabase.co';
    const SUPABASE_SERVICE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY;
    const RESEND_API_KEY = process.env.RESEND_API_KEY;
    const ADMIN_EMAIL = 'support@alphastudios.app';

    if (!RESEND_API_KEY) {
        return res.status(500).json({ error: 'Email service not configured' });
    }

    // Verify authenticated user
    const authHeader = req.headers.authorization;
    if (!authHeader) return res.status(401).json({ error: 'Not authenticated' });
    const token = authHeader.replace('Bearer ', '');

    let user;
    try {
        const userRes = await fetch(`${SUPABASE_URL}/auth/v1/user`, {
            headers: { 'Authorization': `Bearer ${token}`, 'apikey': SUPABASE_SERVICE_KEY },
        });
        if (!userRes.ok) return res.status(401).json({ error: 'Invalid token' });
        user = await userRes.json();
    } catch (e) {
        return res.status(401).json({ error: 'Auth error' });
    }

    let body = req.body;
    if (typeof body === 'string') {
        try { body = JSON.parse(body); } catch (e) { body = {}; }
    }

    const { action, order_id, track_title, track_artist } = body || {};

    if (!action || !order_id) {
        return res.status(400).json({ error: 'Missing action or order_id' });
    }

    const userName = user.user_metadata?.full_name || user.email || 'Unknown user';
    const userEmail = user.email || '';
    const trackDisplay = track_title
        ? `${track_title}${track_artist ? ` - ${track_artist}` : ''}`
        : `Order #${order_id.substring(0, 8)}`;

    let subject = '';
    let actionDescription = '';

    if (action === 'reupload') {
        subject = `Re-upload: ${userName} a re-uploadé un morceau`;
        actionDescription = `<strong>${escapeHtml(userName)}</strong> (${escapeHtml(userEmail)}) a re-uploadé son morceau après feedback.`;
    } else if (action === 'approve_mastering') {
        subject = `Approve Mastering: ${userName} a approuvé le mastering`;
        actionDescription = `<strong>${escapeHtml(userName)}</strong> (${escapeHtml(userEmail)}) a approuvé son morceau pour le mastering.`;
    } else {
        return res.status(400).json({ error: 'Invalid action. Use "reupload" or "approve_mastering".' });
    }

    try {
        const resend = new Resend(RESEND_API_KEY);

        const html = `<!DOCTYPE html>
<html>
<head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
</head>
<body style="margin:0;padding:0;background:#f5f7fa;font-family:'Helvetica Neue',Arial,sans-serif;">
    <div style="max-width:600px;margin:0 auto;background:#ffffff;padding:40px 20px;">
        <div style="text-align:center;padding-bottom:30px;border-bottom:1px solid rgba(0,0,0,0.08);">
            <img src="https://res.cloudinary.com/dymdijw7n/image/upload/v1773690586/Dark_Blue_Minimalist_Letter_A_Logo_rufnct.png" alt="AlphaStudios" style="height:50px;" />
        </div>

        <div style="padding:40px 0;">
            <h1 style="color:#1a1a2e;font-size:20px;font-weight:700;margin:0 0 20px;text-align:center;">
                ${action === 'reupload' ? 'New Re-upload' : 'Mastering Approved'}
            </h1>

            <div style="background:rgba(26,26,46,0.03);border:1px solid rgba(26,26,46,0.08);border-radius:12px;padding:20px;margin-bottom:20px;">
                <p style="color:#1a1a2e;font-size:15px;line-height:1.7;margin:0 0 16px;">
                    ${actionDescription}
                </p>
                <table style="width:100%;border-collapse:collapse;">
                    <tr>
                        <td style="padding:8px 0;color:rgba(26,26,46,0.5);font-size:14px;width:120px;">Track</td>
                        <td style="padding:8px 0;color:#1a1a2e;font-size:14px;font-weight:600;">${escapeHtml(trackDisplay)}</td>
                    </tr>
                    <tr>
                        <td style="padding:8px 0;color:rgba(26,26,46,0.5);font-size:14px;">User</td>
                        <td style="padding:8px 0;color:#1a1a2e;font-size:14px;font-weight:600;">${escapeHtml(userName)}</td>
                    </tr>
                    <tr>
                        <td style="padding:8px 0;color:rgba(26,26,46,0.5);font-size:14px;">Email</td>
                        <td style="padding:8px 0;color:#1a1a2e;font-size:14px;font-weight:600;">${escapeHtml(userEmail)}</td>
                    </tr>
                    <tr>
                        <td style="padding:8px 0;color:rgba(26,26,46,0.5);font-size:14px;">Order ID</td>
                        <td style="padding:8px 0;color:#1a1a2e;font-size:14px;font-weight:600;">${escapeHtml(order_id)}</td>
                    </tr>
                </table>
            </div>

            <div style="text-align:center;">
                <a href="https://alphastudios.app/admin" style="display:inline-block;padding:14px 40px;background:#1a1a2e;color:#ffffff;text-decoration:none;border-radius:8px;font-size:16px;font-weight:700;letter-spacing:0.5px;">
                    VIEW ADMIN PANEL
                </a>
            </div>
        </div>

        <div style="border-top:1px solid rgba(0,0,0,0.08);padding-top:20px;text-align:center;">
            <p style="color:rgba(26,26,46,0.3);font-size:12px;margin:0;line-height:1.5;">
                AlphaStudios - Admin Notification<br>
                This is an automated notification from the user dashboard.
            </p>
        </div>
    </div>
</body>
</html>`;

        const { error: emailError } = await resend.emails.send({
            from: process.env.RESEND_FROM_EMAIL || 'AlphaStudios <noreply@alphastudios.app>',
            to: [ADMIN_EMAIL],
            subject,
            html,
        });

        if (emailError) {
            console.error('Resend error:', emailError);
            return res.status(500).json({ error: 'Failed to send notification', details: emailError.message });
        }

        return res.status(200).json({ success: true });
    } catch (error) {
        console.error('Admin notify error:', error.message);
        return res.status(500).json({ error: 'Failed to send notification', details: error.message });
    }
}

function escapeHtml(str) {
    if (!str) return '';
    return String(str).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
}
