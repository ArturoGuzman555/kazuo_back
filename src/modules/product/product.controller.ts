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
import { ApiResponse } from '@nestjs/swagger';
import { Roles } from 'src/decorators/roles.decorators';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Role } from 'src/decorators/roles.enum';

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
  @UseGuards(AuthGuard, RolesGuard)
  @Roles(Role.SuperAdmin)
  @HttpCode(HttpStatus.OK)
  @ApiResponse({ status: 200, description: 'Products retrieved successfully', type: [Product] })
  @ApiResponse({ status: 404, description: 'Products not found' })
  async getAllProducts(): Promise<Product[]> {
    return this.productService.findAll();
  }

  @Get(':id')
  @HttpCode(HttpStatus.OK)
  findOne(@Param('id', ParseUUIDPipe) id: string) {
    return this.productService.findOne(id);
  }

  @Put(':id')
  @UseGuards(AuthGuard, RolesGuard)
  @Roles(Role.Admin)
  @HttpCode(HttpStatus.OK)
  update(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() updateProduct: UpdateProductDto,
  ) {
    return this.productService.update(id, updateProduct);
  }

  @Delete(':id')
  @UseGuards(AuthGuard, RolesGuard)
  @Roles(Role.Admin)
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
