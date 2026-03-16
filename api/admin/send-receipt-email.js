// Admin API: Send mastered file notification email to customer
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

    if (!RESEND_API_KEY) {
        return res.status(500).json({ error: 'Email service not configured' });
    }

    // Verify admin
    const authHeader = req.headers.authorization;
    if (!authHeader) return res.status(401).json({ error: 'Not authenticated' });
    const token = authHeader.replace('Bearer ', '');

    const userRes = await fetch(`${SUPABASE_URL}/auth/v1/user`, {
        headers: { 'Authorization': `Bearer ${token}`, 'apikey': SUPABASE_SERVICE_KEY },
    });
    if (!userRes.ok) return res.status(401).json({ error: 'Invalid token' });
    const adminUser = await userRes.json();

    const profileRes = await fetch(`${SUPABASE_URL}/rest/v1/profiles?id=eq.${adminUser.id}&select=is_admin`, {
        headers: { 'apikey': SUPABASE_SERVICE_KEY, 'Authorization': `Bearer ${SUPABASE_SERVICE_KEY}` },
    });
    const profiles = await profileRes.json();
    if (!profiles[0]?.is_admin) return res.status(403).json({ error: 'Not admin' });

    const { order_id } = req.body;
    if (!order_id) return res.status(400).json({ error: 'Missing order_id' });

    try {
        // Fetch order details
        const orderRes = await fetch(
            `${SUPABASE_URL}/rest/v1/orders?id=eq.${order_id}&select=*`,
            { headers: { 'apikey': SUPABASE_SERVICE_KEY, 'Authorization': `Bearer ${SUPABASE_SERVICE_KEY}` } }
        );
        const orders = await orderRes.json();
        if (!orders.length) return res.status(404).json({ error: 'Order not found' });
        const order = orders[0];

        if (!order.receipt_url) {
            return res.status(400).json({ error: 'No mastered file uploaded for this order yet' });
        }

        // Determine recipient email: try user profile first, fallback to order customer_email
        let recipientEmail = order.customer_email;
        let recipientName = '';

        if (order.user_id) {
            const custProfileRes = await fetch(
                `${SUPABASE_URL}/rest/v1/profiles?id=eq.${order.user_id}&select=email,full_name`,
                { headers: { 'apikey': SUPABASE_SERVICE_KEY, 'Authorization': `Bearer ${SUPABASE_SERVICE_KEY}` } }
            );
            const custProfiles = await custProfileRes.json();
            if (custProfiles.length) {
                recipientEmail = custProfiles[0].email || recipientEmail;
                recipientName = custProfiles[0].full_name || '';
            }
        }

        if (!recipientEmail) {
            return res.status(400).json({ error: 'No email found for this customer' });
        }

        const packLabel = order.pack || 'Mastering + Feedback + Labels';
        const greeting = recipientName ? recipientName.split(' ')[0] : 'there';

        const resend = new Resend(RESEND_API_KEY);
        const { error: emailError } = await resend.emails.send({
            from: process.env.RESEND_FROM_EMAIL || 'AlphaStudios <noreply@alphastudios.app>',
            to: [recipientEmail],
            subject: `Your mastered track is ready! 🎵`,
            html: buildEmailHtml({ greeting, packLabel, order }),
        });

        if (emailError) {
            console.error('Resend error:', emailError);
            return res.status(500).json({ error: 'Failed to send email', details: emailError.message });
        }

        return res.status(200).json({ success: true, sent_to: recipientEmail });
    } catch (error) {
        console.error('Send email error:', error.message);
        return res.status(500).json({ error: 'Failed to send email', details: error.message });
    }
}

function buildEmailHtml({ greeting, packLabel, order }) {
    const trackTitle = order.track_title || 'your track';
    const trackArtist = order.track_artist || '';
    const dashboardUrl = process.env.APP_URL ? `${process.env.APP_URL}/dashboard` : 'https://alphastudios.app/dashboard';

    return `<!DOCTYPE html>
<html>
<head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
</head>
<body style="margin:0;padding:0;background:#f5f7fa;font-family:'Helvetica Neue',Arial,sans-serif;">
    <div style="max-width:600px;margin:0 auto;background:#ffffff;padding:40px 20px;">
        <!-- Header -->
        <div style="text-align:center;padding-bottom:30px;border-bottom:1px solid rgba(0,0,0,0.08);">
            <img src="https://res.cloudinary.com/dymdijw7n/image/upload/v1773639380/Dark_Blue_Minimalist_Letter_A_Logo_olmb2b.png" alt="AlphaStudios" style="height:50px;" />
        </div>

        <!-- Content -->
        <div style="padding:40px 0;text-align:center;">
            <h1 style="color:#1a1a2e;font-size:24px;font-weight:700;margin:0 0 10px;">Your mastered track is ready!</h1>
            <p style="color:rgba(26,26,46,0.6);font-size:16px;margin:0 0 30px;line-height:1.5;">
                Hey ${escapeHtml(greeting)}, great news!<br>
                Your mastered file is ready to download.
            </p>

            <!-- Track Info -->
            <div style="background:rgba(26,26,46,0.03);border:1px solid rgba(26,26,46,0.08);border-radius:12px;padding:20px;margin-bottom:30px;text-align:left;">
                <table style="width:100%;border-collapse:collapse;">
                    <tr>
                        <td style="padding:8px 0;color:rgba(26,26,46,0.5);font-size:14px;width:120px;">Track</td>
                        <td style="padding:8px 0;color:#1a1a2e;font-size:14px;font-weight:600;">${escapeHtml(trackTitle)}${trackArtist ? ` - ${escapeHtml(trackArtist)}` : ''}</td>
                    </tr>
                    <tr>
                        <td style="padding:8px 0;color:rgba(26,26,46,0.5);font-size:14px;">Package</td>
                        <td style="padding:8px 0;color:#1a1a2e;font-size:14px;font-weight:600;">${escapeHtml(packLabel)}</td>
                    </tr>
                    ${order.genre ? `<tr>
                        <td style="padding:8px 0;color:rgba(26,26,46,0.5);font-size:14px;">Genre</td>
                        <td style="padding:8px 0;color:#1a1a2e;font-size:14px;font-weight:600;">${escapeHtml(order.genre)}</td>
                    </tr>` : ''}
                </table>
            </div>

            <!-- Download Button -->
            <a href="${escapeHtml(order.receipt_url)}" style="display:inline-block;padding:14px 40px;background:#00a854;color:#ffffff;text-decoration:none;border-radius:8px;font-size:16px;font-weight:700;letter-spacing:0.5px;">
                DOWNLOAD MY MASTERED TRACK
            </a>
            <p style="color:rgba(26,26,46,0.4);font-size:13px;margin-top:16px;">
                You can also access your file from your <a href="${escapeHtml(dashboardUrl)}" style="color:#00a854;">dashboard</a>.
            </p>
        </div>

        <!-- Footer -->
        <div style="border-top:1px solid rgba(0,0,0,0.08);padding-top:20px;text-align:center;">
            <p style="color:rgba(26,26,46,0.3);font-size:12px;margin:0;line-height:1.5;">
                AlphaStudios - Professional Music Services<br>
                You received this email because you placed an order on AlphaStudios.
            </p>
        </div>
    </div>
</body>
</html>`;
}

function escapeHtml(str) {
    if (!str) return '';
    return String(str).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
}
