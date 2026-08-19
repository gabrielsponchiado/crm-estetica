import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { PrismaModule } from './prisma/prisma.module';
import { ProceduresModule } from './modules/procedures/procedures.module';
import { PatientsModule } from './modules/patients/patients.module';
import { AgendaModule } from './modules/agenda/agenda.module';

@Module({
  imports: [PrismaModule, ProceduresModule, PatientsModule, AgendaModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
