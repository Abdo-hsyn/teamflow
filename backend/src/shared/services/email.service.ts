import nodemailer from 'nodemailer';

class EmailService {
  private transporter: nodemailer.Transporter;

  constructor() {
    this.transporter = nodemailer.createTransport({
      host: process.env.MAIL_HOST,
      port: Number(process.env.MAIL_PORT),
      auth: {
        user: process.env.MAIL_USER,
        pass: process.env.MAIL_PASS,
      },
    });
  }

  async sendVerificationEmail(
    email: string,
    firstName: string,
    token: string
  ): Promise<void> {
    const verificationUrl = `${process.env.APP_URL}/api/v1/auth/verify-email/${token}`;

    await this.transporter.sendMail({
      from: `"TeamFlow" <${process.env.MAIL_USER}>`,
      to: email,
      subject: 'Verify your TeamFlow account',
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h2 style="color: #2563EB;">Welcome to TeamFlow, ${firstName}!</h2>
          <p>Please verify your email address by clicking the button below:</p>
          <a href="${verificationUrl}" 
             style="background-color: #2563EB; color: white; padding: 12px 24px; 
                    text-decoration: none; border-radius: 6px; display: inline-block;">
            Verify Email
          </a>
          <p>This link will expire in 24 hours.</p>
          <p>If you did not create an account, please ignore this email.</p>
        </div>
      `,
    });
  }

  async sendPasswordResetEmail(
    email: string,
    firstName: string,
    token: string
  ): Promise<void> {
    const resetUrl = `${process.env.APP_URL}/reset-password?token=${token}`;

    await this.transporter.sendMail({
      from: `"TeamFlow" <${process.env.MAIL_USER}>`,
      to: email,
      subject: 'Reset your TeamFlow password',
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h2 style="color: #2563EB;">Password Reset Request</h2>
          <p>Hi ${firstName},</p>
          <p>You requested to reset your password. Click the button below:</p>
          <a href="${resetUrl}" 
             style="background-color: #2563EB; color: white; padding: 12px 24px; 
                    text-decoration: none; border-radius: 6px; display: inline-block;">
            Reset Password
          </a>
          <p>This link will expire in 1 hour.</p>
          <p>If you did not request this, please ignore this email.</p>
        </div>
      `,
    });
  }

  async sendInvitationEmail(
    email: string,
    organizationName: string,
    inviterName: string,
    token: string
  ): Promise<void> {
    const inviteUrl = `${process.env.APP_URL}/invite?token=${token}`;

    await this.transporter.sendMail({
      from: `"TeamFlow" <${process.env.MAIL_USER}>`,
      to: email,
      subject: `You've been invited to join ${organizationName} on TeamFlow`,
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h2 style="color: #2563EB;">You've been invited!</h2>
          <p>${inviterName} has invited you to join <strong>${organizationName}</strong> on TeamFlow.</p>
          <a href="${inviteUrl}" 
             style="background-color: #2563EB; color: white; padding: 12px 24px; 
                    text-decoration: none; border-radius: 6px; display: inline-block;">
            Accept Invitation
          </a>
          <p>This invitation will expire in 7 days.</p>
        </div>
      `,
    });
  }
}

export default new EmailService();