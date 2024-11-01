import {
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Product } from 'src/Entities/product.entity';
import { Repository } from 'typeorm';
import { Category } from 'src/Entities/category.entity';
import { v2 as Cloudinary } from 'cloudinary';
import { StoreService } from '../store/store.service';
import { Store } from 'src/Entities/store.entity';
import { StoreRepository } from '../store/store.repository';
import { MailService } from 'src/mail/mail.service';

@Injectable()
export class ProductService {
  constructor(
    @InjectRepository(Product)
    private readonly productsRepository: Repository<Product>,
    private readonly storeRepository: StoreRepository,
    private readonly mailService: MailService,
  ) {}

  async create(createProduct: CreateProductDto) {
    const store = await this.storeRepository.findById(createProduct.storeId);

    if (!store) {
      throw new NotFoundException('Bodega no encontrada');
    }

    const product = await this.productsRepository.findOne({
      where: { name: createProduct.name },
    });

    if (product) {
      throw new ConflictException('El producto ya existe');
    }
    const newProduct = this.productsRepository.create({
      ...createProduct,
      store: store,
      createdAt: new Date(),
    });

    await this.productsRepository.save(newProduct);
    return { message: 'El producto fue creado exitosamente', newProduct };
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
      relations: ['user'], // Carga el usuario relacionado
    });

    if (!deleteProduct) throw new NotFoundException('Producto no encontrado');

    // Asegúrate de que deleteProduct.user.email exista antes de enviar el correo
    if (deleteProduct.user && deleteProduct.user.email) {
      await this.mailService.sendMail(
        deleteProduct.user.email,
        'Producto eliminado',
        `El producto con ID ${id} y nombre ${deleteProduct.name} fue eliminado`,
      );
    }

    await this.productsRepository.remove(deleteProduct);

    return {
      message: `El producto con el ID: ${id} fue eliminado exitosamente`,
    };
  }

  async getProductsByStoreId(storeId: string): Promise<Product[]> {
    return await this.productsRepository.find({
      where: { store: { id: storeId } },
      relations: ['store'],
    });
  }

  async bulkCreate(products: CreateProductDto[]) {
    const createdProducts = await Promise.all(
      products.map(async (product) => {
        const store = await this.storeRepository.findById(product.storeId);
        if (!store) {
          throw new NotFoundException(
            `Bodega con ID ${product.storeId} no encontrada`,
          );
        }

        const newProduct = this.productsRepository.create({
          ...product,
          store: { id: product.storeId },
          user: { id: product.userId },
        });

        return await this.productsRepository.save(newProduct);
      }),
    );

    return createdProducts;
  }
}
