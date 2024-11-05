import {
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { DataSource, Repository } from 'typeorm';
import { Provider } from 'src/Entities/providers.entity';
import { ProductService } from 'src/modules/product/product.service';

@Injectable()
export class ProvidersRepository extends Repository<Provider> {
  constructor(
    private readonly dataSource: DataSource,
    private readonly productsService: ProductService,
  ) {
    super(Provider, dataSource.createEntityManager());
  }

  async getAllProviders(): Promise<Provider[]> {
    return this.find({ relations: ['products', 'users'] });
  }

  async createProvider(provider: Partial<Provider>): Promise<Provider> {
    return this.save(provider);
  }

  async addProductToProvider(
    providerId: string,
    productId: string,
  ): Promise<void> {
    const provider = await this.findOne({
      where: { id: providerId },
      relations: ['products'],
    });

    if (!provider) {
      throw new NotFoundException('Proveedor no encontrado');
    }

    // Asegura que el proveedor tenga una lista de productos
    if (!provider.products) {
      provider.products = [];
    }

    // Verifica si el producto ya está asociado
    if (!provider.products.some((product) => product.id === productId)) {
      const product = await this.productsService.findOne(productId); // Llama a findOne en ProductService

      if (!product) {
        throw new NotFoundException(
          `Producto con ID ${productId} no encontrado`,
        );
      }

      provider.products.push(product);
      await this.save(provider);
    } else {
      throw new ConflictException(
        'El producto ya está asociado a este proveedor',
      );
    }
  }
}
