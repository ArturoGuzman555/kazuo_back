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

  @IsNotEmpty()
  @IsString()
  unids: string;

  @IsNotEmpty()
  @IsNumber()
  maxCapacity: number;

  @IsNotEmpty()
  @IsNumber()
  inPrice: number;

  @IsNotEmpty()
  @IsString()
  bange: string;

  @IsNotEmpty()
  @IsNumber()
  outPrice: number;

  @IsNotEmpty()
  @IsNumber()
  minStock: number;

  // @ApiProperty({
  //   description: 'Price of the product',
  //   example: 59.99,
  // })
  // @IsNotEmpty()
  // @IsNumber()
  // price: number;

  // @IsNotEmpty()
  // @IsString()
  // moneda: string;

  // @ApiProperty({
  //   description: 'Minimum stock level before reordering',
  //   example: 10,
  // })
  // @IsNotEmpty()
  // @IsNumber()
  // minStock: number;

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
