import { ConflictException, Injectable, NotFoundException } from '@nestjs/common';
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

  findAll() {
    return `This action returns all store`;
  }

  findOne(id: number) {
    return `This action returns a #${id} store`;
  }

  update(id: number, updateStoreDto: UpdateStoreDto) {
    return `This action updates a #${id} store`;
  }

  remove(id: number) {
    return `This action removes a #${id} store`;
  }
}
