export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method Not Allowed' });
  }

  const RESEND_API_KEY = process.env.RESEND_API_KEY;
  const EMAIL_FROM = process.env.EMAIL_FROM || 'PBH Client <no-reply@emails.liaisonit.com>';
  const EMAIL_TO = process.env.EMAIL_TO || 'shravanikhurpe11@gmail.com';

  if (!RESEND_API_KEY) {
    return res.status(500).json({ success: false, error: 'Missing RESEND_API_KEY environment variable.' });
  }

  const { subject, htmlContent, attachments, to } = req.body;
  
  // Use the email provided in the form, otherwise fallback to the admin email
  const recipientEmail = EMAIL_TO;

  try {
    const payload = {
      from: EMAIL_FROM,
      to: recipientEmail,
      subject: subject,
      html: htmlContent
    };

    if (attachments && attachments.length > 0) {
      payload.attachments = attachments;
    }

    const response = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${RESEND_API_KEY}`
      },
      body: JSON.stringify(payload)
    });

    const data = await response.json();
    if (!response.ok) {
      throw new Error(data.message || 'Failed to send email via Resend');
    }
    return res.status(200).json({ success: true, data });
  } catch (error) {
    console.error('Error in send-email API:', error);
    return res.status(500).json({ success: false, error: error.message });
  }
}
