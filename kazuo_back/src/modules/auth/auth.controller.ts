import { Body, Controller, Get, Post, UseGuards } from '@nestjs/common';
import { AuthService } from './auth.service';
import { ApiTags } from '@nestjs/swagger';
import { CreateUserDto, LoginUserDto } from 'src/modules/users/user.dto';
//import { ResetPasswordGuard } from './guards/resetpass-guard.guard';

@ApiTags('auth')
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Get()
  getAuth(): string {
    return this.authService.getAuth();
  }
  @Post('/signin')
  async singIn(@Body() credentials: LoginUserDto) {
    const { email, password } = credentials;
    return this.authService.signIn(email, password);
  }

  @Post('/signup')
  async signUp(@Body() users: CreateUserDto) {
    const result = await this.authService.signUp(users);
    console.log('Resultado de la creación de usuario:', result);
    return result;
  }
  @Post('/request-password-reset')
  async requestPasswordReset(@Body('email') email: string) {
    return this.authService.requestPasswordReset(email);
  }

  @Post('/reset-password')
  //@UseGuards(ResetPasswordGuard)
  async resetPassword(@Body('token') token: string, @Body('password') password: string) {
    return this.authService.resetPassword(token, password);
  }
}
