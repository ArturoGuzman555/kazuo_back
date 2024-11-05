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
   * Propiedad oculta
   */
  @ApiHideProperty()
  @IsEmpty()
  isAdmin?: boolean;
}

export class LoginUserDto extends PickType(CreateUserDto, ['email']) {
  /**
   * Debe ser un string con la contraseña ya encriptada
   * @example 'contraseña_encriptada'
   */
  @ApiProperty({
    description: 'La contraseña debe estar encriptada antes de enviarse.',
    example: 'contraseña_encriptada',
  })
  @IsString()
  password: string;
}

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
  isAdmin?: boolean = false;

  /**
   * Propiedad oculta
   */
  @ApiHideProperty()
  @IsEmpty()
  isSuperAdmin?: boolean = false;
}

export class ResetPasswordDto {
  @ApiProperty({
    description: 'Token de restablecimiento de contraseña',
    example: 'abc123token',
  })
  @IsString()
  @IsNotEmpty()
  token: string;

  @ApiProperty({
    description: 'Nueva contraseña',
    example: 'newPassword123',
  })
  @IsString()
  @MinLength(8, {
    message: 'La nueva contraseña debe tener al menos 8 caracteres',
  })
  @IsNotEmpty()
  newPassword: string;

  @ApiProperty({
    description: 'Confirmar nueva contraseña',
    example: 'newPassword123',
  })
  @IsString()
  @MinLength(8)
  @IsNotEmpty()
  confirmNewPass: string;
}
export class RequestPasswordResetDto {
  @ApiProperty({
    description: 'Debe ser un string y un email válido.',
    example: 'testuser@example.com',
  })
  @IsNotEmpty()
  @IsEmail()
  email: string;
}

export class EncryptPasswordDto {
  @IsString()
  @MinLength(8, { message: 'La contraseña debe tener al menos 8 caracteres.' })
  password: string;
}
