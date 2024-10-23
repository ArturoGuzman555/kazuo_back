import { BadRequestException, Injectable } from '@nestjs/common';
import * as bcrypt from 'bcrypt';
import { JwtService } from '@nestjs/jwt';
import { InjectRepository } from '@nestjs/typeorm';
import { Users } from 'src/Entities/users.entity';
import { Repository, MoreThan } from 'typeorm';
import { MailService } from 'src/mail/mail.service';
import { v4 as uuidv4 } from 'uuid';


@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(Users)
    private readonly userRepository: Repository<Users>,
    private readonly jwtService: JwtService,
    private readonly mailService: MailService,
  ) {}

  getAuth(): string {
    return 'Auth';
  }

  async signIn(email: string, password: string) {
    if (!email || !password) return 'Datos obligatorios';
    
    const user = await this.userRepository.findOne({ where: { email } });
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
      name: user.name,
    };
  }

  async signUp(user: Partial<Users>): Promise<Partial<Users>> {
    const { email, password } = user;
    
    const foundUser = await this.userRepository.findOne({ where: { email } });
    if (foundUser) throw new BadRequestException('Email registrado, ingresa');
    
  
    const hashedPass = await bcrypt.hash(password, 10);
    

    const createdUser = await this.userRepository.save({
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

    const resetUrl = `https://frontend.com/reset-password?token=${token}`;
    await this.mailService.sendMail(
      email,
      'Restablecimiento de contraseña',
      `Haga clic en el siguiente enlace para restablecer su contraseña: ${resetUrl}`,
    );

    return 'Correo enviado para restablecer la contraseña';
  }

  async resetPassword(token: string, newPassword: string, confirmNewPass: string): Promise<string> {
    
    // Verificar que las contraseñas coincidan
    if (newPassword !== confirmNewPass) {
        throw new BadRequestException('Las contraseñas no coinciden');
    }

    // Buscar el usuario por el token de restablecimiento de contraseña
    const user = await this.userRepository.findOne({
      where: {
        resetPasswordToken: token,
        resetPasswordExpires: MoreThan(new Date()), // Validar que el token no haya expirado
      },
    });

    if (!user) throw new BadRequestException('Token inválido o expirado');

    // Encriptar la nueva contraseña
    const hashedPass = await bcrypt.hash(newPassword, 10);

    // Actualizar la contraseña del usuario y eliminar el token de restablecimiento
    await this.userRepository.update(user.id, {
      password: hashedPass,
      resetPasswordToken: null,
      resetPasswordExpires: null,
    });

    return 'Contraseña actualizada correctamente';
}

}
