import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { AuthService } from '././auth.service';
import { AuthController } from '././auth.controller';
import { JwtStrategy } from '././jwt.strategy';
import { PrismaModule } from '../../prisma/prisma.module';

if (!process.env.JWT_SECRET) {
  throw new Error(
    'JWT_SECRET não está definido.',
  );
}

@Module({
  imports: [
    PrismaModule,
    PassportModule,
    JwtModule.register({
      secret: process.env.JWT_SECRET,
      signOptions: { expiresIn: '7d' },
    }),
  ],
  controllers: [AuthController],
  providers: [AuthService, JwtStrategy],
})
export class AuthModule {}