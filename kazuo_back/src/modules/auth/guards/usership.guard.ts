import {
  CanActivate,
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { Observable } from 'rxjs';

@Injectable()
export class UserOwnershipGuard implements CanActivate {
  canActivate(
    context: ExecutionContext,
  ): boolean | Promise<boolean> | Observable<boolean> {
    const request = context.switchToHttp().getRequest();
    const userIdFromParams = request.params.id;
    const userIdFromToken = request.user.userId;

    if (userIdFromParams !== userIdFromToken) {
      throw new UnauthorizedException(
        'No tienes permiso para ver/modificar este usuario',
      );
    }

    return true;
  }
}
