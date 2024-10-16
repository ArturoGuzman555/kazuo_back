import { IsNotEmpty, IsString } from "class-validator";

export class CreateProductDto {
  @IsNotEmpty()
  @IsString()
  name: string;

  @IsNotEmpty()
  @IsString()
  description: string;

  @IsNotEmpty()
  @IsString()
  price: number;

  @IsNotEmpty()
  @IsString()
  stock: number;

  @IsNotEmpty()
  @IsString()
  imgUrl: string

  @IsNotEmpty()
  @IsString()
  categoryName: string
}
