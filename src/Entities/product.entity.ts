import {
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  Entity,
  JoinColumn,
  ManyToMany,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { Store } from './store.entity';
import { Users } from './users.entity';
import { Provider } from './providers.entity';
import { Category } from './category.entity';
import { Company } from './company.entity';

@Entity({ name: 'products' })
export class Product {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ length: 50 })
  name: string;

  @Column('numeric')
  quantity: number;

  @Column()
  unids: string;

  @Column('numeric')
  maxCapacity: number;

  @Column({ type: 'decimal', precision: 10, scale: 2 })
  inPrice: number;

  @Column()
  bange: string;

  @Column({ type: 'decimal', precision: 10, scale: 2 })
  outPrice: number;

  @Column('numeric')
  minStock: number;

  @CreateDateColumn({ type: 'timestamp' })
  createdAt: Date;

  @UpdateDateColumn({ type: 'timestamp' })
  updatedAt: Date;

  @ManyToOne(() => Store, (store) => store.products, { onDelete: 'CASCADE' })
  store: Store;

  @ManyToOne(() => Users, (user) => user.stores, { onDelete: 'CASCADE' })
  user: Users;

  @ManyToMany(() => Provider, (provider) => provider.products)
  providers: Provider[];

  @ManyToOne(() => Category, (category) => category.products, { onDelete: 'CASCADE' })
  category: Category;


}
