import nodemailer from 'nodemailer';
import type { VercelRequest, VercelResponse } from '@vercel/node';

/**
 * Serverless contact endpoint (Vercel). Sends mail to the portfolio owner through Gmail SMTP.
 *
 * Required environment variables (set in the Vercel dashboard, never in src/ or VITE_* vars):
 *   GMAIL_APP_PASSWORD  - 16-character Google App Password for the sender account
 * Optional:
 *   GMAIL_USER          - sender account (defaults to the recipient address below)
 */

const RECIPIENT = 'ritiksahoo133@gmail.com';
const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const LIMITS = { name: 100, email: 254, subject: 150, message: 5000 } as const;

interface ContactPayload {
  name?: unknown;
  email?: unknown;
  subject?: unknown;
  message?: unknown;
  /** Honeypot: real visitors never fill this hidden field. */
  website?: unknown;
}

function clean(value: unknown, max: number): string {
  return typeof value === 'string' ? value.trim().slice(0, max) : '';
}

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== 'POST') {
    res.setHeader('Allow', 'POST');
    return res.status(405).json({ success: false, error: 'Method not allowed.' });
  }

  const body: ContactPayload =
    typeof req.body === 'string' ? safeParse(req.body) : ((req.body as ContactPayload) ?? {});

  // Bots that fill the honeypot get a fake success and nothing is sent.
  if (clean(body.website, 200)) {
    return res.status(200).json({ success: true });
  }

  const name = clean(body.name, LIMITS.name);
  const email = clean(body.email, LIMITS.email);
  const subject = clean(body.subject, LIMITS.subject) || `New portfolio message from ${name}`;
  const message = clean(body.message, LIMITS.message);

  if (!name || !message || !EMAIL_PATTERN.test(email)) {
    return res
      .status(400)
      .json({ success: false, error: 'Please provide your name, a valid email and a message.' });
  }

  // Google displays App Passwords in groups of four with spaces; SMTP needs them without.
  const pass = process.env.GMAIL_APP_PASSWORD?.replace(/\s+/g, '');
  if (!pass) {
    console.error('GMAIL_APP_PASSWORD is not configured.');
    return res
      .status(500)
      .json({ success: false, error: 'Email service is not configured yet.' });
  }

  const sender = process.env.GMAIL_USER || RECIPIENT;

  try {
    const transporter = nodemailer.createTransport({
      host: 'smtp.gmail.com',
      port: 465,
      secure: true,
      auth: { user: sender, pass },
    });

    await transporter.sendMail({
      from: `"Portfolio Contact" <${sender}>`,
      to: RECIPIENT,
      replyTo: `"${name.replace(/"/g, '')}" <${email}>`,
      subject,
      text: `From: ${name} <${email}>\n\n${message}`,
    });

    return res.status(200).json({ success: true });
  } catch (error) {
    console.error('Failed to send contact email:', error);
    return res
      .status(502)
      .json({ success: false, error: 'The message could not be sent. Please try the Mail app option.' });
  }
}

function safeParse(raw: string): ContactPayload {
  try {
    return JSON.parse(raw) as ContactPayload;
  } catch {
    return {};
  }
}
