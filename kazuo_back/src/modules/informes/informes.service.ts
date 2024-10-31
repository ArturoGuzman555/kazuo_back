import { Injectable } from '@nestjs/common';
import { Pdfkit } from 'pdfkit';
import { createTransport } from 'nodemailer';

@Injectable()
export class InformesService {
  async generarPdf(informe: any) {
    const pdf = new Pdfkit();
    pdf.fontSize(24).text(`Informe de ${informe.tipo}`, 100, 100);
    pdf.fontSize(18).text(`Datos: ${JSON.stringify(informe.datos)}`, 100, 150);
    return await pdf.toBuffer();
  }

  async enviarCorreoElectronico(pdf: Buffer) {
    const transporter = createTransport({
      host: 'smtp.gmail.com',
      port: 587,
      secure: false,
      auth: {
        user: process.env.MAIL_USER,
        pass: process.env.MAIL_PASS,
      },
    });

    const mailOptions = {
      from: '"Kazuo" <kazuoflaias@gmail.com>',
      to: 'correo-electronico-del-usuario@gmail.com',
      subject: 'Informe generado',
      attachments: [
        {
          filename: 'informe.pdf',
          content: pdf,
          encoding: 'base64',
        },
      ],
    };

    await transporter.sendMail(mailOptions);
  }
}