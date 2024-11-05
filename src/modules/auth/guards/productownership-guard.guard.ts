import {
  CanActivate,
  ExecutionContext,
  Injectable,
  NotFoundException,
  ForbiddenException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Product } from 'src/Entities/product.entity';
import { Repository } from 'typeorm';

@Injectable()
export class ProductOwnershipGuard implements CanActivate {
  constructor(
    @InjectRepository(Product)
    private productsRepository: Repository<Product>,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();
    const user = request.user || request.user.param.id;
    const productId = request.body.id || request.params.id;

    if (!user) {
      throw new ForbiddenException('No autorizado');
    }

    const product = await this.productsRepository.findOne({
      where: { id: productId },
      relations: ['user'],
    });

    if (!product) {
      throw new NotFoundException('Este producto no fue encontrado');
    }

    if (product.user.id !== user.id) {
      throw new ForbiddenException(
        'No tienes permiso para modificar este producto',
      );
    }

    return true;
  }
}
