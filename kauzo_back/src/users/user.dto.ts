import { ApiHideProperty, ApiProperty, PickType } from '@nestjs/swagger';
import {
  IsEmail,
  IsNotEmpty,
  IsString,
  Length,
  Matches,
  IsNumber,
  MinLength,
  MaxLength,
  Validate,
  IsEmpty,
  IsOptional,
} from 'class-validator';
import { MatchPass } from 'src/decorators/matchPass.decorator';

export class CreateUserDto {
  /**
   * Debe ser un string y un email válido
   * @example testuser@example.com
   */
  @ApiProperty({
    description: 'Debe ser un string y un email válido.',
    example: 'testuser@example.com',
  })
  @IsNotEmpty()
  @IsEmail()
  email: string;
  /**
   * Debe ser un string entre 8 y 15 caracteres, con al menos una letra minúscula, una letra mayúscula, un número y un carácter especial (!@#$%^&*)
   * @example aaBB11@@
   */
  @ApiProperty({
    description:
      'Debe ser un string entre 8 y 15 caracteres, con al menos una letra minúscula, una letra mayúscula, un número y un carácter especial (!@#$%^&*)',
    example: 'aaBB11@@',
  })
  @IsNotEmpty()
  @Matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*]).{8,15}$/, {
    message:
      'La contraseña debe contener al menos una letra minúscula, una letra mayúscula, un número y un carácter especial (!@#$%^&*) y tener entre 8 y 15 caracteres.',
  })
  password: string;
  /**
   * Debe ser igual a la password
   * @example aaBB11@@
   */
  @ApiProperty({
    description: 'Debe ser igual a la password.',
    example: 'aaBB11@@',
  })
  @IsNotEmpty()
  @Validate(MatchPass, ['password'])
  confirmPass: string;
  /**
   * Debe ser un string entre 3 y 50 caracteres.
   * @example 'Jhon Doe'
   */
  @ApiProperty({
    description: 'Debe ser un string entre 3 y 50 caracteres.',
    example: 'Jhon Doe',
  })
  @IsNotEmpty()
  @IsString()
  @Length(3, 50)
  name: string;

  /**
   * Debe ser un string entre 3 y 20 caracteres
   * @example Empresa 1
   */
  @ApiProperty({
    description: 'Debe ser un string entre 3 y 50 caracteres.',
    example: 'Empresa 1',
  })
  @IsNotEmpty()
  @IsString()
  @Length(3, 50)
  company: string;

  /**
   * Propiedad oculta
   */
  @ApiHideProperty()
  @IsEmpty()
  isAdmin?: boolean;
}

export class LoginUserDto extends PickType(CreateUserDto, [
  'email',
  'password',
]) {}

export class UpdateUserDto {
  /**
   * Debe ser un string entre 3 y 50 caracteres.
   * @example 'Jhon Doe'
   */
  @ApiProperty({
    description: 'Debe ser un string entre 3 y 50 caracteres.',
    example: 'Jhon Doe',
  })
  @IsOptional()
  @IsString()
  @Length(3, 50)
  name?: string;

  /**
   * Debe ser un string y un email válido
   * @example testuser@example.com
   */
  @ApiProperty({
    description: 'Debe ser un string y un email válido.',
    example: 'testuser@example.com',
  })
  @IsOptional()
  @IsEmail()
  email?: string;

  /**
   * Debe ser un string entre 8 y 15 caracteres, con al menos una letra minúscula, una letra mayúscula, un número y un carácter especial (!@#$%^&*)
   * @example aaBB11@@
   */
  @ApiProperty({
    description:
      'Debe ser un string entre 8 y 15 caracteres, con al menos una letra minúscula, una letra mayúscula, un número y un carácter especial (!@#$%^&*)',
    example: 'aaBB11@@',
  })
  @IsOptional()
  @Matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*]).{8,15}$/, {
    message:
      'La contraseña debe contener al menos una letra minúscula, una letra mayúscula, un número y un carácter especial (!@#$%^&*) y tener entre 8 y 15 caracteres.',
  })
  password?: string;

  /**
   * Debe ser igual a la password
   * @example aaBB11@@
   */
  @ApiProperty({
    description: 'Debe ser igual a la password.',
    example: 'aaBB11@@',
  })
  @IsOptional()
  @Validate(MatchPass, ['password'])
  confirmPass?: string;

  /**
   * Debe ser un string de 3 a 80 caracteres
   * @example 'Prueba 1'
   */
  @ApiProperty({
    description: 'Debe ser un string de 3 a 80 caracteres.',
    example: 'Prueba 1',
  })
  @IsOptional()
  @IsString()
  @MinLength(3)
  @MaxLength(80)
  address?: string;

  /**
   * Debe ser un número
   * @example 1122334455
   */
  @ApiProperty({
    description: 'Debe ser un número.',
    example: 1122334455,
  })
  @IsOptional()
  @IsNumber()
  phone?: number;

  /**
   * Debe ser un string de 3 a 20 caracteres
   * @example Peru
   */
  @ApiProperty({
    description: 'Debe ser un string de 3 a 20 caracteres.',
    example: 'Peru',
  })
  @IsOptional()
  @IsString()
  @Length(3, 20)
  country?: string;

  /**
   * Debe ser un string entre 3 y 20 caracteres
   * @example Cali
   */
  @ApiProperty({
    description: 'Debe ser un string entre 3 y 20 caracteres.',
    example: 'Cali',
  })
  @IsOptional()
  @IsString()
  @Length(3, 20)
  city?: string;

  /**
   * Propiedad oculta
   */
  @ApiHideProperty()
  @IsEmpty()
  isAdmin?: boolean = false;
}
