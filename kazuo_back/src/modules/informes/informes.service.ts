import { Injectable } from '@nestjs/common';
// import { Pdfkit } from 'pdfkit';
import * as pdfkit from 'pdfkit';
import { createTransport } from 'nodemailer';

@Injectable()
export class InformesService {
  async generarPdf(informe: any) {
    return new Promise<Buffer>((resolve, reject) => {
    const pdf = new pdfkit();
    const chunks: Buffer[] = [];
    pdf.on('data', (chunk) => chunks.push(chunk));
    pdf.on('end', () => resolve(Buffer.concat(chunks)));
    pdf.on('error', reject);

    pdf.fontSize(24).text('informe de ${informe.tipo}', 100, 100);
    pdf.fontSize(18).text('Datos: ${JSON.stringify(informe.datos)}', 100, 150);
    // return await pdf.toBuffer();
    pdf.end();
  });
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
      to: '"Kazuo" <fmrigueros91@gmail.com>',
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