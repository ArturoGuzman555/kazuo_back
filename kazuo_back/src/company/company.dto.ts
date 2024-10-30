import { ApiHideProperty, ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsNotEmpty, IsString, IsPhoneNumber } from 'class-validator';

export class CreateCompanyDto {
  @ApiProperty({
    description: 'Debe ser un string entre 3 y 50 caracteres.',
    example: 'Empresa 1',
  })
  @IsNotEmpty()
  name: string;

  @ApiProperty({
    description: 'Dirección de la compañía',
    example: 'Avenida Principal 123, Ciudad',
  })
  @IsNotEmpty({ message: 'La dirección es obligatoria' })
  address: string;
  @ApiProperty({
    description: 'Correo electrónico de la compañía',
    example: 'info@miempresa.com',
  })
  @IsNotEmpty({ message: 'El correo electrónico es obligatorio' })
  @IsEmail({}, { message: 'Correo electrónico no es válido' })
  email: string;

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
