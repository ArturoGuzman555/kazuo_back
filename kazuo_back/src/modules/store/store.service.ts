import {
  BadRequestException,
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

@Injectable()
export class StoreService {
  constructor(
    @InjectRepository(Store)
    private readonly storeRepository: Repository<Store>,
    @InjectRepository(Category)
    private readonly categoryRepository: Repository<Category>,
  ) {}

  async create(createStore: CreateStoreDto) {
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
    });

    await this.storeRepository.save(newBodega);
    return newBodega;
  }

  async findAll() {
    return await this.storeRepository.find();
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

    const storeName = await this.storeRepository.findOne({
      where: { name: updateStore.name },
    });

    if (storeName) {
      throw new BadRequestException('El nombre de bodega ya existe');
    }

    const newStore = { ...storeFound, ...updateStore };
    await this.storeRepository.save(newStore);
    return { message: 'Bodega modificada exitosamente', newStore };
  }

  async remove(id: string) {
    const storeFound = await this.storeRepository.findOne({ where: { id } });

    if (!storeFound) {
      throw new NotFoundException('La bodega no existe');
    }

    const deleteUser = await this.storeRepository.delete(storeFound);
    return { message: 'La bodega fue eliminada exitosamente', deleteUser };
  }
}
