import nodemailer from 'nodemailer';
import dotenv from 'dotenv';

if (process.env.NODE_ENV !== 'production') {
  dotenv.config({ path: '.env.local', quiet: true });
}

const DESTINATION_EMAIL = 'montessoriplayhousegfd@gmail.com';
const SUBJECT = 'New Pre-Registration - Montessori Playhouse';

function clean(value, maxLength = 1000) { return String(value ?? '').trim().slice(0, maxLength); }
function escapeHtml(value) {
  return clean(value).replaceAll('&', '&amp;').replaceAll('<', '&lt;').replaceAll('>', '&gt;').replaceAll('"', '&quot;').replaceAll("'", '&#039;');
}

export default async function handler(request, response) {
  if (request.method !== 'POST') {
    response.setHeader('Allow', 'POST');
    return response.status(405).json({ error: 'Method not allowed.' });
  }

  const gmailUser = process.env.GMAIL_USER?.trim();
  const gmailAppPassword = process.env.GMAIL_APP_PASSWORD?.replace(/\s+/g, '');
  console.log('GMAIL_USER loaded:', Boolean(gmailUser));
  console.log('GMAIL_APP_PASSWORD loaded:', Boolean(gmailAppPassword));
  if (!gmailUser || !gmailAppPassword) {
    console.error('Gmail environment variables are not configured.');
    return response.status(503).json({ error: 'Email service is not configured.' });
  }

  const body = request.body || {};
  if (clean(body.website)) return response.status(200).json({ ok: true });
  const fields = {
    parentName: clean(body.parentName, 120), childName: clean(body.childName, 120),
    childAge: clean(body.childAge, 50), phone: clean(body.phone, 50),
    email: clean(body.email, 160), program: clean(body.program, 100),
    contactMethod: clean(body.contactMethod, 100), message: clean(body.message, 2000),
  };

  if (!fields.parentName || !fields.childName || !fields.childAge || !fields.phone || !fields.email || !fields.program || !fields.contactMethod) {
    return response.status(400).json({ error: 'Please complete all required fields.' });
  }
  if (!['Email', 'Phone', 'WhatsApp'].includes(fields.contactMethod)) {
    return response.status(400).json({ error: 'Please select a valid contact method.' });
  }
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(fields.email)) {
    return response.status(400).json({ error: 'Please enter a valid email address.' });
  }

  const submittedAt = new Intl.DateTimeFormat('en-US', { dateStyle: 'full', timeStyle: 'long', timeZone: 'America/New_York' }).format(new Date());
  const rows = [
    ['Parent / Guardian Name', fields.parentName], ['Child Name', fields.childName],
    ['Child Age', fields.childAge], ['Phone', fields.phone], ['Email', fields.email],
    ['Program', fields.program], ['Preferred Contact Method', fields.contactMethod],
    ['Message', fields.message || 'None'], ['Date / Time (New York)', submittedAt],
  ];
  const html = `<div style="font-family:Arial,sans-serif;max-width:680px;margin:auto;color:#292039"><h1 style="color:#6817a8;font-size:24px">${SUBJECT}</h1><table style="width:100%;border-collapse:collapse">${rows.map(([label, value]) => `<tr><th style="text-align:left;padding:10px;border:1px solid #e7dcef;background:#f7f0fb;width:38%">${label}</th><td style="padding:10px;border:1px solid #e7dcef">${escapeHtml(value)}</td></tr>`).join('')}</table></div>`;

  try {
    const transporter = nodemailer.createTransport({
      host: 'smtp.gmail.com',
      port: 465,
      secure: true,
      auth: { user: gmailUser, pass: gmailAppPassword },
    });
    await transporter.sendMail({ from: `Montessori Playhouse <${gmailUser}>`, to: DESTINATION_EMAIL, replyTo: fields.email, subject: SUBJECT, html });
    return response.status(200).json({ ok: true });
  } catch (error) {
    console.error('Gmail delivery failed:', error instanceof Error ? error.message : 'Unknown error');
    return response.status(502).json({ error: 'Unable to send the request right now.' });
  }
}
