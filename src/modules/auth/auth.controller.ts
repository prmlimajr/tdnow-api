import { Controller, Post, Body, HttpCode, Param } from '@nestjs/common';
import { LoginDto } from './dto/login.dto';
import { AuthService } from './auth.service';
import { ApiTags } from '@nestjs/swagger';

@ApiTags('Autenticação')
@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @Post()
  @HttpCode(200)
  login(@Body() credentials: LoginDto) {
    return this.authService.login(credentials);
  }

  @Post('forgot-password')
  async forgotPassword(@Body() { email }: { email: string }) {
    return this.authService.generatePasswordResetToken(email);
  }

  @Post('reset-password/:token')
  async resetPassword(
    @Param('token') token: string,
    @Body()
    {
      password,
      passwordConfirmation,
    }: { password: string; passwordConfirmation: string },
  ) {
    return this.authService.validatePasswordResetToken(token, {
      password,
      passwordConfirmation,
    });
  }
}
