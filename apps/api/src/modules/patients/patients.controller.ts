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
  ForbiddenException,
} from '@nestjs/common';
import { PatientsService, PatientSearchField } from './patients.service';
import { CreatePatientsDto } from '../dto/create-patient.dto';
import { UpdatePatientsDto } from '../dto/update-patient.dto';
import { QueryPatientsDto } from '../dto/query-patients.dto';
import { CreatePatientProcedureDto } from '../dto/create-patient-procedure.dto';
import { UpdatePatientProcedureDto } from '../dto/update-patient-procedure.dto';
import { CreateQuoteDto } from '../dto/create-quote.dto';
import { UpdateQuoteDto } from '../dto/update-quote.dto';
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

  @Post(':id/procedures')
  createProcedure(
    @Param('id') id: string,
    @Body() dto: CreatePatientProcedureDto,
    @CurrentUser()
    user: {
      userId: string;
      clinicId: string;
      role?: string;
    },
  ) {
    this.ensureProcedureMutationPermission(user.role);

    return this.patientsService.createProcedureRecord(
      id,
      dto,
      user.clinicId,
    );
  }

  @Patch(':id/procedures/:patientProcedureId')
  updateProcedure(
    @Param('id') id: string,
    @Param('patientProcedureId') patientProcedureId: string,
    @Body() dto: UpdatePatientProcedureDto,
    @CurrentUser()
    user: {
      userId: string;
      clinicId: string;
      role?: string;
    },
  ) {
    this.ensureProcedureMutationPermission(user.role);

    return this.patientsService.updateProcedureRecord(
      id,
      patientProcedureId,
      dto,
      user.clinicId,
    );
  }

  @Post(':id/quotes')
  createQuote(
    @Param('id') id: string,
    @Body() dto: CreateQuoteDto,
    @CurrentUser()
    user: {
      userId: string;
      clinicId: string;
      role?: string;
    },
  ) {
    this.ensureQuoteMutationPermission(user.role);

    return this.patientsService.createQuote(
      id,
      dto,
      user.clinicId,
    );
  }

  @Patch(':id/quotes/:quoteId')
  updateQuote(
    @Param('id') id: string,
    @Param('quoteId') quoteId: string,
    @Body() dto: UpdateQuoteDto,
    @CurrentUser()
    user: {
      userId: string;
      clinicId: string;
      role?: string;
    },
  ) {
    this.ensureQuoteMutationPermission(user.role);

    return this.patientsService.updateQuote(
      id,
      quoteId,
      dto,
      user.clinicId,
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

  private ensureProcedureMutationPermission(role?: string) {
    if (role !== 'ADMIN' && role !== 'CLINICIAN') {
      throw new ForbiddenException(
        'Seu perfil não tem permissão para alterar procedimentos realizados.',
      );
    }
  }

  private ensureQuoteMutationPermission(role?: string) {
    if (role !== 'ADMIN' && role !== 'CLINICIAN') {
      throw new ForbiddenException(
        'Seu perfil não tem permissão para alterar orçamentos.',
      );
    }
  }
}