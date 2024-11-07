import { ApiProperty } from "@nestjs/swagger";
import { IsNotEmpty, IsString } from "class-validator";

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

  @ApiProperty({
    description: 'IDs of the companies associated with the store',
    example: ['company_id_1', 'company_id_2'],
  })
  @IsNotEmpty()
  companyIds: string[]; 
}
