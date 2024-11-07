import {
  Column,
  CreateDateColumn,
  Entity,
  ManyToMany,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { Category } from './category.entity';
import { Users } from './users.entity';
import { Product } from './product.entity';
import { Company } from './company.entity';

@Entity({ name: 'store' })
export class Store {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ length: 50 })
  name: string;

  @CreateDateColumn({ type: 'timestamp' })
  createdAt: Date;

  @ManyToOne(() => Category, (category) => category.stores, { onDelete: 'CASCADE' })
  category: Category;

  @OneToMany(() => Product, (product) => product.store)
  products: Product[];

  @ManyToOne(() => Users, (users) => users.stores, { onDelete: 'CASCADE' })
  user: Users;

  @ManyToMany(() => Company, (company) => company.stores)
  companies: Company[];
  
}
