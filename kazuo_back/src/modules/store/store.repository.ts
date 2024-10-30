// store.repository.ts
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Store } from '../../Entities/store.entity';

@Injectable()
export class StoreRepository {
  constructor(
    @InjectRepository(Store)
    private readonly storeRepository: Repository<Store>,
  ) {}

  async findById(storeId: string): Promise<Store | undefined> {
    return this.storeRepository.findOne({ where: { id: storeId } });
  }

  async findByName(name: string): Promise<Store | undefined> {
    return this.storeRepository.findOne({ where: { name } });
  }
}
