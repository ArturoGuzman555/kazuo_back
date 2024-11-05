import {
  Injectable,
  NotFoundException,
  ConflictException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { ProvidersRepository } from './providers.repository'; // Nuevo repositorio de Providers
import { Product } from 'src/Entities/product.entity';
import { CreateProviderDto } from './providers.dto';
import { Provider } from 'src/Entities/providers.entity';
import { UsersService } from 'src/modules/users/users.service';
import { Repository } from 'typeorm';

@Injectable()
export class ProvidersService {
  constructor(
    private readonly providersRepository: ProvidersRepository,
    @InjectRepository(Product)
    private readonly productRepository: Repository<Product>,
    private readonly usersService: UsersService,
    private readonly providerRepository: ProvidersRepository,
  ) {}

  async getAllProviders(): Promise<Provider[]> {
    return this.providerRepository.find({ relations: ['products', 'users'] });
  }

  async create(createProviderDto: CreateProviderDto): Promise<Provider> {
    const { userId } = createProviderDto;

    const user = await this.usersService.getUserById(userId);
    if (!user) {
      throw new NotFoundException(`Usuario con ID ${userId} no encontrado`);
    }

    const newProvider = this.providersRepository.create({
      ...createProviderDto,
      createdAt: new Date(),
    });

    newProvider.users = [user];

    return await this.providersRepository.save(newProvider);
  }

  async addProductToProvider(
    providerId: string,
    productName: string,
  ): Promise<Provider> {
    const provider = await this.providersRepository.findOne({
      where: { id: providerId },
      relations: ['products'],
    });

    if (!provider) {
      throw new NotFoundException(
        `Proveedor con ID ${providerId} no encontrado`,
      );
    }

    const product = await this.productRepository.findOne({
      where: { name: productName },
    });

    if (!product) {
      throw new NotFoundException(
        `Producto con nombre ${productName} no encontrado`,
      );
    }

    // Revisa si el producto ya está en la lista de productos del proveedor
    if (!provider.products.some((p) => p.id === product.id)) {
      provider.products.push(product);
      await this.providersRepository.save(provider);
    } else {
      throw new ConflictException(
        'El producto ya está asociado a este proveedor',
      );
    }

    return provider;
  }
}
