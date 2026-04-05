import { Resend } from 'resend'

const resend = new Resend(process.env.RESEND_API_KEY)

export async function POST(req) {
  try {
    const { email, username } = await req.json()

    await resend.emails.send({
      from: 'Gursimran @ TEFReady <hello@tefready.ca>',
      to: email,
      subject: "Welcome to TEFReady.ca — You're In! 🇨🇦",
      html: `
        <!DOCTYPE html>
        <html>
        <head><meta charset="utf-8"><meta name="viewport" content="width=device-width, initial-scale=1.0"></head>
        <body style="margin:0;padding:0;background:#FFFEF5;font-family:'Segoe UI',Arial,sans-serif;">
          <table width="100%" cellpadding="0" cellspacing="0" style="background:#FFFEF5;padding:40px 16px;">
            <tr><td align="center">
              <table width="100%" cellpadding="0" cellspacing="0" style="max-width:560px;background:white;border-radius:20px;overflow:hidden;box-shadow:0 4px 24px rgba(10,37,64,0.09);border:1.5px solid #E8F0FB;">
                
                <tr>
                  <td style="background:#0A2540;padding:32px 40px;text-align:center;">
                    <span style="color:#E8A020;font-size:22px;font-weight:900;">TEF</span>
                    <span style="color:white;font-size:22px;font-weight:600;">Ready</span>
                    <p style="color:#94A3B8;font-size:13px;margin:8px 0 0 0;">French fluency for Canadian life</p>
                  </td>
                </tr>

                <tr>
                  <td style="padding:40px 40px 32px 40px;">
                    <p style="color:#0A2540;font-size:26px;font-weight:800;margin:0 0 8px 0;">
                      Welcome aboard, ${username}! 🎉
                    </p>
                    <p style="color:#4A5568;font-size:15px;line-height:1.8;margin:0 0 20px 0;">
                      We're genuinely glad you're here.
                    </p>
                    <p style="color:#4A5568;font-size:15px;line-height:1.8;margin:0 0 20px 0;">
                      TEFReady was built for people exactly like you — immigrants working hard toward their Canadian future, taking on the TEF Canada exam as one of the most important steps of that journey. We want to make that preparation feel less overwhelming and a lot more achievable.
                    </p>
                    <p style="color:#4A5568;font-size:15px;line-height:1.8;margin:0 0 20px 0;">
                      Your account is now active. Dive in, explore the lessons, run through the practice exams, and make this a daily habit — even 10 minutes a day moves the needle.
                    </p>

                    <table cellpadding="0" cellspacing="0" style="margin:28px 0;">
                      <tr>
                        <td style="background:#E8A020;border-radius:12px;padding:14px 32px;text-align:center;">
                          <a href="https://www.tefready.ca" style="color:white;font-size:16px;font-weight:700;text-decoration:none;display:block;">
                            Start Learning Now →
                          </a>
                        </td>
                      </tr>
                    </table>

                    <table cellpadding="0" cellspacing="0" width="100%" style="background:#F7F9FC;border-radius:12px;margin-bottom:24px;">
                      <tr>
                        <td style="padding:20px 24px;">
                          <p style="color:#0A2540;font-weight:700;font-size:13px;margin:0 0 10px 0;text-transform:uppercase;letter-spacing:0.5px;">Your Account</p>
                          <p style="color:#4A5568;font-size:14px;margin:0 0 4px 0;">👤 Username: <strong>${username}</strong>