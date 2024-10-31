import {
  Column,
  Entity,
  ManyToMany,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { v4 as uuid } from 'uuid';
import { Category } from './category.entity';
import { Users } from './users.entity';
import { Store } from './store.entity';
import { Provider } from './providers.entity';

@Entity({ name: 'products' })
export class Product {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ length: 50 })
  name: string;

  @Column('numeric')
  quantity: number;

  unids: string;

  @Column('numeric')
  maxCapacity: number;

  @Column('numeric')
  inPrice: number;

  @Column()
  bange: string;

  @Column('numeric')
  outPrice: number;

  @Column('numeric')
  minStock: number;

  // @Column({ type: 'decimal', precision: 10, scale: 2 })
  // price: number;

  // @Column()
  // moneda: string;

  // @Column()
  // minStock: number;

  @ManyToOne(() => Store, (store) => store.products)
  store: Store;

  @ManyToOne(() => Users, (user) => user.stores)
  user: Users;

  @ManyToMany(() => Provider, (provider) => provider.products)
  providers: Provider[];
}
