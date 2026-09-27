import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Query,
  UseGuards,
} from '@nestjs/common';
import { PatientsService, PatientSearchField } from './patients.service';
import { CreatePatientsDto } from '../dto/create-patient.dto';
import { UpdatePatientsDto } from '../dto/update-patient.dto';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { CurrentUser } from '../auth/decorators/current-user.decorator';

const VALID_SEARCH_FIELDS: PatientSearchField[] = ['all', 'name', 'email', 'cpf'];

@UseGuards(JwtAuthGuard)
@Controller('patients')
export class PatientsController {
  constructor(private readonly patientsService: PatientsService) {}

  @Post()
  create(
    @Body() createPatientDto: CreatePatientsDto,
    @CurrentUser() user: { userId: string; clinicId: string },
  ) {
    return this.patientsService.create(createPatientDto, user.clinicId);
  }

  @Get()
  findAll(
    @CurrentUser() user: { userId: string; clinicId: string },
    @Query('page') page?: string,
    @Query('limit') limit?: string,
    @Query('search') search?: string,
    @Query('searchField') searchField?: string,
  ) {
    const pageNum = page ? parseInt(page, 10) : 1;
    const limitNum = limit ? parseInt(limit, 10) : 10;
    const field: PatientSearchField = VALID_SEARCH_FIELDS.includes(
      searchField as PatientSearchField,
    )
      ? (searchField as PatientSearchField)
      : 'all';

    return this.patientsService.findAll(user.clinicId, pageNum, limitNum, search, field);
  }

  @Get(':id')
  findOne(
    @Param('id') id: string,
    @CurrentUser() user: { userId: string; clinicId: string },
  ) {
    return this.patientsService.findOne(id, user.clinicId);
  }

  @Patch(':id')
  update(
    @Param('id') id: string,
    @Body() updatePatientDto: UpdatePatientsDto,
    @CurrentUser() user: { userId: string; clinicId: string },
  ) {
    return this.patientsService.update(id, updatePatientDto, user.clinicId);
  }

  @Delete(':id')
  remove(
    @Param('id') id: string,
    @CurrentUser() user: { userId: string; clinicId: string },
  ) {
    return this.patientsService.remove(id, user.clinicId);
  }
}