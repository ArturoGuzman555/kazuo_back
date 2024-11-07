import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToMany,
  OneToMany,
  OneToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { ApiProperty, ApiHideProperty } from '@nestjs/swagger';
import { v4 as uuid } from 'uuid';
import { Product } from './product.entity';
import { Store } from './store.entity';
import { Company } from './company.entity';
import { Provider } from './providers.entity';

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

  @ApiHideProperty()
  @Column({
    type: 'boolean',
    default: false,
  })
  isAdmin: boolean;

  @ApiHideProperty()
  @Column({
    type: 'boolean',
    default: false,
  })
  isSuperAdmin: boolean;
  @ApiProperty({
    description: 'URL de la imagen del usuario',
    example: 'https://res.cloudinary.com/dytdzrpgq/image/upload/v1730841991/kh1rrkfxnass7dbaop7d.jpg',
  })
  @Column({
    type: 'varchar',
    length: 255,
    nullable: true,
    default:
      'https://res.cloudinary.com/dytdzrpgq/image/upload/v1730841991/kh1rrkfxnass7dbaop7d.jpg',
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

  @Column({ nullable: true })
    auth0Id: string | null;

  @CreateDateColumn({ type: 'timestamp' })
  createdAt: Date;

  @OneToMany(() => Store, (store) => store.user)
  @JoinColumn({ name: 'store_Id' })
  stores: Store[];

  @OneToMany(() => Product, (products) => products.user)
  @JoinColumn({ name: 'product_id' })
  products: Product[];
  companys: any;

  @ManyToMany(() => Company, (company) => company.users, {
    cascade: true,
    onDelete: 'CASCADE',
  })
  companies: Company[];
  @ManyToMany(() => Provider, (provider) => provider.users, {
    cascade: true,
    onDelete: 'CASCADE',
  })
  providers: Provider[];
}
