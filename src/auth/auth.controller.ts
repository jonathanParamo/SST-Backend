import {
  Body,
  Controller,
  Post,
  Res,
  UnauthorizedException,
} from '@nestjs/common';
import type { Response } from 'express';
import { AuthService } from './auth.service';
import { SigninDto } from './dto/signin.dto';

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @Post('signin')
  async signin(
    @Body() body: SigninDto,
    @Res({ passthrough: true }) res: Response,
  ) {
    const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    if (!emailRegex.test(body.email)) {
      throw new UnauthorizedException('Formato de correo inválido');
    }

    const user = await this.authService.validateUser(body.email, body.password);
    if (!user) throw new UnauthorizedException('Credenciales incorrectas');

    const token = await this.authService.login(user);

    res.cookie('auth_token', token.access_token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      maxAge: 1000 * 60 * 60,
    });

    return {
      message: 'Login exitoso',
      user: { id: user._id, email: user.email, role: user.role },
    };
  }
}
