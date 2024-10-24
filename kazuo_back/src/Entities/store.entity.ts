import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { Category } from './category.entity';
import { Users } from './users.entity';

@Entity({ name: 'store' })
export class Store {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ length: 50 })
  name: string;

  @ManyToOne(() => Category, (category) => category.stores)
  category: Category;

  @ManyToOne(() => Users, (users) => users.stores)
  user: Users;
}
