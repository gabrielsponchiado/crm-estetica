import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { PrismaModule } from './prisma/prisma.module';
import { ProceduresModule } from './modules/procedures/procedures.module';
import { PatientsModule } from './modules/patients/patients.module';
import { AgendaModule } from './modules/agenda/agenda.module';
import { AuthModule } from './modules/auth/auth.module';

@Module({
  imports: [PrismaModule, ProceduresModule, PatientsModule, AgendaModule, AuthModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
