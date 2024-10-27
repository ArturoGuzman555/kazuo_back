import { IsNotEmpty, IsString } from 'class-validator';

export class CreateStoreDto {
  @IsNotEmpty()
  @IsString()
  name: string;

  @IsNotEmpty()
  @IsString()
  categoryName: string;

  @IsNotEmpty()
  userId: string;
}
