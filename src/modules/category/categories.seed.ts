import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Category } from 'src/Entities/category.entity';
import { In, Repository } from 'typeorm';
import { categoriesMock } from './categories-mock';

@Injectable()
export class CategoriesSeed {
  constructor(
    @InjectRepository(Category)
    private readonly categoryRepository: Repository<Category>,
  ) {}

  async seed() {
    const existingCategory = await this.categoryRepository.find({
      where: { name: In(categoriesMock) },
    });
    for (const categoryName of categoriesMock) {
      if (
        !existingCategory.some((category) => category.name === categoryName)
      ) {
        const newCategory = new Category();
        newCategory.name = categoryName;
        await this.categoryRepository.save(newCategory);
      }
    }
  }
}
