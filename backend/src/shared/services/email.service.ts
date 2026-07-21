import nodemailer from 'nodemailer';
import { env } from '../../config/env';

class EmailService {
  private transporter: nodemailer.Transporter;

  constructor() {
    this.transporter = nodemailer.createTransport({
      host: env.SMTP_HOST,
      port: env.SMTP_PORT,
      secure: env.SMTP_PORT === 465, // true for 465, false for other ports
      auth: {
        user: env.SMTP_USER,
        pass: env.SMTP_PASS,
      },
    });
  }

  /**
   * Send an email
   * @param to Single email or array of emails
   * @param subject Subject line
   * @param text Plain text body
   * @param html HTML body (optional)
   */
  async sendEmail(to: string | string[], subject: string, text: string, html?: string): Promise<void> {
    try {
      const mailOptions = {
        from: env.SMTP_FROM,
        to: Array.isArray(to) ? to.join(', ') : to,
        subject,
        text,
        html,
      };

      const info = await this.transporter.sendMail(mailOptions);
      console.log(`[EMAIL SERVICE] Email sent to ${mailOptions.to}: ${info.messageId}`);
    } catch (error) {
      console.error('[EMAIL SERVICE] Failed to send email:', error);
      throw error;
    }
  }
}

export const emailService = new EmailService();
