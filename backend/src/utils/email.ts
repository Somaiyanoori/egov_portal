import nodemailer, { Transporter } from 'nodemailer';
import { env, isDevelopment } from '../config/env.js';
import { logger } from '../config/logger.js';

interface EmailOptions {
  to: string;
  subject: string;
  html: string;
  text?: string;
}

class EmailService {
  private transporter: Transporter | null = null;
  private initialized = false;

  private async initialize(): Promise<void> {
    if (this.initialized) return;

    // If no email credentials in dev, use Ethereal (fake SMTP for testing)
    if (isDevelopment && (!env.EMAIL_USER || env.EMAIL_USER === 'your_email@gmail.com')) {
      logger.warn('📧 No email credentials configured. Using Ethereal for testing.');
      const testAccount = await nodemailer.createTestAccount();
      this.transporter = nodemailer.createTransport({
        host: 'smtp.ethereal.email',
        port: 587,
        secure: false,
        auth: {
          user: testAccount.user,
          pass: testAccount.pass,
        },
      });
    } else {
      this.transporter = nodemailer.createTransport({
        host: env.EMAIL_HOST,
        port: env.EMAIL_PORT,
        secure: env.EMAIL_SECURE,
        auth: {
          user: env.EMAIL_USER,
          pass: env.EMAIL_PASSWORD,
        },
      });
    }

    this.initialized = true;
  }

  async send(options: EmailOptions): Promise<void> {
    try {
      await this.initialize();
      if (!this.transporter) throw new Error('Email transporter not initialized');

      const info = await this.transporter.sendMail({
        from: `"${env.EMAIL_FROM_NAME}" <${env.EMAIL_FROM_ADDRESS}>`,
        to: options.to,
        subject: options.subject,
        text: options.text,
        html: options.html,
      });

      logger.info(`📧 Email sent: ${info.messageId}`);

      // Show preview URL for Ethereal
      const previewUrl = nodemailer.getTestMessageUrl(info);
      if (previewUrl) {
        logger.info(`📧 Preview: ${previewUrl}`);
      }
    } catch (error) {
      logger.error('❌ Email send failed:', error);
      // Don't throw in production to avoid blocking user flow
      if (isDevelopment) throw error;
    }
  }

  async sendVerificationEmail(to: string, name: string, token: string): Promise<void> {
    const verifyUrl = `${env.FRONTEND_URL}/verify-email?token=${token}`;
    await this.send({
      to,
      subject: 'Verify your E-Gov Portal account',
      html: this.getVerificationTemplate(name, verifyUrl),
    });
  }

  async sendPasswordResetEmail(to: string, name: string, token: string): Promise<void> {
    const resetUrl = `${env.FRONTEND_URL}/reset-password?token=${token}`;
    await this.send({
      to,
      subject: 'Reset your E-Gov Portal password',
      html: this.getPasswordResetTemplate(name, resetUrl),
    });
  }

  async sendWelcomeEmail(to: string, name: string): Promise<void> {
    await this.send({
      to,
      subject: 'Welcome to E-Gov Portal! 🎉',
      html: this.getWelcomeTemplate(name),
    });
  }

  private getBaseTemplate(content: string): string {
    return `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="utf-8">
        <style>
          body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif; line-height: 1.6; color: #333; margin: 0; padding: 0; background: #f4f7fa; }
          .container { max-width: 600px; margin: 40px auto; background: white; border-radius: 12px; overflow: hidden; box-shadow: 0 4px 20px rgba(0,0,0,0.08); }
          .header { background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); padding: 40px 30px; text-align: center; }
          .header h1 { color: white; margin: 0; font-size: 28px; }
          .content { padding: 40px 30px; }
          .button { display: inline-block; padding: 14px 32px; background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white !important; text-decoration: none; border-radius: 8px; font-weight: 600; margin: 20px 0; }
          .footer { padding: 30px; text-align: center; color: #666; font-size: 14px; background: #f9fafb; }
          .code { background: #f3f4f6; padding: 12px; border-radius: 6px; font-family: monospace; word-break: break-all; margin: 10px 0; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h1>🏛️ E-Gov Portal</h1>
          </div>
          <div class="content">${content}</div>
          <div class="footer">
            © ${new Date().getFullYear()} E-Gov Portal. All rights reserved.<br>
            This is an automated email, please do not reply.
          </div>
        </div>
      </body>
      </html>
    `;
  }

  private getVerificationTemplate(name: string, url: string): string {
    return this.getBaseTemplate(`
      <h2>Hello ${name}! 👋</h2>
      <p>Welcome to E-Gov Portal! Please verify your email address to activate your account.</p>
      <div style="text-align: center;">
        <a href="${url}" class="button">Verify Email Address</a>
      </div>
      <p>Or copy and paste this link into your browser:</p>
      <div class="code">${url}</div>
      <p style="color: #666; font-size: 14px;">This link will expire in 24 hours.</p>
      <p style="color: #666; font-size: 14px;">If you didn't create an account, you can safely ignore this email.</p>
    `);
  }

  private getPasswordResetTemplate(name: string, url: string): string {
    return this.getBaseTemplate(`
      <h2>Hello ${name}! 🔐</h2>
      <p>We received a request to reset your password. Click the button below to create a new password:</p>
      <div style="text-align: center;">
        <a href="${url}" class="button">Reset Password</a>
      </div>
      <p>Or copy and paste this link into your browser:</p>
      <div class="code">${url}</div>
      <p style="color: #666; font-size: 14px;"><strong>This link will expire in 1 hour.</strong></p>
      <p style="color: #dc2626; font-size: 14px;">⚠️ If you didn't request this, please ignore this email or contact support if you have concerns.</p>
    `);
  }

  private getWelcomeTemplate(name: string): string {
    return this.getBaseTemplate(`
      <h2>Welcome to E-Gov Portal, ${name}! 🎉</h2>
      <p>Your account has been successfully verified. You can now access all our digital government services.</p>
      <h3>What you can do:</h3>
      <ul>
        <li>📄 Apply for government services online</li>
        <li>🔔 Track your applications in real-time</li>
        <li>💳 Make secure payments</li>
        <li>📱 Get instant notifications</li>
      </ul>
      <div style="text-align: center;">
        <a href="${env.FRONTEND_URL}/login" class="button">Get Started</a>
      </div>
      <p>If you have any questions, our support team is here to help!</p>
    `);
  }
}

export const emailService = new EmailService();
