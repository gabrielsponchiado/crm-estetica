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
import { QueryPatientsDto } from '../dto/query-patients.dto';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { CurrentUser } from '../auth/decorators/current-user.decorator';

const VALID_SEARCH_FIELDS: PatientSearchField[] = [
  'all',
  'name',
  'email',
  'cpf',
];

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
    @Query() query: QueryPatientsDto,
  ) {
    const page = query.page ?? 1;
    const limit = query.limit ?? 10;

    const field: PatientSearchField = VALID_SEARCH_FIELDS.includes(
      query.searchField as PatientSearchField,
    )
      ? (query.searchField as PatientSearchField)
      : 'all';

    return this.patientsService.findAll(
      user.clinicId,
      page,
      limit,
      query.search,
      field,
    );
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
