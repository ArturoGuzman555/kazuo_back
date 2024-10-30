import {
  Body,
  Controller,
  Get,
  Post,
  Req,
  Res,
  UseGuards,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { ApiTags } from '@nestjs/swagger';
import {
  CreateUserDto,
  EncryptPasswordDto,
  LoginUserDto,
  RequestPasswordResetDto,
  ResetPasswordDto,
} from 'src/modules/users/user.dto';
import { ResetPasswordGuard } from './guards/resetpass-guard.guard';
import { AuthGuard } from '@nestjs/passport';

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
    console.log(credentials);
    const { email, password } = credentials;

    console.log(email, password);
    return this.authService.signIn(email, password);
  }

  @Post('/signup')
  async signUp(@Body() users: CreateUserDto) {
    const result = await this.authService.signUp(users);
    console.log('Resultado de la creación de usuario:', result);
    return result;
  }
  @Post('/request-password-reset')
  async requestPasswordReset(
    @Body() requestPasswordResetDto: RequestPasswordResetDto,
  ) {
    return this.authService.requestPasswordReset(requestPasswordResetDto.email);
  }
  @Post('/reset-password')
  @UseGuards(ResetPasswordGuard)
  async resetPassword(@Body() resetPasswordDto: ResetPasswordDto) {
    const { token, newPassword, confirmNewPass } = resetPasswordDto;
    return this.authService.resetPassword(token, newPassword, confirmNewPass);
  }

  @Post('encrypt-password')
  async encryptPassword(@Body() encryptPasswordDto: EncryptPasswordDto) {
    const { password } = encryptPasswordDto;
    const encryptedPassword = await this.authService.hashPassword(password);
    return { encryptedPassword };
  }

  @Get('auth0')
  @UseGuards(AuthGuard('auth0'))
  async auth0Login() {
    // Esta ruta redirige a Auth0 para autenticación.
  }

  @Get('auth0-callback')
  @UseGuards(AuthGuard('auth0'))
  async auth0Callback(@Req() req, @Res() res) {
    const { user, token } = await this.authService.auth0Login(req.user);
    res.redirect(`http://frontend-url.com/callback?token=${token}`);
  }
}
