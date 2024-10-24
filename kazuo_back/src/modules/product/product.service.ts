import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Product } from 'src/Entities/product.entity';
import { Repository } from 'typeorm';
import { Category } from 'src/Entities/category.entity';
import { v2 as Cloudinary } from 'cloudinary';

@Injectable()
export class ProductService {
  constructor(
    @InjectRepository(Product)
    private readonly productsRepository: Repository<Product>,
    @InjectRepository(Category)
    private readonly categoriesRepository: Repository<Category>,
  ) {}

  async create(createProduct: CreateProductDto, file: Express.Multer.File) {
    const category = await this.categoriesRepository.findOne({
      where: { name: createProduct.categoryName },
    });

    if (!category) throw new NotFoundException('Categoría no encontrada');

    const product = await this.productsRepository.findOne({
      where: { name: createProduct.name },
    });

    if (product) {
      throw new NotFoundException('El producto ya existe');
    }

    const uploadResult = await Cloudinary.uploader.upload(file.path, {
      folder: 'products',
    });

    if (file) {
      const newProduct = this.productsRepository.create({
        name: createProduct.name,
        quantity: createProduct.quantity,
        price: createProduct.price,
        imgUrl: uploadResult.secure_url,
        minStock: createProduct.minStock,
        category,
      });

      return await this.productsRepository.save(newProduct);
    }
  }

  async findAll() {
    const all = await this.productsRepository.find({
      relations: ['category'],
    });
    return all;
  }

  async findOne(id: string) {
    return await this.productsRepository.findOne({ where: { id } });
  }

  async update(id: string, updateProduct: UpdateProductDto) {
    const foundProduct = await this.productsRepository.findOne({
      where: { id },
    });

    if (!foundProduct)
      throw new NotFoundException('El producto no fue encontrado');

    const newProduct = { ...foundProduct, ...updateProduct };
    await this.productsRepository.save(updateProduct);
    return newProduct;
  }

  async remove(id: string) {
    const deleteProduct = await this.productsRepository.findOne({
      where: { id },
    });

    if (!deleteProduct) throw new NotFoundException('Producto no encontrado');

    await this.productsRepository.remove(deleteProduct);
    return {
      message: `El producto con el ID: ${id} fue eliminado exitosamente`,
    };
  }
}
