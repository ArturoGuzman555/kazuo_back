import { Injectable, NotFoundException } from '@nestjs/common';
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
    return { message: 'Categoría creada exitosamente', savedCategory };
  }

  async findAll() {
    return await this.categoryRepository.find();
  }

  async findOne(id: string) {
    const categoryFound = await this.categoryRepository.findOne({
      where: { id },
    });

    if (!categoryFound) throw new NotFoundException('Categoría no encontrada');

    return categoryFound;
  }

  async update(id: string, updateCategory: UpdateCategoryDto) {
    const categoryFound = await this.categoryRepository.findOne({
      where: { id },
    });

    if (!categoryFound) throw new NotFoundException('Categoría no encontrada');

    const newCategory = { ...categoryFound, ...updateCategory };
    await this.categoryRepository.save(newCategory);
    return { message: 'Categoría modificada exitosamente', newCategory };
  }

  async remove(id: string) {
    const categoryDelete = await this.categoryRepository.findOne({
      where: { id },
    });

    if (!categoryDelete) throw new NotFoundException('Categoría no encontrada');

    await this.categoryRepository.remove(categoryDelete);
    return { message: `La Categoría con el ID: ${id} fue eliminado` };
  }
}
