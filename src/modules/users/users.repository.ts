import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Users } from 'src/Entities/users.entity';
import { MoreThan, Repository } from 'typeorm';

@Injectable()
export class UserRepository {
  constructor(
    @InjectRepository(Users)
    private readonly userRepository: Repository<Users>,
  ) {}

  async getUsers(page: number, limit: number): Promise<Users[]> {
    const skip = (page - 1) * limit;
    return this.userRepository.find({
      take: limit,
      skip: skip,
    });
  }

  async getById(id: string): Promise<Users | null> {
    return this.userRepository.findOne({ where: { id } });
  }

  async createUser(user: Partial<Users>): Promise<Users> {
    return this.userRepository.save(user);
  }

  async updateUser(
    id: string,
    updateData: Partial<Users>,
  ): Promise<Users | null> {
    await this.userRepository.update(id, updateData);
    return this.userRepository.findOneBy({ id });
  }

  async deleteUser(id: string): Promise<Users | null> {
    const user = await this.userRepository.findOneBy({ id });
    if (user) {
      await this.userRepository.remove(user);
    }
    return user;
  }

  async getUserByEmail(email: string): Promise<Users | null> {
    return this.userRepository.findOne({
      where: { email },
      relations: ['companies'], 
    });
  }
  

  async findOne(options: any): Promise<Users | null> {
    return this.userRepository.findOne(options);
  }

  async update(id: string, updateData: Partial<Users>): Promise<void> {
    await this.userRepository.update(id, updateData);
  }

  async getUserByResetToken(token: string): Promise<Users | null> {
    return this.userRepository.findOne({
      where: {
        resetPasswordToken: token,
        resetPasswordExpires: MoreThan(new Date()),
      },
    });
  }
  async save(user: Users): Promise<Users> {
    return this.userRepository.save(user);
  }
  async findUserByAuth0Id(auth0Id: string): Promise<Users | undefined> {
    return this.findOne({ where: { auth0Id } });
  }
}
