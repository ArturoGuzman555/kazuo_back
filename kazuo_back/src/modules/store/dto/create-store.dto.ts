import { IsNotEmpty, IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateStoreDto {
  @ApiProperty({
    description: 'Name of the store',
    example: 'My Awesome Store',
  })
  @IsNotEmpty()
  @IsString()
  name: string;

  @ApiProperty({
    description: 'Category of the store',
    example: 'Electronics',
  })
  @IsNotEmpty()
  @IsString()
  categoryName: string;

  @ApiProperty({
    description: 'ID of the user creating the store',
    example: '1234567890',
  })
  @IsNotEmpty()
  userId: string;
}
