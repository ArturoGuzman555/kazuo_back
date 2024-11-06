import { Injectable, NotFoundException } from '@nestjs/common';
import { CompanyService } from 'src/company/company.service';
import { ProductService } from 'src/modules/product/product.service';
import { StoreService } from 'src/modules/store/store.service'; // Importa el servicio de tienda

@Injectable()
export class ChatBotService {
  constructor(
    private readonly companyService: CompanyService,
    private readonly productService: ProductService,
    private readonly storeService: StoreService, // Inyecta el servicio de tienda
  ) {}

  async handleChatQuery(message: string, userId: string) {
    const lowerMessage = message.toLowerCase();

    // Saludo inicial y menú de opciones
    if (
      !lowerMessage.includes('crear empresa') &&
      !lowerMessage.includes('crear producto') &&
      !lowerMessage.includes('consultar mi bodega') &&
      !lowerMessage.includes('agregar producto') &&
      !lowerMessage.includes('consultar información de mi compañía') &&
      !lowerMessage.includes('consultar proveedores') &&
      !lowerMessage.includes('agregar proveedor') &&
      !lowerMessage.includes('agregar usuario') &&
      !lowerMessage.includes('eliminar producto') &&
      !lowerMessage.includes('hacer ciclicos')
    ) {
      return {
        prompt: `Hola, soy tu asistente Kazuo. ¿En qué te puedo ayudar el día de hoy?\n\nOpciones disponibles:\n1. Consultar mi bodega\n2. Agregar producto a mi bodega\n3. Consultar información de mi compañía\n4. Consultar proveedores\n5. Agregar proveedor\n6. Agregar usuario a mi compañía\n7. Eliminar un producto\n8. Hacer cíclicos\n\nPor favor, escribe el número o el nombre de la opción que deseas.`,
      };
    }

    // Opción para consultar la bodega
    if (lowerMessage.includes('consultar mi bodega')) {
      try {
        const stores = await this.storeService.findAllStores(userId);
        if (stores.length) {
          return {
            prompt: `Aquí tienes la información de tu(s) bodega(s):`,
            data: stores, // Devolvemos los datos de las bodegas
          };
        }
      } catch (error) {
        if (error instanceof NotFoundException) {
          return { prompt: error.message };
        }
        return { prompt: 'Hubo un problema al consultar la bodega.' };
      }
    }

    // Otros casos específicos se mantienen sin cambios
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

    // ... (resto de los casos de handleChatQuery)

    return { prompt: 'Lo siento, no entendí la solicitud.' };
  }
}

