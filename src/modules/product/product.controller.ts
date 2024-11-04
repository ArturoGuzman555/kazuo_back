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
  Patch,
} from '@nestjs/common';
import { ProductService } from './product.service';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { AuthGuard } from 'src/modules/auth/guards/auth-guard.guard';
import { Product } from 'src/Entities/product.entity';
import { Request } from 'express';
<<<<<<< HEAD
import { ApiResponse } from '@nestjs/swagger';
import { Roles } from 'src/decorators/roles.decorators';
import { RolesGuard } from '../auth/guards/roles.guard';
=======
import { ApiBearerAuth, ApiBody, ApiOperation, ApiParam, ApiResponse, ApiTags } from '@nestjs/swagger';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from 'src/decorators/roles.decorators';
>>>>>>> origin
import { Role } from 'src/decorators/roles.enum';

@ApiTags('products')
@ApiBearerAuth() 
@Controller('product')
export class ProductController {
  constructor(private readonly productService: ProductService) {}

  @Post()
  @ApiOperation({ summary: 'Create a new product' })
  @ApiBody({ type: UpdateProductDto })
  @ApiResponse({ status: 201, description: 'Product created successfully.' })
  async create(@Body() createProduct: CreateProductDto) {
    return await this.productService.create(createProduct);
  }

  @Post('bulk')
  @ApiOperation({ summary: 'Bulk create products' })
  @ApiBody({ type: [CreateProductDto] })
  @ApiResponse({ status: 201, description: 'Products created successfully.' })
  async bulkCreate(@Body() products: CreateProductDto[]) {
    return await this.productService.bulkCreate(products);
  }

  @Get()
  @UseGuards(AuthGuard, RolesGuard)
  @Roles(Role.SuperAdmin)
  @HttpCode(HttpStatus.OK)
<<<<<<< HEAD
  @ApiResponse({ status: 200, description: 'Products retrieved successfully', type: [Product] })
  @ApiResponse({ status: 404, description: 'Products not found' })
  async getAllProducts(): Promise<Product[]> {
    return this.productService.findAll();
=======
  @ApiOperation({ summary: 'Get all products' })
  @ApiResponse({ status: 200, description: 'List of products.' })
  async findAll() {
    return await this.productService.findAll();
>>>>>>> origin
  }

  @Get(':id')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Get a product by ID' })
  @ApiParam({ name: 'id', required: true, description: 'ID of the product' })
  @ApiResponse({ status: 200, description: 'Product found.' })
  @ApiResponse({ status: 404, description: 'Product not found.' })
  async findOne(@Param('id', ParseUUIDPipe) id: string) {
    return await this.productService.findOne(id);
  }

  @UseGuards(AuthGuard, RolesGuard)
  @Roles(Role.Admin)
  @Put(':id')
<<<<<<< HEAD
  @UseGuards(AuthGuard, RolesGuard)
  @Roles(Role.Admin)
  @HttpCode(HttpStatus.OK)
  update(
=======
  @ApiOperation({ summary: 'Update a product by ID' })
  @ApiParam({ name: 'id', required: true, description: 'ID of the product to update' })
  @ApiBody({ type: UpdateProductDto })
  @ApiResponse({ status: 200, description: 'Product updated successfully.' })
  @ApiResponse({ status: 404, description: 'Product not found.' })
  async update(
>>>>>>> origin
    @Param('id', ParseUUIDPipe) id: string,
    @Body() updateProduct: UpdateProductDto,
  ) {
    return await this.productService.update(id, updateProduct);
  }

  @UseGuards(AuthGuard, RolesGuard)
  @Roles(Role.Admin)
  @Delete(':id')
<<<<<<< HEAD
  @UseGuards(AuthGuard, RolesGuard)
  @Roles(Role.Admin)
=======
>>>>>>> origin
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Delete a product by ID' })
  @ApiParam({ name: 'id', required: true, description: 'ID of the product to delete' })
  @ApiResponse({ status: 200, description: 'Product deleted successfully.' })
  @ApiResponse({ status: 404, description: 'Product not found.' })
  async remove(@Param('id', ParseUUIDPipe) id: string) {
    return await this.productService.remove(id);
  }

  @Get('store/:storeId')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Get products by store ID' })
  @ApiParam({ name: 'storeId', required: true, description: 'ID of the store' })
  @ApiResponse({ status: 200, description: 'List of products from the store.' })
  async getProductsByStoreId(@Param('storeId', ParseUUIDPipe) storeId: string): Promise<Product[]> {
    return await this.productService.getProductsByStoreId(storeId);
  }
}
