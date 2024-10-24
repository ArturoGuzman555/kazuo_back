import { IsNotEmpty, IsNumber, IsString } from 'class-validator';

export class CreateProductDto {
  @IsNotEmpty()
  @IsString()
  name: string;

  @IsNotEmpty()
  @IsNumber()
  quantity: number;

  @IsNotEmpty()
  @IsNumber()
  price: number;

  @IsNotEmpty()
  @IsString()
  imgUrl: string;

  @IsNotEmpty()
  @IsNumber()
  minStock: number;

  @IsNotEmpty()
  @IsString()
  categoryName: string;
}
