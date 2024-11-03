import { Controller, Post, Body } from '@nestjs/common';
import { InformesService } from './informes.service';

@Controller('informes')
export class InformesController {
  constructor(private readonly informesService: InformesService) {}

  @Post()
  async generarInforme(@Body() informe: any) {
    const pdf = await this.informesService.generarPdf(informe);
    await this.informesService.enviarCorreoElectronico(pdf);
<<<<<<< HEAD:kazuo_back/src/modules/informes/informes.controller.ts
    return { message: 'Informe generado y enviado con éxito' };
  }
}
=======
    return { message: 'Informe generado y enviado con éxito' };
  }
}
>>>>>>> 97a57f209f5fdbf5459fec1fe35715bac56cdb4c:src/modules/informes/informes.controller.ts
