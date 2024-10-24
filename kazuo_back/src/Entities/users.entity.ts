import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm';
import { ApiProperty, ApiHideProperty } from '@nestjs/swagger';
import { v4 as uuid } from 'uuid';
import { Product } from './product.entity';
import { Store } from './store.entity';

@Entity({ name: 'users' })
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
    unique: true,
  })
  email: string;

  @ApiHideProperty()
  @Column({
    type: 'varchar',
    length: 150,
    nullable: false,
  })
  password: string;

  @ApiProperty({
    description: 'Nombre de la compañía del usuario',
    example: 'Mi Empresa S.A.',
  })
  @Column({
    type: 'varchar',
    length: 100,
    nullable: true,
  })
  company?: string;

  @ApiHideProperty()
  @Column({
    type: 'boolean',
    default: false,
  })
  isAdmin: boolean;
  @ApiProperty({
    description: 'URL de la imagen del usuario',
    example: 'https://example.com/image.jpg',
  })
  @Column({
    type: 'varchar',
    length: 255,
    nullable: true, // Si es opcional
  })
  imgUrl?: string;

  @ApiHideProperty()
  @Column({ nullable: true })
  resetPasswordToken: string;

  @ApiHideProperty()
  @Column({ nullable: true })
  resetPasswordExpires: Date;

  @ApiHideProperty()
  @Column({
    type: 'boolean',
    default: false,
  })
  pay: boolean;

  @OneToMany(() => Store, (store) => store.user)
  stores: Store[];
}

