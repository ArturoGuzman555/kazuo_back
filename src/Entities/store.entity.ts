import {
  Column,
  CreateDateColumn,
  Entity,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { Category } from './category.entity';
import { Users } from './users.entity';
import { Product } from './product.entity';

@Entity({ name: 'store' })
export class Store {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ length: 50 })
  name: string;

  @CreateDateColumn({ type: 'timestamp' })
  createdAt: Date;

  @ManyToOne(() => Category, (category) => category.stores)
  category: Category;

  @OneToMany(() => Product, (product) => product.store)
  products: Product[];

  @ManyToOne(() => Users, (users) => users.stores)
  user: Users;
}
