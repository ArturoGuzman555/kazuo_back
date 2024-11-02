import { Injectable } from '@nestjs/common';
import * as pdfkit from 'pdfkit';
import { createTransport } from 'nodemailer';

@Injectable()
export class InformesService {
  async generarPdf(informe: any): Promise<Buffer> {
    if (!informe.datos) {
      console.log("No hay datos para generar el PDF");
      return Buffer.alloc(0); 
    }
  
    const pdf = new pdfkit();
    const chunks: Buffer[] = [];
    pdf.on('data', (chunk) => chunks.push(chunk));
    pdf.on('end', () => {
      const pdfBuffer = Buffer.concat(chunks);
      return pdfBuffer;
    });
    pdf.on('error', (err) => console.error(err));
  
    pdf.fontSize(24).text(`Informe de ${informe.tipo}`, 100, 100);
  
    pdf.fontSize(18).text('Nombre', 100, 150);
    pdf.fontSize(18).text('Cantidad', 250, 150);
    pdf.fontSize(18).text('Unidad de Medida', 350, 150);
    pdf.fontSize(18).text('Capacidad de Almacenamiento', 450, 150);
    pdf.fontSize(18).text('Precio de Compra', 550, 150);
    pdf.fontSize(18).text('Moneda de Uso', 650, 150);
    pdf.fontSize(18).text('Precio de Venta', 750, 150);
    pdf.fontSize(18).text('Cantidad Minima', 850, 150);
  
    informe.datos.forEach((dato, index) => {
      pdf.fontSize(16).text(dato.nombre, 100, 200 + index * 50);
      pdf.fontSize(16).text(dato.cantidad, 250, 200 + index * 50);
      pdf.fontSize(16).text(dato.unidadDeMedida, 350, 200 + index * 50);
      pdf.fontSize(16).text(dato.capacidadDeAlmacenamiento, 450, 200 + index * 50);
      pdf.fontSize(16).text(dato.precioDeCompra, 550, 200 + index * 50);
      pdf.fontSize(16).text(dato.monedaDeUso, 650, 200 + index * 50);
      pdf.fontSize(16).text(dato.precioDeVenta, 750, 200 + index * 50);
      pdf.fontSize(16).text(dato.cantidadMinima, 850, 200 + index * 50);
    });
  
    pdf.end();
    return Buffer.alloc(0); 
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
