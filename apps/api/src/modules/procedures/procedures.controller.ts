import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards } from '@nestjs/common';
import { ProceduresService } from './procedures.service';
import { CreateProcedureDto } from '../dto/create-procedure.dto';
import { UpdateProcedureDto } from '../dto/update-procedure.dto';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { CurrentUser } from '../auth/decorators/current-user.decorator';

@UseGuards(JwtAuthGuard)
@Controller('procedures')
export class ProceduresController {
  constructor(private readonly proceduresService: ProceduresService) {}

  @Post()
  create(
    @Body() createProcedureDto: CreateProcedureDto,
    @CurrentUser() user: { userId: string; clinicId: string },
  ) {
    return this.proceduresService.create(createProcedureDto, user.clinicId);
  }

  @Get()
  findAll(@CurrentUser() user: { userId: string; clinicId: string }) {
    return this.proceduresService.findAll(user.clinicId);
  }

  @Get(':id')
  findOne(
    @Param('id') id: string,
    @CurrentUser() user: { userId: string; clinicId: string },
  ) {
    return this.proceduresService.findOne(id, user.clinicId);
  }

  @Patch(':id')
  update(
    @Param('id') id: string,
    @Body() updateProcedureDto: UpdateProcedureDto,
    @CurrentUser() user: { userId: string; clinicId: string },
  ) {
    return this.proceduresService.update(id, updateProcedureDto, user.clinicId);
  }

  @Delete(':id')
  remove(
    @Param('id') id: string,
    @CurrentUser() user: { userId: string; clinicId: string },
  ) {
    return this.proceduresService.remove(id, user.clinicId);
  }
}