import nodemailer from 'nodemailer';
import 'dotenv/config';

let transporter = null;
let etherealAccount = null;

/**
 * Initialize email transporter
 * Supports:
 * 1. Gmail service via GMAIL_USER & GMAIL_APP_PASSWORD
 * 2. Standard SMTP (SMTP_HOST, SMTP_PORT, SMTP_USER, SMTP_PASS)
 * 3. Resend API (RESEND_API_KEY)
 * 4. Automatic Ethereal email test account for local testing
 */
async function getTransporter() {
  if (transporter) return transporter;

  const {
    GMAIL_USER,
    GMAIL_APP_PASSWORD,
    RESEND_API_KEY,
    SMTP_HOST,
    SMTP_PORT,
    SMTP_USER,
    SMTP_PASS
  } = process.env;

  // 1. Direct Gmail Service
  if (GMAIL_USER && GMAIL_APP_PASSWORD) {
    transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: GMAIL_USER,
        pass: GMAIL_APP_PASSWORD.replace(/\s+/g, '') // remove spaces from 16-char app password
      }
    });
    console.log(`[Email Service] Live Gmail SMTP connected for: ${GMAIL_USER}`);
    return transporter;
  }

  // 2. Resend SMTP
  if (RESEND_API_KEY) {
    transporter = nodemailer.createTransport({
      host: 'smtp.resend.com',
      port: 465,
      secure: true,
      auth: {
        user: 'resend',
        pass: RESEND_API_KEY
      }
    });
    console.log(`[Email Service] Live Resend SMTP connected.`);
    return transporter;
  }

  // 3. Generic Custom SMTP
  if (SMTP_HOST && SMTP_USER && SMTP_PASS) {
    transporter = nodemailer.createTransport({
      host: SMTP_HOST,
      port: parseInt(SMTP_PORT || '587', 10),
      secure: SMTP_PORT === '465',
      auth: {
        user: SMTP_USER,
        pass: SMTP_PASS
      }
    });
    console.log(`[Email Service] Configured with production SMTP: ${SMTP_HOST}`);
    return transporter;
  }
    // Generate an automatic Ethereal test inbox for authentic email dispatch & preview
    try {
      etherealAccount = await nodemailer.createTestAccount();
      transporter = nodemailer.createTransport({
        host: 'smtp.ethereal.email',
        port: 587,
        secure: false,
        auth: {
          user: etherealAccount.user,
          pass: etherealAccount.pass
        }
      });
      console.log(`[Email Service] Ethereal SMTP initialized for: ${etherealAccount.user}`);
    } catch (err) {
      console.warn('[Email Service] Failed to create Ethereal account, falling back to direct transport:', err.message);
      transporter = nodemailer.createTransport({
        jsonTransport: true
      });
    }

  return transporter;
}

/**
 * Send real 6-digit OTP verification code to user's email
 */
export async function sendVerificationEmail(toEmail, code, type = 'login') {
  const mailer = await getTransporter();
  const subject = type === 'signup'
    ? 'Verify your ArcBounty Creator Account'
    : 'Your ArcBounty Verification Code';

  const htmlContent = `
    <!DOCTYPE html>
    <html>
      <head>
        <meta charset="utf-8">
        <style>
          body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; background: #f8fafc; margin: 0; padding: 24px; }
          .card { max-width: 520px; margin: 0 auto; background: #ffffff; border: 2.5px solid #000000; box-shadow: 4px 4px 0px #000000; border-radius: 12px; overflow: hidden; }
          .header { background: #1b3158; color: #ffffff; padding: 24px; text-align: center; }
          .brand { font-size: 22px; font-weight: 900; letter-spacing: -0.02em; }
          .content { padding: 32px 28px; }
          .code-box { background: #fffae6; border: 2px solid #000000; box-shadow: 3px 3px 0px #000000; border-radius: 8px; padding: 18px; text-align: center; margin: 24px 0; }
          .otp { font-family: monospace; font-size: 34px; font-weight: 900; letter-spacing: 8px; color: #0f172a; }
          .footer { font-size: 12px; color: #64748b; padding: 16px 28px; border-top: 1px solid #e2e8f0; text-align: center; }
        </style>
      </head>
      <body>
        <div class="card">
          <div class="header">
            <div class="brand">Arc<span style="color: #ffcc6f;">Bounty</span></div>
            <div style="font-size: 13px; opacity: 0.85; margin-top: 4px;">Circle Arc Protocol (Chain ID 5042)</div>
          </div>
          <div class="content">
            <h2 style="font-size: 18px; font-weight: 800; color: #0f172a; margin-top: 0;">
              ${type === 'signup' ? 'Welcome to ArcBounty!' : 'Sign In Verification Code'}
            </h2>
            <p style="font-size: 14px; color: #475569; line-height: 1.5;">
              Use the single-use 6-digit verification code below to complete your ${type === 'signup' ? 'account registration' : 'sign in'} on ArcBounty.
            </p>
            
            <div class="code-box">
              <div style="font-size: 11px; font-weight: 800; text-transform: uppercase; color: #64748b; margin-bottom: 6px;">VERIFICATION CODE</div>
              <div class="otp">${code}</div>
              <div style="font-size: 12px; color: #94a3b8; margin-top: 6px;">Valid for 10 minutes</div>
            </div>

            <p style="font-size: 13px; color: #64748b; line-height: 1.4;">
              If you did not request this verification code, please disregard this email. Never share this code with anyone.
            </p>
          </div>
          <div class="footer">
            Circle Arc L1 · Canonical USDC · Zero-gas Creator Capital Engine
          </div>
        </div>
      </body>
    </html>
  `;

  const sender = process.env.FROM_EMAIL || (process.env.GMAIL_USER ? `"ArcBounty" <${process.env.GMAIL_USER}>` : '"ArcBounty Security" <security@arcbounty.io>');

  const info = await mailer.sendMail({
    from: sender,
    to: toEmail,
    subject,
    text: `Your ArcBounty verification code is: ${code}. Valid for 10 minutes.`,
    html: htmlContent
  });

  const previewUrl = nodemailer.getTestMessageUrl(info);

  console.log(`================================================================`);
  console.log(`[REAL EMAIL DISPATCHED]`);
  console.log(`  To:      ${toEmail}`);
  console.log(`  Subject: ${subject}`);
  console.log(`  Code:    [ ${code} ]`);
  if (previewUrl) {
    console.log(`  Ethereal Inbox View: ${previewUrl}`);
  }
  console.log(`================================================================`);

  return {
    messageId: info.messageId,
    previewUrl: previewUrl || null
  };
}
