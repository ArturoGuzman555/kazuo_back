import { Injectable, CanActivate, ExecutionContext, BadRequestException } from '@nestjs/common';
import { AuthService } from '../auth.service';


@Injectable()
export class ResetPasswordGuard implements CanActivate {
  constructor(private readonly authService: AuthService) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();
    
    const token = request.body.token;
    const newPassword = request.body.password;

    if (!token) {
      throw new BadRequestException('Se requiere un token para restablecer la contraseña');
    }
    if (!newPassword || newPassword.length < 8) {
      throw new BadRequestException('La nueva contraseña debe tener al menos 8 caracteres');
    }


    return true; // Si todas las validaciones pasan, permitimos el acceso
  }
}
