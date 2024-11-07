import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  JoinTable,
  ManyToMany,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { ApiHideProperty, ApiProperty } from '@nestjs/swagger';
import { Users } from './users.entity';
import { Product } from './product.entity';
import { Store } from './store.entity';

@Entity({ name: 'companies' })
export class Company {
  @ApiProperty({
    description: 'ID único de la compañía',
    example: '123e4567-e89b-12d3-a456-426614174000',
  })
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ApiProperty({
    description: 'Nombre de la compañía',
    example: 'Mi Empresa S.A.',
  })
  @Column({
    type: 'varchar',
    length: 100,
    nullable: true,
  })
  CompanyName: string;

  @ApiProperty({
    description: 'País i Región',
    example: 'Argentina',
  })
  @Column({
    type: 'varchar',
    length: 255,
    nullable: false,
  })
  country: string;

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
    description: 'Telefono de contacto',
    example: '5551678033',
  })
  @Column({
    type: 'bigint',
  })
  contactPhone: Number;

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

  @ApiProperty({
    description: 'Tipo de industria',
    example: 'Abarrotes',
  })
  @Column({
    type: 'varchar',
    length: 50,
    nullable: false,
  })
  industry: string;

  @CreateDateColumn({ type: 'timestamp' })
  createdAt: Date;

  @ManyToMany(() => Users, (user) => user.companies, { onDelete: 'CASCADE' })
  @JoinTable({
    name: 'user_company',
    joinColumn: { name: 'company_id', referencedColumnName: 'id' },
    inverseJoinColumn: { name: 'user_id', referencedColumnName: 'id' },
  })
  users: Users[];

  @ManyToMany(() => Store, (store) => store.companies, { onDelete: 'CASCADE' })
  @JoinTable({
    name: 'company_stores',  
    joinColumn: { name: 'company_id', referencedColumnName: 'id' },
    inverseJoinColumn: { name: 'store_id', referencedColumnName: 'id' },
  })
  stores: Store[];
}

