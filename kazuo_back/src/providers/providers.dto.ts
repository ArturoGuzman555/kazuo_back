// src/dto/create-provider.dto.ts
import { ApiProperty, PartialType } from '@nestjs/swagger';
import { IsString, IsEmail, IsNotEmpty, IsPhoneNumber } from 'class-validator';

export class CreateProviderDto {
  @ApiProperty({
    description: 'The name of the provider',
    example: 'Provider Name',
  })
  @IsNotEmpty()
  @IsString()
  name: string;

  @ApiProperty({
    description: 'The email of the provider',
    example: 'provider@example.com',
  })
  @IsNotEmpty()
  @IsEmail()
  email: string;

  @ApiProperty({
    description: 'The address of the provider',
    example: '123 Provider St.',
  })
  @IsNotEmpty()
  @IsString()
  address: string;

  @ApiProperty({
    description: 'The phone number of the provider',
    example: '123-456-7890',
  })
  @IsNotEmpty()
  @IsString()
  phone: string;

  @ApiProperty({
    description: 'The user ID associated with the provider',
    example: '123e4567-e89b-12d3-a456-426614174000',
  })
  @IsNotEmpty()
  @IsString()
  userId: string;
}

export class UpdateProviderDto extends PartialType(CreateProviderDto) {}

export class AddProductToProviderDto {
  @ApiProperty({
    description: 'Name of the product to associate with the provider',
    example: 'Wireless Mouse',
  })
  @IsString()
  @IsNotEmpty()
  productName: string;
}
