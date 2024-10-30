import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { ApiProperty } from '@nestjs/swagger';
import { Users } from './users.entity';

@Entity({ name: 'companies' })
export class Company {
  @ApiProperty({
    description: 'ID único de la compañía',
    example: '123e4567-e89b-12d3-a456-426614174000',
  })
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ApiProperty({
    description: 'Nombre de la compañía del usuario',
    example: 'Mi Empresa S.A.',
  })
  @Column({
    type: 'varchar',
    length: 100,
    nullable: true,
  })
  company: string;

  @ApiProperty({
    description: 'Dirección de la compañía',
    example: 'Avenida Principal 123, Ciudad',
  })
  @Column({
    type: 'varchar',
    length: 255,
    nullable: false,
  })
  address: string;

  @ApiProperty({
    description: 'Correo electrónico de la compañía',
    example: 'info@miempresa.com',
  })
  @Column({
    type: 'varchar',
    length: 100,
    nullable: false,
    unique: true,
  })
  email: string;

  @ManyToOne(() => Users, (user) => user.companies)
  @JoinColumn({ name: 'userId' })
  user: Users;

  @Column({
    type: 'uuid',
    nullable: false,
  })
  userId: string;
}
