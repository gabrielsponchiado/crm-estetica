import {
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreatePatientsDto } from '../dto/create-patient.dto';
import { UpdatePatientsDto } from '../dto/update-patient.dto';
import { CreatePatientProcedureDto } from '../dto/create-patient-procedure.dto';
import { UpdatePatientProcedureDto } from '../dto/update-patient-procedure.dto';
import { CreateQuoteDto } from '../dto/create-quote.dto';
import { UpdateQuoteDto } from '../dto/update-quote.dto';

export type PatientSearchField = 'all' | 'name' | 'email' | 'cpf';

@Injectable()
export class PatientsService {
  constructor(private readonly prisma: PrismaService) {}

  async create(dto: CreatePatientsDto, clinicId: string) {
    try {
      return await this.prisma.patient.create({
        data: {
          clinicId,
          name: dto.name,
          phone: dto.phone,
          cpf: dto.cpf,
          email: dto.email,
          birthDate: dto.birthDate ? new Date(dto.birthDate) : null,
          address: dto.address,
        },
      });
    } catch (error) {
      if (
        error instanceof Prisma.PrismaClientKnownRequestError &&
        error.code === 'P2002'
      ) {
        throw new ConflictException(
          'CPF ou E-mail já cadastrado nesta clínica.',
        );
      }

      throw error;
    }
  }

  async findAll(
    clinicId: string,
    page: number = 1,
    limit: number = 10,
    search?: string,
    searchField: PatientSearchField = 'all',
  ) {
    const skip = (page - 1) * limit;

    const where: Prisma.PatientWhereInput = {
      clinicId,
      deletedAt: null,
    };

    if (search) {
      if (searchField === 'name') {
        where.name = {
          contains: search,
          mode: 'insensitive',
        };
      } else if (searchField === 'email') {
        where.email = {
          contains: search,
          mode: 'insensitive',
        };
      } else if (searchField === 'cpf') {
        where.cpf = {
          contains: search,
        };
      } else {
        where.OR = [
          {
            name: {
              contains: search,
              mode: 'insensitive',
            },
          },
          {
            cpf: {
              contains: search,
            },
          },
          {
            phone: {
              contains: search,
            },
          },
          {
            email: {
              contains: search,
              mode: 'insensitive',
            },
          },
        ];
      }
    }

    const [data, total] = await Promise.all([
      this.prisma.patient.findMany({
        where,
        take: limit,
        skip,
        orderBy: {
          name: 'asc',
        },
      }),
      this.prisma.patient.count({
        where,
      }),
    ]);

    const totalPages = Math.ceil(total / limit);

    return {
      data,
      meta: {
        total,
        page,
        limit,
        totalPages,
        hasNextPage: page < totalPages,
        hasPreviousPage: page > 1,
      },
    };
  }

  async findOne(id: string, clinicId: string) {
    const patient = await this.prisma.patient.findFirst({
      where: {
        id,
        clinicId,
        deletedAt: null,
      },
      include: {
        appointments: {
          orderBy: {
            scheduledAt: 'desc',
          },
          include: {
            procedure: true,
          },
        },
        procedures: {
          orderBy: {
            performedAt: 'desc',
          },
          include: {
            procedure: true,
          },
        },
        evaluations: {
          orderBy: {
            createdAt: 'desc',
          },
        },
        quotes: {
          orderBy: {
            createdAt: 'desc',
          },
        },
      },
    });

    if (!patient) {
      throw new NotFoundException(
        `Paciente com ID ${id} não foi encontrado.`,
      );
    }

    return patient;
  }

  async update(
    id: string,
    dto: UpdatePatientsDto,
    clinicId: string,
  ) {
    await this.findOne(id, clinicId);

    try {
      return await this.prisma.patient.update({
        where: {
          id,
        },
        data: {
          ...dto,
          birthDate: dto.birthDate
            ? new Date(dto.birthDate)
            : undefined,
        },
      });
    } catch (error) {
      if (
        error instanceof Prisma.PrismaClientKnownRequestError &&
        error.code === 'P2002'
      ) {
        throw new ConflictException(
          'CPF ou E-mail já cadastrado nesta clínica.',
        );
      }

      throw error;
    }
  }

  async remove(id: string, clinicId: string) {
    await this.findOne(id, clinicId);

    return this.prisma.patient.update({
      where: {
        id,
      },
      data: {
        deletedAt: new Date(),
      },
    });
  }

  async createProcedureRecord(
    patientId: string,
    dto: CreatePatientProcedureDto,
    clinicId: string,
  ) {
    const patient = await this.prisma.patient.findFirst({
      where: {
        id: patientId,
        clinicId,
        deletedAt: null,
      },
    });

    if (!patient) {
      throw new NotFoundException(
        `Paciente com ID ${patientId} não foi encontrado.`,
      );
    }

    const procedure = await this.prisma.procedure.findFirst({
      where: {
        id: dto.procedureId,
        clinicId,
        deletedAt: null,
      },
    });

    if (!procedure) {
      throw new NotFoundException(
        `Procedimento com ID ${dto.procedureId} não foi encontrado.`,
      );
    }

    return this.prisma.patientProcedure.create({
      data: {
        patientId,
        procedureId: dto.procedureId,
        performedAt: new Date(dto.performedAt),
        nextReturnAt: dto.nextReturnAt
          ? new Date(dto.nextReturnAt)
          : null,
      },
      include: {
        procedure: true,
      },
    });
  }

  async updateProcedureRecord(
    patientId: string,
    patientProcedureId: string,
    dto: UpdatePatientProcedureDto,
    clinicId: string,
  ) {
    const patient = await this.prisma.patient.findFirst({
      where: {
        id: patientId,
        clinicId,
        deletedAt: null,
      },
    });

    if (!patient) {
      throw new NotFoundException(
        `Paciente com ID ${patientId} não foi encontrado.`,
      );
    }

    const patientProcedure =
      await this.prisma.patientProcedure.findFirst({
        where: {
          id: patientProcedureId,
          patientId,
        },
        include: {
          procedure: true,
        },
      });

    if (!patientProcedure) {
      throw new NotFoundException(
        'Procedimento realizado não foi encontrado.',
      );
    }

    if (
      patientProcedure.procedure.clinicId !== clinicId ||
      patientProcedure.procedure.deletedAt !== null
    ) {
      throw new NotFoundException(
        'Procedimento não encontrado.',
      );
    }

    let procedureId = patientProcedure.procedureId;

    if (dto.procedureId !== undefined) {
      const procedure = await this.prisma.procedure.findFirst({
        where: {
          id: dto.procedureId,
          clinicId,
          deletedAt: null,
        },
      });

      if (!procedure) {
        throw new NotFoundException(
          `Procedimento com ID ${dto.procedureId} não foi encontrado.`,
        );
      }

      procedureId = dto.procedureId;
    }

    return this.prisma.patientProcedure.update({
      where: {
        id: patientProcedureId,
      },
      data: {
        procedureId,
        performedAt: dto.performedAt
          ? new Date(dto.performedAt)
          : undefined,
        nextReturnAt:
          dto.nextReturnAt !== undefined
            ? new Date(dto.nextReturnAt)
            : undefined,
      },
      include: {
        procedure: true,
      },
    });
  }

  async createQuote(
    patientId: string,
    dto: CreateQuoteDto,
    clinicId: string,
  ) {
    const patient = await this.prisma.patient.findFirst({
      where: {
        id: patientId,
        clinicId,
        deletedAt: null,
      },
    });

    if (!patient) {
      throw new NotFoundException(
        `Paciente com ID ${patientId} não foi encontrado.`,
      );
    }

    return this.prisma.quote.create({
      data: {
        patientId,
        totalValue: dto.totalValue,
        details: dto.details,
      },
    });
  }

  async updateQuote(
    patientId: string,
    quoteId: string,
    dto: UpdateQuoteDto,
    clinicId: string,
  ) {
    const patient = await this.prisma.patient.findFirst({
      where: {
        id: patientId,
        clinicId,
        deletedAt: null,
      },
    });

    if (!patient) {
      throw new NotFoundException(
        `Paciente com ID ${patientId} não foi encontrado.`,
      );
    }

    const quote = await this.prisma.quote.findFirst({
      where: {
        id: quoteId,
        patientId,
      },
    });

    if (!quote) {
      throw new NotFoundException(
        'Orçamento não foi encontrado.',
      );
    }

    return this.prisma.quote.update({
      where: {
        id: quoteId,
      },
      data: {
        totalValue: dto.totalValue,
        details: dto.details,
        status: dto.status,
      },
    });
  }
}