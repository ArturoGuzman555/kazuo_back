import { BadRequestException, Injectable } from '@nestjs/common';

import * as bcrypt from 'bcrypt';
import { JwtService } from '@nestjs/jwt';
import { Users } from 'src/Entities/users.entity';
import { UserRepository } from '../users/users.repository'
import { MailService } from 'src/mail/mail.service';

@Injectable()
export class AuthService {
  constructor(
    private readonly userRepository: UserRepository,
    private readonly jwtService: JwtService,
    private readonly mailService: MailService,
  ) {}
  getAuth(): string {
    return 'Auth';
  }
  async signIn(email: string, password: string) {
    const user = await this.userRepository.getUserByEmail(email);
    if (!email || !password) return 'Datos obligatorios';
    if (!user) throw new BadRequestException('Credenciales invalidas');
    const validPass = await bcrypt.compare(password, user.password);
    if (!validPass) throw new BadRequestException('Credenciales invalidas');
    const payload = {
      id: user.id,
      email: user.email,
      isAdmin: user.isAdmin,
    };
    const token = this.jwtService.sign(payload);
    return {
      message: 'Usuario loggeado',
      token,
      email: user.email,
      name: user.name
    };
  }

  async signUp(user: Partial<Users>): Promise<Partial<Users>> {
    const { email, password } = user;
    const foundUser = await this.userRepository.getUserByEmail(email);
    if (foundUser) throw new BadRequestException('Email Registrado, ingresa');

    const hashedPass = await bcrypt.hash(password, 10);

    const createdUser = await this.userRepository.createUser({
      ...user,
      password: hashedPass,
    });

    await this.mailService.sendMail(
      createdUser.email,
      'Bienvenido a My App',
      `Hola ${createdUser.name}, gracias por registrarte en nuestra aplicación.`,
    );

    return {};
  }
}