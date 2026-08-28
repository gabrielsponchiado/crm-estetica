import { Module } from '@nestjs/common';
import { APP_GUARD } from '@nestjs/core';
import { ThrottlerModule, ThrottlerGuard } from '@nestjs/throttler';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { PrismaModule } from './prisma/prisma.module';
import { ProceduresModule } from './modules/procedures/procedures.module';
import { PatientsModule } from './modules/patients/patients.module';
import { AgendaModule } from './modules/agenda/agenda.module';
import { AuthModule } from './modules/auth/auth.module';

@Module({
  imports: [
    // Limite padrão pra toda a API: 100 requisições por minuto por IP.
    // Rotas específicas (como login/registro) podem sobrescrever isso com
    // @Throttle() para um limite mais apertado.
    ThrottlerModule.forRoot([
      {
        ttl: 60_000,
        limit: 100,
      },
    ]),
    PrismaModule,
    ProceduresModule,
    PatientsModule,
    AgendaModule,
    AuthModule,
  ],
  controllers: [AppController],
  providers: [
    AppService,
    {
      provide: APP_GUARD,
      useClass: ThrottlerGuard,
    },
  ],
})
export class AppModule {}