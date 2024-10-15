import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';
import { ApiProperty, ApiHideProperty } from '@nestjs/swagger';

@Entity({
  name: 'users',
})
export class Users {
  @ApiProperty({
    description: 'ID único del usuario',
    example: '123e4567-e89b-12d3-a456-426614174000',
  })
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ApiProperty({
    description: 'Nombre del usuario',
    example: 'Juan Pérez',
  })
  @Column({
    type: 'varchar',
    length: 50,
    nullable: false,
  })
  name: string;

  @ApiProperty({
    description: 'Correo electrónico del usuario',
    example: 'juan.perez@example.com',
  })
  @Column({
    type: 'varchar',
    length: 50,
    nullable: false,
  })
  email: string;

  @ApiProperty({
    description: 'Contraseña del usuario',
    example: 'password123',
  })
  @Column({
    type: 'varchar',
    length: 150,
    nullable: false,
  })
  password: string;

  @ApiProperty({
    description: 'Número de teléfono del usuario',
    example: 5551234567,
  })
  @Column({
    type: 'int',
  })
  phone: number;

  @ApiProperty({
    description: 'País del usuario',
    example: 'México',
  })
  @Column({
    type: 'varchar',
    length: 50,
  })
  country: string;

  @ApiProperty({
    description: 'Ciudad del usuario',
    example: 'Ciudad de México',
  })
  @Column({
    type: 'varchar',
    length: 50,
  })
  city: string;

  @ApiProperty({
    description: 'Dirección del usuario',
    example: 'Av. Reforma 123',
  })
  @Column({
    type: 'varchar',
    length: 50,
  })
  address: string;
  @ApiProperty({
    description: 'Nombre de la compañia',
    example: 'Empresa 1',
  })
  @Column({
    type: 'varchar',
    length: 50,
  })
  @ApiHideProperty()
  @Column({ default: false })
  isAdmin: boolean;
}
