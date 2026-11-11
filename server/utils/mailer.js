const nodemailer = require("nodemailer");

/**
 * Creates Nodemailer transporter when environment variables are configured.
 */
function getTransporter() {
  if (!process.env.EMAIL_USER || !process.env.EMAIL_PASS) {
    return null;
  }

  return nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS
    }
  });
}

/**
 * Sends 6-digit OTP verification email for account signup.
 */
async function sendOtpEmail(email, name, otp) {
  const transporter = getTransporter();

  if (!transporter) {
    console.warn(
      `⚠️ [EMAIL NOTICE] Nodemailer is not configured (EMAIL_USER or EMAIL_PASS missing). OTP for ${email} is: [${otp}]. Please configure EMAIL_USER and EMAIL_PASS in server/.env or Render dashboard.`
    );
    return { sent: false, reason: "SMTP credentials not configured" };
  }

  try {
    const mailOptions = {
      from: `"Code-a-Nova" <${process.env.EMAIL_USER}>`,
      to: email,
      subject: "Your Account Verification Code - Code-a-Nova",
      text: `Hello ${name},

Your verification OTP code for Code-a-Nova is: ${otp}

This code will expire in 10 minutes. If you did not create an account, please disregard this email.

Best regards,
Code-a-Nova Team`,
      html: `
        <div style="font-family: 'Segoe UI', Arial, sans-serif; background-color: #0b0f19; color: #f3f4f6; padding: 30px; border-radius: 12px; max-width: 520px; margin: 0 auto; border: 1px solid rgba(99, 102, 241, 0.3);">
          <div style="text-align: center; margin-bottom: 25px;">
            <h1 style="color: #a5b4fc; margin: 0; font-size: 26px; letter-spacing: -0.5px;">Code-a-Nova</h1>
            <p style="color: #9ca3af; font-size: 14px; margin-top: 5px;">Annual Hackathon Portal</p>
          </div>
          
          <p style="font-size: 16px;">Hello <strong>${name}</strong>,</p>
          <p style="color: #d1d5db; line-height: 1.5;">Thank you for signing up for Code-a-Nova. Please use the verification code below to activate your account:</p>
          
          <div style="background: rgba(30, 41, 59, 0.9); border: 2px dashed #6366f1; border-radius: 10px; padding: 18px; text-align: center; margin: 25px 0;">
            <span style="font-family: monospace; font-size: 36px; font-weight: 700; color: #38bdf8; letter-spacing: 8px;">${otp}</span>
          </div>
          
          <p style="color: #ef4444; font-size: 13px; margin: 15px 0;">⏳ <strong>Important:</strong> This OTP is valid for <strong>10 minutes</strong> only.</p>
          <p style="color: #9ca3af; font-size: 13px;">If you did not request this verification, no action is needed.</p>
          
          <hr style="border: 0; border-top: 1px solid #374151; margin: 25px 0;" />
          <p style="font-size: 12px; color: #6b7280; text-align: center; margin: 0;">© 2026 Code-a-Nova Hackathon. All rights reserved.</p>
        </div>
      `
    };

    const info = await transporter.sendMail(mailOptions);
    console.log(`✅ [Nodemailer] OTP successfully delivered to ${email} (MessageId: ${info.messageId})`);
    return { sent: true, messageId: info.messageId };
  } catch (error) {
    console.error(`❌ [Nodemailer] Failed to send OTP to ${email}:`, error.message);
    return { sent: false, error: error.message };
  }
}

/**
 * Sends Hackathon Registration Confirmation Email
 */
async function sendRegistrationEmail(email, details) {
  const transporter = getTransporter();

  if (!transporter) {
    console.warn(
      `⚠️ [EMAIL NOTICE] Nodemailer is not configured (EMAIL_USER or EMAIL_PASS missing). Registration saved for ${email}. Please configure EMAIL_USER and EMAIL_PASS to enable confirmation emails.`
    );
    return { sent: false, reason: "SMTP credentials not configured" };
  }

  try {
    const {
      fullName,
      teamName,
      domain,
      projectTitle,
      teamSize,
      registrationId
    } = details;

    const mailOptions = {
      from: `"Code-a-Nova" <${process.env.EMAIL_USER}>`,
      to: email,
      subject: "🎉 Registration Confirmed - Code-a-Nova Hackathon 2026",
      text: `Hello ${fullName},

Your registration for Code-a-Nova Hackathon 2026 has been successfully confirmed!

Event Details:
- Registration ID: ${registrationId}
- Team Name: ${teamName}
- Domain / Track: ${domain}
- Project Name: ${projectTitle}
- Team Size: ${teamSize}
- Submission Deadline: 15 November 2026

Thank you for participating!
Best regards,
Code-a-Nova Team`,
      html: `
        <div style="font-family: 'Segoe UI', Arial, sans-serif; background-color: #0b0f19; color: #f3f4f6; padding: 30px; border-radius: 12px; max-width: 580px; margin: 0 auto; border: 1px solid rgba(99, 102, 241, 0.3);">
          <div style="text-align: center; margin-bottom: 25px;">
            <h1 style="color: #a5b4fc; margin: 0; font-size: 26px;">Code-a-Nova 2026</h1>
            <p style="color: #9ca3af; font-size: 14px; margin-top: 5px;">Registration Confirmation</p>
          </div>

          <h2 style="color: #38bdf8; font-size: 20px; margin: 0 0 10px;">Registration Successful! 🚀</h2>
          <p style="color: #d1d5db; line-height: 1.5;">Hello <strong>${fullName}</strong>, your team <strong>${teamName}</strong> is officially registered for the Code-a-Nova Hackathon.</p>

          <div style="background-color: #111827; border: 1px solid #374151; border-radius: 10px; padding: 18px; margin: 20px 0;">
            <table style="width: 100%; border-collapse: collapse; font-size: 14px;">
              <tr>
                <td style="padding: 8px 0; color: #9ca3af;">Registration ID:</td>
                <td style="padding: 8px 0; font-weight: 600; color: #a5b4fc; font-family: monospace;">${registrationId}</td>
              </tr>
              <tr>
                <td style="padding: 8px 0; color: #9ca3af;">Team Name:</td>
                <td style="padding: 8px 0; font-weight: 600; color: #fff;">${teamName}</td>
              </tr>
              <tr>
                <td style="padding: 8px 0; color: #9ca3af;">Domain / Track:</td>
                <td style="padding: 8px 0; font-weight: 600; color: #38bdf8;">${domain}</td>
              </tr>
              <tr>
                <td style="padding: 8px 0; color: #9ca3af;">Project Name:</td>
                <td style="padding: 8px 0; font-weight: 600; color: #fff;">${projectTitle}</td>
              </tr>
              <tr>
                <td style="padding: 8px 0; color: #9ca3af;">Team Size:</td>
                <td style="padding: 8px 0; font-weight: 600; color: #fff;">${teamSize} Member(s)</td>
              </tr>
              <tr>
                <td style="padding: 8px 0; color: #9ca3af;">Deadline:</td>
                <td style="padding: 8px 0; font-weight: 600; color: #f59e0b;">15 November 2026</td>
              </tr>
            </table>
          </div>

          <p style="color: #9ca3af; font-size: 13px; line-height: 1.5;">
            Please keep your <strong>Registration ID</strong> safe. Further event updates, discord channel links, and submission guidelines will be shared via email.
          </p>

          <hr style="border: 0; border-top: 1px solid #374151; margin: 25px 0;" />
          <p style="font-size: 12px; color: #6b7280; text-align: center; margin: 0;">© 2026 Code-a-Nova Hackathon. All rights reserved.</p>
        </div>
      `
    };

    const info = await transporter.sendMail(mailOptions);
    console.log(`✅ [Nodemailer] Registration email delivered to ${email} (MessageId: ${info.messageId})`);
    return { sent: true, messageId: info.messageId };
  } catch (error) {
    console.error(`❌ [Nodemailer] Failed to send registration email to ${email}:`, error.message);
    return { sent: false, error: error.message };
  }
}

module.exports = {
  sendOtpEmail,
  sendRegistrationEmail
};

