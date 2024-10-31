import { IsNotEmpty, IsNumber, IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateProductDto {
  @ApiProperty({
    description: 'Name of the product',
    example: 'Wireless Headphones',
  })
  @IsNotEmpty()
  @IsString()
  name: string;

  @ApiProperty({
    description: 'Quantity of the product in stock',
    example: 100,
  })
  @IsNotEmpty()
  @IsNumber()
  quantity: number;

  @ApiProperty({
    description: 'Unit of measurement for the product',
    example: 'pcs',
  })
  @IsNotEmpty()
  @IsString()
  unids: string;

  @ApiProperty({
    description: 'Maximum capacity for the product stock',
    example: 500,
  })
  @IsNotEmpty()
  @IsNumber()
  maxCapacity: number;

  @ApiProperty({
    description: 'Cost price of the product',
    example: 25.5,
  })
  @IsNotEmpty()
  @IsNumber()
  inPrice: number;

  @ApiProperty({
    description: 'Product badge or identifier',
    example: 'WH-001',
  })
  @IsNotEmpty()
  @IsString()
  bange: string;

  @ApiProperty({
    description: 'Selling price of the product',
    example: 45.99,
  })
  @IsNotEmpty()
  @IsNumber()
  outPrice: number;

  @ApiProperty({
    description: 'Minimum stock level before reordering',
    example: 10,
  })
  @IsNotEmpty()
  @IsNumber()
  minStock: number;

  @ApiProperty({
    description: 'ID of the store to which the product belongs',
    example: 'storeId123',
  })
  @IsNotEmpty()
  @IsString()
  storeId: string;

  @ApiProperty({
    description: 'ID of the user creating the product',
    example: 'userId456',
  })
  @IsNotEmpty()
  @IsString()
  userId: string;
}
