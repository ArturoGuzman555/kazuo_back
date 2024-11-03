import {
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { CreateStoreDto } from './dto/create-store.dto';
import { UpdateStoreDto } from './dto/update-store.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Store } from 'src/Entities/store.entity';
import { Repository } from 'typeorm';
import { Category } from 'src/Entities/category.entity';
import { Users } from 'src/Entities/users.entity';

@Injectable()
export class StoreService {
  constructor(
    @InjectRepository(Store)
    private readonly storeRepository: Repository<Store>,
    @InjectRepository(Category)
    private readonly categoryRepository: Repository<Category>,
  ) {}

  async create(createStore: CreateStoreDto, request: any) {
    const user: Users = request.user;

    const bodega = await this.storeRepository.findOne({
      where: { name: createStore.name },
    });

    if (bodega) {
      throw new ConflictException('La bodega ya existe');
    }

    const category = await this.categoryRepository.findOne({
      where: { name: createStore.categoryName },
    });

    if (!category) {
      throw new NotFoundException('La categoría no existe');
    }

    const newBodega = this.storeRepository.create({
      name: createStore.name,
      category: category,
      user: { id: createStore.userId },
      createdAt: new Date(),
    });

    await this.storeRepository.save(newBodega);
    return { message: 'La bodega fue creada exitosamente', newBodega };
  }

  async findAll() {
    const hola = await this.storeRepository.find({
      relations: { category: true },
    });
    return hola.map(({ category, ...rest }) => ({
      ...rest,
      categoryId: category.id,
    }));
  }

  async findAllStores(userId: string) {
    const stores = await this.storeRepository.find({
      where: { user: { id: userId } },
      relations: ['category'],
    });

    if (!stores.length) {
      throw new NotFoundException(
        `La bodega con  id ${userId} no fue encontrada`,
      );
    }

    return stores.map(({ category, ...rest }) => ({
      ...rest,
      categoryId: category.id,
    }));
  }

  async findOne(id: string) {
    const storeFound = await this.storeRepository.findOne({
      where: { id },
      relations: ['category'],
    });

    if (!storeFound) {
      throw new NotFoundException(`La bodega con ${id} no fue encontrada`);
    }

    return { message: 'Bodega encontrada', storeFound };
  }

  async update(id: string, updateStore: UpdateStoreDto) {
    const storeFound = await this.storeRepository.findOne({ where: { id } });

    if (!storeFound) {
      throw new NotFoundException('La bodega no fue encontrada');
    }

    const category = await this.categoryRepository.findOne({
      where: { name: updateStore.categoryName },
    });

    if (!category) {
      throw new NotFoundException('La categoría no existe');
    }

    const newStore = { ...storeFound, ...updateStore, category: category };

    await this.storeRepository.save(newStore);

    return {
      message: 'Bodega modificada exitosamente',
      name: newStore.name,
      categoryId: newStore.category.id,
    };
  }

  async remove(id: string) {
    const storeFound = await this.storeRepository.findOne({ where: { id } });

    if (!storeFound) {
      throw new NotFoundException('La bodega no existe');
    }

    const products = await this.storeRepository.findOne({
      where: { id },
      relations: ['products'],
    });

    if (products && products.products.length > 0) {
      throw new ConflictException(
        'No se puede eliminar la tienda porque contiene productos',
      );
    }

    const deleteUser = await this.storeRepository.delete(storeFound);
    return { message: 'La bodega fue eliminada exitosamente', deleteUser };
  }

  async findByUserId(userId: string) {
    const stores = await this.storeRepository.find({
      where: { user: { id: userId } },
      relations: ['category'],
    });

    if (!stores.length) {
      throw new NotFoundException(`No stores found for user with ID ${userId}`);
    }

    return stores.map(({ category, ...rest }) => ({
      ...rest,
      categoryId: category.id,
    }));
  }
}
