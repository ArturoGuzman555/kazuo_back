import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Delete,
  HttpCode,
  HttpStatus,
  Put,
  ParseUUIDPipe,
  UseGuards,
  Req,
} from '@nestjs/common';
import { ProductService } from './product.service';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { AuthGuard } from 'src/modules/auth/guards/auth-guard.guard';
import { FileInterceptor } from '@nestjs/platform-express';
import { Product } from 'src/Entities/product.entity';
import { Request } from 'express';

@Controller('product')
export class ProductController {
  constructor(private readonly productService: ProductService) {}

  @Post()
  async create(@Body() createProduct: CreateProductDto) {
    const product = await this.productService.create(createProduct); // Solo el argumento necesario
    return product;
  }

  @Post('bulk')
  async bulkCreate(@Body() products: CreateProductDto[]) {
    return this.productService.bulkCreate(products);
  }

  @Get()
  @HttpCode(HttpStatus.OK)
  findAll() {
    return this.productService.findAll();
  }

  @Get(':id')
  @HttpCode(HttpStatus.OK)
  findOne(@Param('id', ParseUUIDPipe) id: string) {
    return this.productService.findOne(id);
  }

  @Put(':id')
  @UseGuards(AuthGuard)
  @HttpCode(HttpStatus.OK)
  update(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() updateProduct: UpdateProductDto,
  ) {
    return this.productService.update(id, updateProduct);
  }

  @Delete(':id')
  //@UseGuards(AuthGuard)
  @HttpCode(HttpStatus.OK)
  remove(@Param('id', ParseUUIDPipe) id: string) {
    return this.productService.remove(id);
  }

  @Get('store/:storeId')
  async getProductsByStoreId(
    @Param('storeId') storeId: string,
  ): Promise<Product[]> {
    return await this.productService.getProductsByStoreId(storeId);
  }
}
