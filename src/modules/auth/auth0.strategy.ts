// // import { Injectable } from '@nestjs/common';
// // import { PassportStrategy } from '@nestjs/passport';
// // import { Strategy } from 'passport-auth0';
// // import { ConfigService } from '@nestjs/config';

// import { ExtractJwt, Strategy } from 'passport-jwt';
// import { PassportStrategy } from '@nestjs/passport';
// import { Injectable } from '@nestjs/common';
// import { ConfigService } from '@nestjs/config';
// import { Request } from 'express';

// @Injectable()
// export class Auth0Strategy extends PassportStrategy(Strategy, 'auth0') {
//   // constructor(private readonly configService: ConfigService) {
//   //   super({
//   //     domain: configService.get('AUTH0_DOMAIN'),
//   //     clientID: configService.get('AUTH0_CLIENT_ID'),
//   //     clientSecret: configService.get('AUTH0_CLIENT_SECRET'),
//   //     callbackURL: configService.get('AUTH0_CALLBACK_URL'),
//   //     scope: 'openid profile email',
//   //   });
//   // }

//   constructor(private readonly configService: ConfigService) {
//     super({
//       jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
//       ignoreExpiration: false,
//       secretOrKey: configService.get('JWT_SECRET'),
//     });
//   }

//   // async validate(accessToken, refreshToken, extraParams, profile) {
//   //   return profile;
//   // }

//   async validate(request: Request, payload: any) {
//     const roles = payload['https://example.com/roles']; // Obtén los roles del usuario
//     // Asigna los roles a la solicitud
//     request['user'] = { ...payload, roles };
//     return true;
//   }
// }
