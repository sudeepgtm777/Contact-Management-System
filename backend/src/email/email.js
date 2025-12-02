import { Resend } from 'resend';

const getResend = () => {
  if (!process.env.RESEND_API_KEY) throw new Error('Missing RESEND_API_KEY');
  return new Resend(process.env.RESEND_API_KEY);
};

const BACKEND_URL = process.env.BACKEND_URL || 'http://localhost:3000';

export const sendVerificationEmail = async (to, token) => {
  const resend = getResend();
  const url = `${BACKEND_URL}/api/auth/verify-email?token=${token}`;

  await resend.emails.send({
    from: process.env.RESEND_VERIFIED_SENDER,
    to,
    subject: 'Verify Your Email',
    html: `
  <div style="font-family: Arial, sans-serif; color: #333; line-height: 1.5; max-width: 600px; margin: auto; padding: 20px; border: 1px solid #eaeaea; border-radius: 8px;">
    <h2 style="color: #1a73e8;">Welcome to Your App!</h2>
    <p>Hi there,</p>
    <p>Thank you for signing up! To get started, please verify your email address by clicking the button below:</p>
    
    <a href="${url}" 
       style="display: inline-block; padding: 12px 24px; margin: 20px 0; background-color: #1a73e8; color: white; text-decoration: none; border-radius: 4px; font-weight: bold;">
       Verify Email
    </a>

    <p>If the button above does not work, copy and paste following link into your browser or click  the following link:</p>
    <p style="word-break: break-all;"><a href="${url}" style="color: #1a73e8;">${url}</a></p>

    <hr style="border: none; border-top: 1px solid #eaeaea; margin: 20px 0;" />

    <p style="font-size: 12px; color: #888;">This link will expire in 1 hour. If you did not sign up for this account, you can safely ignore this email.</p>
  </div>
`,
  });
};

export const sendResetPasswordEmail = async (to, token) => {
  const resend = getResend();
  const url = `${BACKEND_URL}/api/auth/reset-password?token=${token}`;

  await resend.emails.send({
    from: process.env.RESEND_VERIFIED_SENDER,
    to,
    subject: 'Reset Your Password',
    html: `<div style="font-family: Arial, sans-serif; color: #333; line-height: 1.5; max-width: 600px; margin: auto; padding: 20px; border: 1px solid #eaeaea; border-radius: 8px;">
  <h2 style="color: #1a73e8;">Password Reset Request</h2>
  <p>Hi there,</p>
  <p>We received a request to reset your password. Click the button below to set a new password:</p>

  <a href="${url}" 
     style="display: inline-block; padding: 12px 24px; margin: 20px 0; background-color: #1a73e8; color: white; text-decoration: none; border-radius: 4px; font-weight: bold;">
     Reset Password
  </a>

  <p>If the button above does not work, copy and paste the following link into your browser:</p>
  <p style="word-break: break-all;"><a href="${url}" style="color: #1a73e8;">${url}</a></p>

  <hr style="border: none; border-top: 1px solid #eaeaea; margin: 20px 0;" />

  <p style="font-size: 12px; color: #888;">
    This link will expire in 1 hour. If you did not request a password reset, you can safely ignore this email.
  </p>
</div>`,
  });
};
