import { Injectable } from '@nestjs/common';
import { configDotenv } from 'dotenv';
import * as nodemailer from 'nodemailer';

configDotenv({ path: '.development.env' });
@Injectable()
export class MailService {
  private transporter;

  constructor() {
    this.transporter = nodemailer.createTransport({
      host: 'smtp.gmail.com',
      port: 587,
      secure: false,
      auth: {
        user: process.env.MAIL_USER,
        pass: process.env.MAIL_PASS,
      },
    });
  }

  async sendMail(to: string, subject: string, text: string) {
    const info = await this.transporter.sendMail({
      from: '"Kazuo" <kazuoflaias@gmail.com>',
      to,
      subject,
      text,
    });
    return info;
  }
}
