import { Injectable } from '@nestjs/common';
import { CreateCategoryDto } from './dto/create-category.dto';
import { UpdateCategoryDto } from './dto/update-category.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Category } from 'src/Entities/category.entity';
import { Repository } from 'typeorm';

@Injectable()
export class CategoryService {
  constructor(
    @InjectRepository(Category)
    private readonly categoryRepository: Repository<Category>,
  ) {}

  async create(createCategory: CreateCategoryDto) {
    const categoryName = createCategory.name.trim().toLocaleLowerCase();
    const categoryFound = await this.categoryRepository.findOne({
      where: { name: categoryName },
    });

    if (categoryFound) {
      return { message: 'La categoría ya existe', category: categoryFound };
    }

    const newCategory = new Category();
    newCategory.name = categoryName;

    const savedCategory = await this.categoryRepository.save(newCategory);
    return savedCategory;
  }

  async findAll() {
    return await this.categoryRepository.find();
  }

  findOne(id: string) {
    return `This action returns a #${id} category`;
  }

  update(id: string, updateCategoryDto: UpdateCategoryDto) {
    return `This action updates a #${id} category`;
  }

  remove(id: string) {
    return `This action removes a #${id} category`;
  }
}
