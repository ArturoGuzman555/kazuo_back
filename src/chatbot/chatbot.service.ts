import { Injectable } from '@nestjs/common';
import { CreateCompanyDto } from 'src/company/company.dto';
import { CompanyService } from 'src/company/company.service';
import { CreateProductDto } from 'src/modules/product/dto/create-product.dto';
import { ProductService } from 'src/modules/product/product.service';


@Injectable()
export class ChatBotService {
  constructor(
    private readonly companyService: CompanyService,
    private readonly productService: ProductService,
  ) {}

  async handleChatQuery(message: string, userId: string) {
    const lowerMessage = message.toLowerCase();

    if (lowerMessage.includes('crear empresa')) {
      return {
        prompt: 'Por favor, proporcione los datos para registrar la empresa (nombre, país, dirección, etc.).',
        expectedInput: CreateCompanyDto,
      };
    }

    if (lowerMessage.includes('crear producto')) {
      return {
        prompt: 'Por favor, proporcione los datos para crear el producto (nombre, precio, id de la bodega, etc.).',
        expectedInput: CreateProductDto,
      };
    }

    return { prompt: 'Lo siento, no entendí la solicitud.' };
  }
}
