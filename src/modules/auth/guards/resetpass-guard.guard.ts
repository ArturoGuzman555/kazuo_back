import {
  Injectable,
  CanActivate,
  ExecutionContext,
  BadRequestException,
} from '@nestjs/common';
import { AuthService } from '../auth.service';

@Injectable()
export class ResetPasswordGuard implements CanActivate {
  constructor(private readonly authService: AuthService) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();

    const token = request.body.token;
    const newPassword = request.body.newPassword;
    const confirmNewPass = request.body.confirmNewPass;

    if (!token) {
      throw new BadRequestException(
        'Se requiere un token para restablecer la contraseña',
      );
    }

    if (!newPassword || !confirmNewPass) {
      throw new BadRequestException(
        'Debe proporcionar y confirmar la nueva contraseña',
      );
    }

    if (newPassword !== confirmNewPass) {
      throw new BadRequestException('Las contraseñas no coinciden');
    }

    return true;
  }
}
