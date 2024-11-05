import {
  CanActivate,
  ExecutionContext,
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { Observable } from 'rxjs';
import { Role } from 'src/decorators/roles.enum';

@Injectable()
export class AuthGuard implements CanActivate {
  constructor(private readonly jwtService: JwtService) {}

  canActivate(
    context: ExecutionContext,
  ): boolean | Promise<boolean> | Observable<boolean> {
    const request = context.switchToHttp().getRequest();

    const token = request.headers.authorization?.split(' ')[1];
    if (!token) throw new UnauthorizedException('Se requiere Token');

    try {
      const secret = process.env.JWT_SECRET;
      const payload = this.jwtService.verify(token, { secret });

      payload.exp = new Date(payload.exp * 1000);
      payload.iat = new Date(payload.iat * 1000);

      const roles: Role[] = [];
      if (payload.isAdmin) {
        roles.push(Role.Admin);
      }
      if (payload.isSuperAdmin) {
        roles.push(Role.SuperAdmin);
      }

      console.log('Roles del usuario:', roles);

      request.user = {
        userId: payload.id,
        roles: roles,
      };

      if (
        request.body &&
        request.body.userId &&
        request.body.userId !== payload.id
      ) {
        throw new NotFoundException('Sin autorización');
      }

      if (request.method === 'PUT' || request.method === 'DELETE') {
        const userIdToModify = request.params.id;

        if (
          request.user.roles.includes(Role.SuperAdmin) ||
          request.user.roles.includes(Role.Admin) ||
          request.user.userId === userIdToModify
        ) {
          return true;
        } else {
          throw new UnauthorizedException(
            'No tienes permiso para modificar a este usuario',
          );
        }
      }

      return true;
    } catch (error) {
      throw new UnauthorizedException('Token invalido');
    }
  }
}
