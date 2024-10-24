import { BadRequestException, Injectable } from '@nestjs/common';
import * as bcrypt from 'bcrypt';
import { JwtService } from '@nestjs/jwt';
import { InjectRepository } from '@nestjs/typeorm';
import { Users } from 'src/Entities/users.entity';
import { Repository, MoreThan } from 'typeorm';
import { MailService } from 'src/mail/mail.service';
import { v4 as uuidv4 } from 'uuid';
import { CryptoService } from 'src/crypto/crypto.service';
import { UserRepository } from '../users/users.repository';

@Injectable()
export class AuthService {
  constructor(
    private readonly userRepository: UserRepository,
    private readonly jwtService: JwtService,
    private readonly mailService: MailService,
    private readonly cryptoService: CryptoService,
  ) {}

  getAuth(): string {
    return 'Auth';
  }

  async signIn(email: string, password: string) {
    if (!email || !password) return 'Datos obligatorios';
  
    const user = await this.userRepository.getUserByEmail(email);
    if (!user) throw new BadRequestException('Credenciales invalidas');
  
    // Comparar la contraseña ingresada con la almacenada (ya cifrada)
    const validPass = await bcrypt.compare(password, user.password);
    if (!validPass) throw new BadRequestException('Credenciales inválidas');
  
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
      name: user.name,
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
      'Bienvenido a Kazuo',
      `Hola ${createdUser.name}, gracias por registrarte en nuestra aplicación.`,
    );

    return {};
  }

  async requestPasswordReset(email: string): Promise<string> {
    const user = await this.userRepository.findOne({ where: { email } });
    if (!user) throw new BadRequestException('Email no encontrado');

    const token = uuidv4();
    const expirationTime = new Date();
    expirationTime.setHours(expirationTime.getHours() + 1);

    await this.userRepository.update(user.id, {
      resetPasswordToken: token,
      resetPasswordExpires: expirationTime,
    });

    const resetUrl = `http://localhost:3000/UpdatePass?token=${token}`;
    await this.mailService.sendMail(
      email,
      'Restablecimiento de contraseña',
      `Haga clic en el siguiente enlace para restablecer su contraseña: ${resetUrl}`,
    );

    return token; //('Correo enviado para restablecer la contraseña');
  }

  async resetPassword(
    token: string,
    newPassword: string,
    confirmNewPass: string,
  ): Promise<string> {
    if (newPassword !== confirmNewPass) {
      throw new BadRequestException('Las contraseñas no coinciden');
    }

    const user = await this.userRepository.findOne({
      where: {
        resetPasswordToken: token,
        resetPasswordExpires: MoreThan(new Date()),
      },
    });

    if (!user) throw new BadRequestException('Token inválido o expirado');
    if (newPassword !== confirmNewPass)
      throw new BadRequestException('Las contrasñas deben coincidir');
    if (newPassword.length && confirmNewPass.length < 8)
      throw new BadRequestException(
        'Debe tener una longuitud minimo de 8 caracteres',
      );

    const hashedPass = await bcrypt.hash(newPassword, 10);

    await this.userRepository.update(user.id, {
      password: hashedPass,
      resetPasswordToken: null,
      resetPasswordExpires: null,
    });

    return 'Contraseña actualizada correctamente';
  }

  async hashPassword(password: string): Promise<string> {
    const salt = await bcrypt.genSalt();
    return bcrypt.hash(password, salt);
  }
}
