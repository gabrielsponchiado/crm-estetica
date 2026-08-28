import { Controller, Post, Body, Res } from '@nestjs/common';
import { Throttle } from '@nestjs/throttler';
import { Response } from 'express';
import { AuthService } from './auth.service';
import { LoginDto } from './dto/login.dto';
import { RegisterDto } from '././dto/register.dto';

// Cookie sempre 'lax': com o proxy do Next.js (next.config.js rewrites),
// o navegador só fala com o próprio domínio do site — a chamada para a API
// nunca é "cross-site" do ponto de vista do navegador. 'none' era mais
// permissivo do que o necessário e enfraquecia a proteção contra CSRF.
const COOKIE_OPTIONS = {
  httpOnly: true,
  secure: process.env.NODE_ENV === 'production',
  sameSite: 'lax' as const,
  path: '/',
};

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  // Limita tentativas de login: no máximo 5 a cada 60 segundos, por IP.
  // Protege contra brute-force de senha.
  @Throttle({ default: { limit: 5, ttl: 60_000 } })
  @Post('login')
  async login(
    @Body() loginDto: LoginDto,
    @Res({ passthrough: true }) res: Response,
  ) {
    const result = await this.authService.login(loginDto);

    res.cookie('crm_auth_token', result.access_token, {
      ...COOKIE_OPTIONS,
      maxAge: 7 * 24 * 60 * 60 * 1000, // 7 dias
    });

    return { user: result.user };
  }

  @Post('logout')
  async logout(@Res({ passthrough: true }) res: Response) {
    res.clearCookie('crm_auth_token', COOKIE_OPTIONS);
    return { success: true };
  }

  // Também limitado: registro cria usuário + clínica no banco, não deve
  // ser algo que dá pra automatizar em massa.
  @Throttle({ default: { limit: 5, ttl: 60_000 } })
  @Post('register')
  async register(@Body() registerDto: RegisterDto) {
    return this.authService.register(registerDto);
  }
}