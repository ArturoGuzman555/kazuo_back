import { Controller, Post, Body } from '@nestjs/common';
import { InformesService } from './informes.service';

@Controller('informes')
export class InformesController {
  constructor(private readonly informesService: InformesService) {}

  @Post()
  async generarInforme(@Body() informe: any) {
    console.log('Datos recibidos:', JSON.stringify(informe, null, 2));
    if (!informe || !informe.products || informe.products.length === 0) {
      return {
        message: 'No se proporcionaron datos válidos para generar el PDF',
      };
    }
    try {
      const pdf = await this.informesService.generarPdf({
        tipo: informe.tipo,
        datos: informe.products,
      });
      console.log('PDF generado, tamaño:', pdf.length, 'bytes');
      const emailInfo = await this.informesService.enviarCorreoElectronico(pdf);
      return {
        message: 'Informe generado y enviado con éxito',
        emailInfo: emailInfo,
      };
    } catch (error) {
      console.error('Error al generar o enviar el informe:', error);
      return {
        message: 'Error al generar o enviar el informe',
        error: error.message,
        stack: error.stack,
      };
    }
  }
}
