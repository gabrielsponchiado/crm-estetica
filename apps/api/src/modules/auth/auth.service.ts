import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { LoginDto } from './dto/login.dto';
import { RegisterDto } from './dto/register.dto';
import { ForgotPasswordDto } from './dto/forgot-password.dto';
import { ResetPasswordDto } from './dto/reset-password.dto';
import { User } from '@prisma/client';
import { randomBytes, createHash } from 'crypto';
import { Resend } from 'resend';

@Injectable()
export class AuthService {
  private readonly resend: Resend;

  constructor(
    private prisma: PrismaService,
    private jwtService: JwtService,
  ) {
    if (!process.env.RESEND_API_KEY) {
      throw new Error('RESEND_API_KEY não está definido.');
    }

    this.resend = new Resend(process.env.RESEND_API_KEY);
  }

  async validateUser(
    email: string,
    pass: string,
  ): Promise<Omit<User, 'password'> | null> {
    const user = await this.prisma.user.findUnique({
      where: { email },
    });

    if (user && (await bcrypt.compare(pass, user.password))) {
      const { password, ...result } = user;
      return result;
    }

    return null;
  }

  async login(loginDto: LoginDto) {
    const user = await this.validateUser(loginDto.email, loginDto.password);

    if (!user) {
      throw new UnauthorizedException('Invalid credentials');
    }

    const payload = {
      sub: user.id,
      tokenVersion: user.tokenVersion,
    };

    return {
      access_token: this.jwtService.sign(payload),
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role,
        clinicId: user.clinicId,
      },
    };
  }

  async logout(userId: string) {
    await this.prisma.user.update({
      where: { id: userId },
      data: {
        tokenVersion: { increment: 1 },
      },
    });
  }

  async register(registerDto: RegisterDto) {
    const hashedPassword = await bcrypt.hash(registerDto.password, 10);

    return this.prisma.$transaction(async (tx) => {
      const clinic = await tx.clinic.create({
        data: {
          name: registerDto.clinicName,
          document: registerDto.document,
        },
      });

      const user = await tx.user.create({
        data: {
          email: registerDto.email,
          password: hashedPassword,
          name: registerDto.name,
          clinicId: clinic.id,
          role: 'ADMIN',
        },
      });

      const { password, ...result } = user;
      return result;
    });
  }

  async forgotPassword(email: string) {
    const user = await this.prisma.user.findUnique({
      where: { email },
    });

    const message =
      'Se o e-mail estiver cadastrado, você receberá instruções para redefinir sua senha.';

    if (!user) {
      return { message };
    }

    const token = randomBytes(32).toString('hex');

    const tokenHash = createHash('sha256').update(token).digest('hex');

    const expiresAt = new Date(Date.now() + 60 * 60 * 1000);

    await this.prisma.passwordResetToken.deleteMany({
      where: {
        userId: user.id,
        usedAt: null,
      },
    });

    await this.prisma.passwordResetToken.create({
      data: {
        tokenHash,
        userId: user.id,
        expiresAt,
      },
    });

    const frontendUrl = process.env.FRONTEND_URL ?? 'http://localhost:3000';

    const resetUrl = `${frontendUrl}/reset-password?token=${token}`;

    const from = process.env.PASSWORD_RESET_FROM ?? 'onboarding@resend.dev';

    const { error } = await this.resend.emails.send({
      from,
      to: ['gabrielhssponchiado@gmail.com'],
      subject: 'Redefinição de senha - CRM Clínica',
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h2>Redefinição de senha</h2>

          <p>Olá, ${user.name}.</p>

          <p>
            Recebemos uma solicitação para redefinir sua senha.
          </p>

          <p>
            Clique no botão abaixo para criar uma nova senha:
          </p>

          <p>
            <a
              href="${resetUrl}"
              style="
                display: inline-block;
                padding: 12px 20px;
                background-color: #e11d48;
                color: #ffffff;
                text-decoration: none;
                border-radius: 6px;
              "
            >
              Redefinir minha senha
            </a>
          </p>

          <p>
            Este link expira em 1 hora.
          </p>

          <p>
            Se você não solicitou a redefinição, pode ignorar este e-mail.
          </p>

          <p>
            Atenciosamente,<br />
            CRM Clínica
          </p>
        </div>
      `,
    });

    if (error) {
      console.error(
        '[PASSWORD RESET] Erro ao enviar e-mail:',
        JSON.stringify(error, null, 2),
      );

      throw new Error('Não foi possível enviar o e-mail de recuperação.');
    }

    if (process.env.NODE_ENV !== 'production') {
      console.log(`[PASSWORD RESET] Enviado para: ${user.email}`);
      console.log(`[PASSWORD RESET] Link: ${resetUrl}`);
    }

    return { message };
  }

  async resetPassword(token: string, password: string) {
    const tokenHash = createHash('sha256').update(token).digest('hex');

    const resetToken = await this.prisma.passwordResetToken.findUnique({
      where: {
        tokenHash,
      },
    });

    if (
      !resetToken ||
      resetToken.usedAt ||
      resetToken.expiresAt <= new Date()
    ) {
      throw new UnauthorizedException('Token inválido ou expirado');
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    await this.prisma.$transaction(async (tx) => {
      await tx.user.update({
        where: {
          id: resetToken.userId,
        },
        data: {
          password: hashedPassword,
          tokenVersion: {
            increment: 1,
          },
        },
      });

      await tx.passwordResetToken.update({
        where: {
          id: resetToken.id,
        },
        data: {
          usedAt: new Date(),
        },
      });

      await tx.passwordResetToken.deleteMany({
        where: {
          userId: resetToken.userId,
          id: {
            not: resetToken.id,
          },
          usedAt: null,
        },
      });
    });

    return {
      message: 'Senha redefinida com sucesso',
    };
  }
}