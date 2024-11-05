import { ApiProperty, PartialType } from '@nestjs/swagger';
import { CreateProductDto } from './create-product.dto';
import {
  IsUUID,
  IsOptional,
  IsString,
  IsNumber,
  IsNotEmpty,
} from 'class-validator';

export class UpdateProductDto {
  @ApiProperty({
    description: 'Name of the product',
    example: 'Wireless Headphones',
    required: false,
  })
  @IsOptional()
  @IsString()
  name?: string;

  @ApiProperty({
    description: 'Quantity of the product in stock',
    example: 100,
    required: false,
  })
  @IsOptional()
  @IsNumber()
  quantity?: number;

  @ApiProperty({
    description: 'Unit of measurement for the product',
    example: 'pcs',
    required: false,
  })
  @IsOptional()
  @IsString()
  unids?: string;

  @ApiProperty({
    description: 'Maximum capacity for the product stock',
    example: 500,
    required: false,
  })
  @IsOptional()
  @IsNumber()
  maxCapacity?: number;

  @ApiProperty({
    description: 'Cost price of the product',
    example: 25.5,
    required: false,
  })
  @IsOptional()
  @IsNumber()
  inPrice?: number;

  @ApiProperty({
    description: 'Product badge or identifier',
    example: 'WH-001',
    required: false,
  })
  @IsOptional()
  @IsString()
  bange?: string;

  @ApiProperty({
    description: 'Selling price of the product',
    example: 45.99,
    required: false,
  })
  @IsOptional()
  @IsNumber()
  outPrice?: number;

  @ApiProperty({
    description: 'Minimum stock level before reordering',
    example: 10,
    required: false,
  })
  @IsOptional()
  @IsNumber()
  minStock?: number;
}
