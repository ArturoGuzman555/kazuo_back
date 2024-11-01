import { Controller, Post, Body } from '@nestjs/common';
import { InformesService } from './informes.service';

@Controller('informes')
export class InformesController {
  constructor(private readonly informesService: InformesService) {}

  @Post()
  async generarInforme(@Body() informe: any) {
    const pdf = await this.informesService.generarPdf(informe);
    await this.informesService.enviarCorreoElectronico(pdf);
    return { message: 'Informe generado y enviado con éxito' };
  }
}
