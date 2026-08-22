import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { CreateProcedureDto } from '../dto/create-procedure.dto';
import { UpdateProcedureDto } from '../dto/update-procedure.dto';
import { Decimal } from '@prisma/client/runtime/library';

@Injectable()
export class ProceduresService {
  constructor(private readonly prisma: PrismaService) {}

  async create(dto: CreateProcedureDto, clinicId: string) {
    return this.prisma.procedure.create({
      data: {
        clinicId,
        name: dto.name,
        description: dto.description,
        price: new Decimal(dto.price),
        durationMinutes: dto.durationMinutes,
        recommendedMonths: dto.recommendedMonths,
      },
    });
  }

  async findAll(clinicId: string) {
    return this.prisma.procedure.findMany({
      where: { clinicId },
      orderBy: { name: 'asc' },
    });
  }

  async findOne(id: string, clinicId: string) {
    const procedure = await this.prisma.procedure.findFirst({
      where: { id, clinicId },
    });

    if (!procedure) {
      throw new NotFoundException('Procedimento não encontrado');
    }

    return procedure;
  }

  async update(id: string, dto: UpdateProcedureDto, clinicId: string) {
    await this.findOne(id, clinicId);

    const data: Record<string, unknown> = { ...dto };
    if (dto.price !== undefined) {
      data.price = new Decimal(dto.price);
    }

    return this.prisma.procedure.update({
      where: { id },
      data,
    });
  }

  async remove(id: string, clinicId: string) {
    await this.findOne(id, clinicId);

    return this.prisma.procedure.delete({
      where: { id },
    });
  }
}