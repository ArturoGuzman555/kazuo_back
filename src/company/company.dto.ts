import { ApiHideProperty, ApiProperty } from '@nestjs/swagger';
import {
  IsEmail,
  IsNotEmpty,
  IsString,
  IsPhoneNumber,
  IsNumber,
  IsOptional,
} from 'class-validator';

export class CreateCompanyDto {
  @ApiProperty({
    description:
      'Nombre de la compañía, debe ser un string entre 3 y 50 caracteres.',
    example: 'Mi Empresa S.A.',
  })
  @IsNotEmpty({ message: 'El nombre de la compañía es obligatorio' })
  @IsString()
  CompanyName: string;

  @ApiProperty({
    description: 'País y región de la compañía',
    example: 'Argentina',
  })
  @IsNotEmpty({ message: 'El país es obligatorio' })
  @IsString()
  country: string;

  @ApiProperty({
    description: 'Dirección de la compañía',
    example: 'Avenida Principal 123, Ciudad',
  })
  @IsNotEmpty({ message: 'La dirección es obligatoria' })
  @IsString()
  address: string;

  @ApiProperty({
    description: 'Teléfono de contacto de la compañía',
    example: '5551678033',
  })
  @IsNotEmpty({ message: 'El teléfono de contacto es obligatorio' })
  @IsNumber({}, { message: 'El teléfono de contacto no es válido' }) // Cambiado null por {}
  contactPhone: number;
  @ApiProperty({
    description: 'Correo electrónico de la compañía',
    example: 'info@miempresa.com',
  })
  @IsNotEmpty({ message: 'El correo electrónico es obligatorio' })
  @IsEmail({}, { message: 'El correo electrónico no es válido' })
  email: string;

  @ApiProperty({
    description: 'Tipo de industria de la compañía',
    example: 'Abarrotes',
  })
  @IsNotEmpty({ message: 'La industria es obligatoria' })
  @IsString()
  industry: string;

  @ApiProperty({
    description: 'ID del usuario que creó la compañía',
    example: '123e4567-e89b-12d3-a456-426614174000',
  })
  @IsNotEmpty({ message: 'El ID de usuario es obligatorio' })
  @IsString({ message: 'El ID de usuario debe ser una cadena' })
  userId: string;
}

export class AddUserToCompanyDto {
  @ApiProperty({
    description: 'Correo electrónico del usuario que se agregará a la compañía',
    example: 'usuario@example.com',
  })
  @IsEmail({}, { message: 'El correo electrónico debe ser válido.' })
  @IsNotEmpty({ message: 'El correo electrónico no puede estar vacío.' })
  email: string;
}

export class UpdateCompanyDto {
  @ApiProperty({ description: 'Nombre de la compañía', required: false })
  @IsOptional()
  @IsString()
  CompanyName?: string;

  @ApiProperty({ description: 'País y región de la compañía', required: false })
  @IsOptional()
  @IsString()
  country?: string;

  @ApiProperty({ description: 'Dirección de la compañía', required: false })
  @IsOptional()
  @IsString()
  address?: string;

  @ApiProperty({
    description: 'Teléfono de contacto de la compañía',
    required: false,
  })
  @IsOptional()
  @IsNumber()
  contactPhone?: number;

  @ApiProperty({
    description: 'Correo electrónico de la compañía',
    required: false,
  })
  @IsOptional()
  @IsEmail()
  email?: string;

  @ApiProperty({
    description: 'Tipo de industria de la compañía',
    required: false,
  })
  @IsOptional()
  @IsString()
  industry?: string;
}
