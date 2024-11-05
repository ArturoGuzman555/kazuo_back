import { Injectable } from '@nestjs/common';
import * as PDFDocument from 'pdfkit';
import { createTransport } from 'nodemailer';

@Injectable()
export class InformesService {
  async generarPdf(informe: any): Promise<Buffer> {
    return new Promise((resolve, reject) => {
      if (!informe.datos || informe.datos.length === 0) {
        console.log('No hay datos para generar el PDF');
        reject(new Error('No hay datos para generar el PDF'));
        return;
      }

      const pdf = new PDFDocument({
        size: 'A4',
        layout: 'landscape',
        margin: 20,
      });
      const chunks: Buffer[] = [];

      pdf.on('data', (chunk) => chunks.push(chunk));
      pdf.on('end', () => {
        const pdfBuffer = Buffer.concat(chunks);
        console.log('Tamaño del PDF generado:', pdfBuffer.length, 'bytes');
        resolve(pdfBuffer);
      });
      pdf.on('error', (err) => reject(err));

      // Configuración de estilos
      const titleFont = 'Helvetica-Bold';
      const textFont = 'Helvetica';
      const titleFontSize = 14;
      const headerFontSize = 8;
      const textFontSize = 6;
      const lineColor = '#000000';
      const headerBgColor = '#f0f0f0';

      // Añadir título
      pdf
        .font(titleFont)
        .fontSize(titleFontSize)
        .fillColor(lineColor)
        .text(`Informe de ${informe.tipo}`, { align: 'center' });
      pdf.moveDown();

      // Definir columnas y anchos
      const columns = [
        { header: 'Nombre', width: 70 },
        { header: 'Cantidad', width: 40 },
        { header: 'Unidad', width: 40 },
        { header: 'Cap. Almac.', width: 50 },
        { header: 'Precio Compra', width: 60 },
        { header: 'Moneda', width: 40 },
        { header: 'Precio Venta', width: 60 },
        { header: 'Stock Mín.', width: 40 },
      ];

      const tableWidth = columns.reduce((sum, column) => sum + column.width, 0);
      const startX = (pdf.page.width - tableWidth) / 2;
      let xPosition = startX;
      let yPosition = pdf.y;

      // Función para dibujar los encabezados con bordes y centrados
      const drawHeaders = () => {
        xPosition = startX;
        const headerHeight = 15;

        columns.forEach((column) => {
          pdf
            .fillColor(headerBgColor)
            .rect(xPosition, yPosition, column.width, headerHeight)
            .fill();
          pdf.fillColor(lineColor).font(titleFont).fontSize(headerFontSize);
          pdf.text(
            column.header,
            xPosition,
            yPosition + headerHeight / 2 - headerFontSize / 2,
            {
              width: column.width,
              align: 'center',
            },
          );
          pdf.rect(xPosition, yPosition, column.width, headerHeight).stroke();
          xPosition += column.width;
        });
        yPosition += headerHeight;
      };

      // Dibujar encabezados
      drawHeaders();

      // Dibujar filas de datos con celdas y contenido centrado
      pdf.font(textFont).fontSize(textFontSize).fillColor(lineColor);

      const maxRowsPerPage = Math.floor(
        (pdf.page.height - yPosition - 50) / 15,
      );
      const datos = informe.datos.slice(0, maxRowsPerPage);

      datos.forEach((dato) => {
        xPosition = startX;
        const rowHeight = 15;

        pdf.fillColor(lineColor);
        columns.forEach((column) => {
          let value = '';
          switch (column.header) {
            case 'Nombre':
              value = dato.name;
              break;
            case 'Cantidad':
              value = dato.quantity.toString();
              break;
            case 'Unidad':
              value = dato.unids;
              break;
            case 'Cap. Almac.':
              value = dato.maxCapacity.toString();
              break;
            case 'Precio Compra':
              value = dato.inPrice.toString();
              break;
            case 'Moneda':
              value = dato.bange;
              break;
            case 'Precio Venta':
              value = dato.outPrice.toString();
              break;
            case 'Stock Mín.':
              value = dato.minStock.toString();
              break;
          }

          // Centrar el texto en la celda horizontal y verticalmente
          pdf.text(
            value,
            xPosition,
            yPosition + rowHeight / 2 - textFontSize / 2,
            {
              width: column.width,
              align: 'center',
            },
          );
          pdf.rect(xPosition, yPosition, column.width, rowHeight).stroke();
          xPosition += column.width;
        });

        yPosition += rowHeight;
      });

      // Añadir pie de página
      pdf
        .font(textFont)
        .fontSize(8)
        .fillColor(lineColor)
        .text(
          `Informe generado el ${new Date().toLocaleString()}`,
          30,
          pdf.page.height - 30,
          { align: 'center' },
        );

      pdf.end();
    });
  }

  // La función enviarCorreoElectronico permanece sin cambios
  async enviarCorreoElectronico(pdf: Buffer) {
    const transporter = createTransport({
      host: 'smtp.gmail.com',
      port: 587,
      secure: false,
      auth: {
        user: process.env.MAIL_USER,
        pass: process.env.MAIL_PASS,
      },
      logger: true,
      debug: true,
    });

    const mailOptions = {
      from: '"Kazuo" <kazuoflaias@gmail.com>',
      to: 'xsaul.ortizx@gmail.com',
      subject: 'Informe generado',
      text: 'Adjunto encontrarás el informe generado.',
      attachments: [
        {
          filename: 'informe.pdf',
          content: pdf,
        },
      ],
    };

    try {
      const info = await transporter.sendMail(mailOptions);
      console.log('Correo enviado exitosamente');
      console.log('Información de envío:', info);
      return info;
    } catch (error) {
      console.error('Error al enviar el correo:', error);
      throw error;
    }
  }
}
