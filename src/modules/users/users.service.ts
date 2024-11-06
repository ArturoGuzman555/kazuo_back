import {
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { UserRepository } from './users.repository';
import { UpdateUserDto } from './user.dto';
import { CreateUserDto } from './user.dto';
import * as bcrypt from 'bcrypt';
import { Users } from 'src/Entities/users.entity';
@Injectable()
export class UsersService {
  constructor(private readonly userRepository: UserRepository) {}

  async getUsers(page: number, limit: number) {
    const users = await this.userRepository.getUsers(page, limit);
    return users.map(
      ({ password, ...userWithoutPassword }) => userWithoutPassword,
    );
  }

  async getUserById(id: string) {
    const user = await this.userRepository.getById(id);
    if (!user) {
      throw new NotFoundException(`Usuario con id ${id} no encontrado`);
    }
    const { password, ...userWithoutPassword } = user;
    return userWithoutPassword as Users;
  }

  async createUser(createUserDto: CreateUserDto, user) {
    const existingUser = await this.userRepository.getUserByEmail(user.email);
    if (existingUser) {
      throw new ConflictException('El correo electrónico ya está registrado');
    }
    const newUser = {
      ...user,
      createdAt: new Date(),
    };

    const savedUser = await this.userRepository.createUser(newUser);
    const { password, ...userWithoutPassword } = savedUser;

    return userWithoutPassword;
  }

  async updateUser(id: string, updateUserDto: UpdateUserDto) {
    const existingUser = await this.userRepository.getById(id);
    if (!existingUser) {
      throw new NotFoundException(`Usuario con id ${id} no encontrado`);
    }

    if (updateUserDto.email) {
      const userWithSameEmail = await this.userRepository.getUserByEmail(
        updateUserDto.email,
      );
      if (userWithSameEmail && userWithSameEmail.id !== id) {
        throw new ConflictException('El correo electrónico ya está registrado');
      }
    }
    if (updateUserDto.password) {
      const newPassword = await bcrypt.hash(updateUserDto.password, 10);
      updateUserDto.password = newPassword;
    }

    const updatedUser = await this.userRepository.updateUser(id, updateUserDto);
    const { password, ...userWithoutPassword } = updatedUser;
    return userWithoutPassword;
  }

  async deleteUser(id: string) {
    const user = await this.userRepository.getById(id);
    if (!user) {
      throw new NotFoundException(`Usuario con id ${id} no encontrado`);
    }
    await this.userRepository.deleteUser(id);
    return { message: `Usuario con id ${id} eliminado exitosamente` };
  }
  async getUserByEmail(email: string): Promise<Users | null> {
    return this.userRepository.getUserByEmail(email);
  }

  async findUserByAuth0Id(auth0Id: string): Promise<Users | undefined> {
    return this.userRepository.findOne({ where: { auth0Id } });
  }
}
