import { Injectable, NotFoundException, ConflictException } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { Prisma } from '@prisma/client';
import { CreatePatientsDto } from '../dto/create-patient.dto';
import { UpdatePatientsDto } from '../dto/update-patient.dto';
import { PrismaClientKnownRequestError } from '@prisma/client/runtime/library';

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
      if (error instanceof PrismaClientKnownRequestError && error.code === 'P2002') {
        throw new ConflictException('CPF ou E-mail já cadastrado nesta clínica.');
      }
      throw error;
    }
  }

  async findAll(clinicId: string, page: number = 1, limit: number = 10, search?: string) {
    const skip = (page - 1) * limit;

    const where: Prisma.PatientWhereInput = {
      clinicId,
      deletedAt: null,
    };

    if (search) {
      where.OR = [
        { name: { contains: search, mode: 'insensitive' } },
        { cpf: { contains: search } },
        { phone: { contains: search } },
      ];
    }

    const [data, total] = await Promise.all([
      this.prisma.patient.findMany({
        where,
        take: Number(limit),
        skip: Number(skip),
        orderBy: { name: 'asc' },
      }),
      this.prisma.patient.count({ where }),
    ]);

    const totalPages = Math.ceil(total / limit);

    return {
      data,
      meta: {
        total,
        page: Number(page),
        limit: Number(limit),
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
          orderBy: { scheduledAt: 'desc' },
          include: { procedure: true },
        },
        procedures: {
          orderBy: { performedAt: 'desc' },
          include: { procedure: true },
        },
        evaluations: {
          orderBy: { createdAt: 'desc' },
        },
        quotes: {
          orderBy: { createdAt: 'desc' },
        },
      },
    });

    if (!patient) {
      throw new NotFoundException(`Paciente com ID ${id} não foi encontrado.`);
    }

    return patient;
  }

  async update(id: string, dto: UpdatePatientsDto, clinicId: string) {
    await this.findOne(id, clinicId);

    try {
      return await this.prisma.patient.update({
        where: { id },
        data: {
          ...dto,
          birthDate: dto.birthDate ? new Date(dto.birthDate) : undefined,
        },
      });
    } catch (error) {
      if (error instanceof PrismaClientKnownRequestError && error.code === 'P2002') {
        throw new ConflictException('CPF ou E-mail já cadastrado nesta clínica.');
      }
      throw error;
    }
  }

  async remove(id: string, clinicId: string) {
    await this.findOne(id, clinicId);

    return this.prisma.patient.update({
      where: { id },
      data: {
        deletedAt: new Date(),
      },
    });
  }
}