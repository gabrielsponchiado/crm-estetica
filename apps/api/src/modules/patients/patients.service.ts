import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreatePatientsDto } from '../dto/create-patient.dto';
import { UpdatePatientsDto } from '../dto/update-patient.dto';

@Injectable()
export class PatientsService {
  constructor(private readonly prisma: PrismaService) {}

  async create(dto: CreatePatientsDto) {
    return this.prisma.patient.create({
      data: {
        name: dto.name,
        phone: dto.phone,
        cpf: dto.cpf,
        email: dto.email,
        birthDate: dto.birthDate ? new Date(dto.birthDate) : null,
        address: dto.address,
      },
    });
  }

  async findAll(page: number = 1, limit: number = 10, search?: string) {
    const skip = (page - 1) * limit;

    const where: any = {
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

  async findOne(id: string) {
    const patient = await this.prisma.patient.findFirst({
      where: {
        id,
        deletedAt: null,
      },
    });

    if (!patient) {
      throw new NotFoundException(`Paciente com ID ${id} não foi encontrado.`);
    }

    return patient;
  }

  async update(id: string, dto: UpdatePatientsDto) {
    await this.findOne(id);

    return this.prisma.patient.update({
      where: { id },
      data: {
        ...dto,
        birthDate: dto.birthDate ? new Date(dto.birthDate) : undefined,
      },
    });
  }

  async remove(id: string) {
    await this.findOne(id);

    return this.prisma.patient.update({
      where: { id },
      data: {
        deletedAt: new Date(),
      },
    });
  }
}
