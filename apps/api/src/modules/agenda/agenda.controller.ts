import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Query,
  Request,
  UseGuards,
} from '@nestjs/common';
import { AgendaService } from './agenda.service';
import { CreateAgendaDto } from '../dto/create-agenda.dto';
import { UpdateAgendaDto } from '../dto/update-agenda.dto';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { CurrentUser } from '../auth/decorators/current-user.decorator';

@UseGuards(JwtAuthGuard)
@Controller('agenda')
export class AgendaController {
  constructor(private readonly agendaService: AgendaService) {}

  @Post()
  create(
    @Body() createAgendaDto: CreateAgendaDto,
    @CurrentUser() user: { userId: string; clinicId: string },
  ) {
    return this.agendaService.create(createAgendaDto, user.clinicId);
  }

  @Get()
  findAll(
    @CurrentUser() user: { userId: string; clinicId: string },
    @Query('startDate') startDate?: string,
    @Query('endDate') endDate?: string,
  ) {
    return this.agendaService.findAll(user.clinicId, startDate, endDate);
  }

    // Precisa vir ANTES de @Get(':id') — senão o NestJS entende "stats"
  // como se fosse o :id de um agendamento.
  @Get('stats/revenue-by-month')
  revenueByMonth(
    @CurrentUser() user: { userId: string; clinicId: string },
    @Query('months') months?: string,
  ) {
    const parsed = months ? parseInt(months, 10) : 6;
    const safeMonths = Number.isFinite(parsed) && parsed > 0 ? Math.min(parsed, 24) : 6;
    return this.agendaService.getMonthlyRevenue(user.clinicId, safeMonths);
  }

  @Get(':id')
  findOne(
    @Param('id') id: string,
    @CurrentUser() user: { userId: string; clinicId: string },
  ) {
    return this.agendaService.findOne(id, user.clinicId);
  }

  @Patch(':id')
  update(
    @Param('id') id: string,
    @Body() updateAgendaDto: UpdateAgendaDto,
    @CurrentUser() user: { userId: string; clinicId: string },
  ) {
    return this.agendaService.update(id, updateAgendaDto, user.clinicId);
  }

  @Delete(':id')
  remove(
    @Param('id') id: string,
    @CurrentUser() user: { userId: string; clinicId: string },
  ) {
    return this.agendaService.remove(id, user.clinicId);
  }
}
