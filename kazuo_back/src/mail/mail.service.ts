import { Injectable } from '@nestjs/common';
import * as nodemailer from 'nodemailer';

@Injectable()
export class MailService {
  private transporter;

  constructor() {
    this.transporter = nodemailer.createTransport({
      host: 'smtp.gmail.com',
      port: 587,
      secure: false,
      auth: {
        user: 'kazuoflaias@gmail.com',
        pass: 'bwtw abwa khef wrhv',
      },
    });
  }

  async sendMail(to: string, subject: string, text: string) {
    const info = await this.transporter.sendMail({
      from: '"My App" <kazuoflaias@gmail.com>',
      to,
      subject,
      text, 
    });

    console.log('Correo enviado: %s', info.messageId);
    return info;
  }
}

