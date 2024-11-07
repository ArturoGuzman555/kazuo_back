import { Injectable, NotFoundException } from '@nestjs/common';
import { CompanyService } from 'src/company/company.service';
import { ProductService } from 'src/modules/product/product.service';
import { StoreService } from 'src/modules/store/store.service'; 
@Injectable()
export class ChatBotService {
  private isFirstMessage: boolean = true;
  private lastActivityTime: number = Date.now();
  private readonly INACTIVITY_TIMEOUT = 5 * 60 * 1000;
  constructor(
    private readonly companyService: CompanyService,
    private readonly productService: ProductService,
    private readonly storeService: StoreService, 
  ) {}

  private checkInactivity(): boolean {
    const currentTime = Date.now();
    if (currentTime - this.lastActivityTime > this.INACTIVITY_TIMEOUT) {
      this.isFirstMessage = true;
      return true;
    }
    this.lastActivityTime = currentTime;
    return false;
  }

  async handleChatQuery(message: string, userId: string) {
    if (this.checkInactivity()) {
      return {
        prompt: `El chat se ha reiniciado debido a inactividad. Hola, soy R2D2-K tu asistente en Kazuo. ¿En qué te puedo ayudar el día de hoy?\n\nOpciones disponibles:\n1. Consultar mi bodega\n2. Agregar producto a mi bodega\n3. Consultar información de mi compañía\n4. Consultar proveedores\n5. Agregar proveedor\n6. Agregar usuario a mi compañía\n7. Eliminar un producto\n8. Hacer cíclicos\n\nPor favor, escribe el número o el nombre de la opción que deseas.`,
      };
    }
    const lowerMessage = message.toLowerCase();

   
    if (this.isFirstMessage) {
      this.isFirstMessage = false;
      return {
        prompt: `Hola, soy R2D2-K tu asistente en Kazuo. ¿En qué te puedo ayudar el día de hoy?\n\nOpciones disponibles:\n1. Consultar mi bodega\n2. Agregar producto a mi bodega\n3. Consultar información de mi compañía\n4. Consultar proveedores\n5. Agregar proveedor\n6. Agregar usuario a mi compañía\n7. Eliminar un producto\n8. Hacer cíclicos\n\nPor favor, escribe el número o el nombre de la opción que deseas.`,
      };
    }

    if (lowerMessage.includes('bodegas')) {
      try {
        const stores = await this.storeService.findAllStores(userId);
        if (stores.length > 0) {
          return {
            prompt: `Aquí tienes la información de tu(s) bodega(s):`,
            data: stores, 
          };
        } else {
          return { prompt: 'Aún no tienes bodegas registradas.' };
        }
      } catch (error) {
        if (error instanceof NotFoundException) {
          return { prompt: error.message };
        }
        return { prompt: 'Hubo un problema al consultar la bodega.' };
      }
    }

    if (lowerMessage.includes('crear empresa')) {
      return {
        prompt:
          'Por favor, proporcione los datos para registrar la empresa (nombre, país, dirección, etc.).',
      };
    }

    if (lowerMessage.includes('crear producto')) {
      return {
        prompt:
          'Por favor, proporcione los datos para crear el producto (nombre, precio, id de la bodega, etc.).',
      };
    }


    return { prompt: 'Lo siento, no entendí la solicitud.' };
  }
}

