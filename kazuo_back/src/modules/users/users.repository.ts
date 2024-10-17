import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { UpdateUserDto } from './user.dto';
import { Users } from 'src/Entities/users.entity';

@Injectable()
export class UserRepository {
  constructor(
    @InjectRepository(Users) private userRepository: Repository<Users>,
  ) {}

  async getUsers(page: number, limit: number) {
    const skip = (page - 1) * limit;
    return this.userRepository.find({
      take: limit,
      skip: skip,
    });
  }

  async getById(id: string) {
    return this.userRepository.findOne({ where: { id } });
  }

  async createUser(user: Partial<Users>): Promise<Users> {
    return this.userRepository.save(user);
  }

  async updateUser(
    id: string,
    updateData: Partial<UpdateUserDto>,
  ): Promise<Users> {
    await this.userRepository.update(id, updateData);
    return this.userRepository.findOneBy({ id });
  }

  async deleteUser(id: string): Promise<Users> {
    const user = await this.userRepository.findOneBy({ id });
    if (user) {
      await this.userRepository.remove(user);
    }
    return user;
  }

  async getUserByEmail(email: string): Promise<Users | null> {
    return this.userRepository.findOneBy({ email });
  }
}
