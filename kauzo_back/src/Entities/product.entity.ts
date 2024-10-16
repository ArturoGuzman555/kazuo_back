import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from "typeorm";
import {v4 as uuid} from 'uuid'
import { Category } from "./category.entity";
import { Users } from "./users.entity";

@Entity({name:'products'})
export class Product {
  @PrimaryGeneratedColumn('uuid')
  id: string = uuid()

  @Column({ length: 50 })
  name: string;

  @Column()
  description: string;

  @Column({ type: 'decimal', precision: 10, scale: 2 })
  price: number;

  @Column('numeric')
  stock: number;

  @Column({ default: 'default-image-url-png' })
  imgUrl: string;

  @ManyToOne(() => Category, (category) => category.products)
  category: Category;

  @ManyToOne(() => Users, (user) => user.products)
  user: Users;
}