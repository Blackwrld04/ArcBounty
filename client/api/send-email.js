import nodemailer from 'nodemailer';

/**
 * ArcBounty Vercel Serverless Email Relay
 * Dispatches high-deliverability transactional emails via Gmail SMTP over port 465 (SSL).
 * Bypasses cloud host port blocks (e.g. Render free tier) and sandbox domain restrictions.
 */
export default async function handler(req, res) {
  // CORS & Preflight headers
  res.setHeader('Access-Control-Allow-Credentials', 'true');
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS,POST');
  res.setHeader(
    'Access-Control-Allow-Headers',
    'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version, x-relay-secret, Authorization'
  );

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  if (req.method === 'GET') {
    return res.status(200).json({
      status: 'ok',
      service: 'ArcBounty Email Relay',
      timestamp: new Date().toISOString()
    });
  }

  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed. Use POST.' });
  }

  try {
    let body = req.body;
    if (typeof body === 'string') {
      try {
        body = JSON.parse(body);
      } catch (e) {
        // Fallback to raw string
      }
    }
    body = body || {};

    // 1. Verify shared relay secret
    const secret = req.headers['x-relay-secret'] || body.secret;
    const expectedSecret = process.env.EMAIL_RELAY_SECRET || 'arcbounty-relay-auth-2026';

    if (secret !== expectedSecret) {
      return res.status(401).json({ error: 'Unauthorized relay request' });
    }

    const { to, subject, html, text, auth } = body;

    // 2. Resolve credentials from request auth payload or environment
    const user = auth?.user || process.env.GMAIL_USER;
    const rawPass = auth?.pass || process.env.GMAIL_APP_PASSWORD;
    const pass = rawPass ? rawPass.replace(/\s+/g, '') : null;

    if (!user || !pass) {
      return res.status(400).json({
        error: 'Missing SMTP credentials. Provide auth.user and auth.pass or set GMAIL_USER and GMAIL_APP_PASSWORD.'
      });
    }

    if (!to || !subject || (!html && !text)) {
      return res.status(400).json({
        error: 'Missing required fields: to, subject, and either html or text must be provided.'
      });
    }

    const recipients = Array.isArray(to) ? to.join(', ') : to;

    // 3. Dispatch through Gmail SMTP (Port 465 SSL)
    const transporter = nodemailer.createTransport({
      host: 'smtp.gmail.com',
      port: 465,
      secure: true,
      auth: { user, pass },
      connectionTimeout: 10000,
      greetingTimeout: 10000,
      socketTimeout: 15000
    });

    const info = await transporter.sendMail({
      from: `"ArcBounty" <${user}>`,
      to: recipients,
      subject,
      html,
      text
    });

    console.log(`[Vercel Relay] Successfully dispatched to ${recipients} | MsgID: ${info.messageId}`);

    return res.status(200).json({
      success: true,
      messageId: info.messageId,
      accepted: info.accepted
    });
  } catch (error) {
    console.error('[Vercel Relay Error]:', error);
    return res.status(500).json({
      error: error.message || 'Failed to dispatch email via relay'
    });
  }
}
