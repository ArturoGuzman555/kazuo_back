import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { Strategy, ExtractJwt } from 'passport-jwt';
import { AuthService } from './auth.service';
import { UsersService } from '../users/users.service';


@Injectable()
export class Auth0Strategy extends PassportStrategy(Strategy, 'auth0') {
  constructor(
    private authService: AuthService,
    private usersService: UsersService, 
  ) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: 'YOUR_AUTH0_CLIENT_SECRET',
    });
  }

  async validate(payload: any) {
    const user = await this.usersService.findUserByAuth0Id(payload.sub);
    
    if (!user) {
      throw new Error('Usuario no encontrado en la base de datos');
    }
    return user;
  }
}
