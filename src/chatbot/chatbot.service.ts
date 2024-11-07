import { Injectable, NotFoundException } from '@nestjs/common';
import { CompanyService } from 'src/company/company.service';
import { ProductService } from 'src/modules/product/product.service';
import { StoreService } from 'src/modules/store/store.service'; 
import { CategoryService } from 'src/modules/category/category.service';
import { UsersService } from 'src/modules/users/users.service';
@Injectable()
export class ChatBotService {
  private isFirstMessage: boolean = true;
  private lastActivityTime: number = Date.now();
  private readonly INACTIVITY_TIMEOUT = 5 * 60 * 1000;
  constructor(
    private readonly companyService: CompanyService,
    private readonly productService: ProductService,
    private readonly storeService: StoreService, 
    private readonly categoryService: CategoryService,
    private readonly userService: UsersService,
  ) {}

  private checkInactivity(): boolean {
    const currentTime = Date.now();
    if (currentTime - this.lastActivityTime > this.INACTIVITY_TIMEOUT) {
      this.isFirstMessage = true;
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
    if (lowerMessage.includes('categorias')) {
      try {
        const categories = await this.categoryService.findAll();
        return {
          prompt: 'Aquí tienes las categorías disponibles:',
          data: categories,
        };
      } catch (error) {
        return { prompt: 'Hubo un problema al consultar las categorías.' };
      }
    }

    if (lowerMessage.includes('mi información') || lowerMessage.includes('mis datos')) {
      try {
        const user = await this.userService.getUserById(userId);
        return {
          prompt: 'Aquí está user'
        };
      } catch (error) {
        return { prompt: 'No se pudo obtener tu información.' };
      }
    }

   


    return { prompt: 'Lo siento, no entendí la solicitud.' };
  }
}

