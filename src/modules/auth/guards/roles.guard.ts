import {
  CanActivate,
  ExecutionContext,
  ForbiddenException,
  Injectable,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { Observable } from 'rxjs';
import { Role } from 'src/decorators/roles.enum';

@Injectable()
export class RolesGuard implements CanActivate {
  constructor(private readonly reflector: Reflector) {}

  canActivate(
    context: ExecutionContext,
  ): boolean | Promise<boolean> | Observable<boolean> {
    // Obtener los roles requeridos de los metadatos
    const requiredRoles = this.reflector.getAllAndOverride<Role[]>('roles', [
      context.getHandler(),
      context.getClass(),
    ]);

    // Si no se requieren roles específicos, permitir el acceso
    if (!requiredRoles) return true;

    const request = context.switchToHttp().getRequest();
    const user = request.user;

    // Comprobar si el usuario tiene alguno de los roles requeridos
    const hasRole = () =>
      requiredRoles.some((role) => user?.roles?.includes(role));

    // Validar la autorización
    const valid = user?.roles && hasRole();

    if (!valid) {
      throw new ForbiddenException(
        'No tienes autorización de acceso para esta ruta',
      );
    }

    return valid;
  }
}

