import { ConflictException, Injectable } from '@nestjs/common';
import { DataSource, Repository } from 'typeorm';
import { Provider } from 'src/Entities/providers.entity';

@Injectable()
export class ProvidersRepository extends Repository<Provider> {
  constructor(private dataSource: DataSource) {
    super(Provider, dataSource.createEntityManager());
  }

  async createProvider(provider: Partial<Provider>): Promise<Provider> {
    return this.save(provider);
  }

  async addProductToProvider(providerId: string, productId: number): Promise<void> {
    const provider = await this.findOne({
      where: { id: providerId },
      relations: ['products'],
    });

    if (!provider) {
      throw new Error('Proveedor no encontrado');
    }

    if (!provider.products) {
      provider.products = [];
    }

    if (!provider.products.some((product) => product.id === String(productId))) {

      provider.products.push({ id: productId } as any);
      await this.save(provider);
    } else {
      throw new ConflictException('El producto ya está asociado a este proveedor');
    }
  }
}
