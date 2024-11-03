import { Controller, Post, Body } from '@nestjs/common';
import { InformesService } from './informes.service';

@Controller('informes')
export class InformesController {
  constructor(private readonly informesService: InformesService) {}

  @Post()
  async generarInforme(@Body() informe: any) {
    const pdf = await this.informesService.generarPdf(informe);
    await this.informesService.enviarCorreoElectronico(pdf);
<<<<<<< HEAD:src/modules/informes/informes.controller.ts
    return { message: 'Informe generado y enviado con éxito' };
  }
=======
    return { message: 'Informe generado y enviado con éxito' };
  }
>>>>>>> aec6877a5307a6ec76a5137b38134bf76f8597a9:kazuo_back/src/modules/informes/informes.controller.ts
}
