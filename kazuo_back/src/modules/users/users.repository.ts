import { Injectable } from '@nestjs/common';
import { EntityRepository, Repository } from 'typeorm';
import { Users } from 'src/Entities/users.entity';
import { UpdateUserDto } from './user.dto';

@EntityRepository(Users)
export class UserRepository extends Repository<Users> {
  async getUsers(page: number, limit: number): Promise<Users[]> {
    const skip = (page - 1) * limit;
    return this.find({
      take: limit,
      skip: skip,
    });
  }

  async getById(id: string): Promise<Users | null> {
    return this.findOne({ where: { id } });
  }

  async createUser(user: Partial<Users>): Promise<Users> {
    return this.save(user);
  }

  async updateUser(
    id: string,
    updateData: Partial<UpdateUserDto>,
  ): Promise<Users | null> {
    await this.update(id, updateData);
    return this.findOneBy({ id });
  }

  async deleteUser(id: string): Promise<Users | null> {
    const user = await this.findOneBy({ id });
    if (user) {
      await this.remove(user);
    }
    return user;
  }

  async getUserByEmail(email: string): Promise<Users | null> {
    return this.findOneBy({ email });
  }
}
