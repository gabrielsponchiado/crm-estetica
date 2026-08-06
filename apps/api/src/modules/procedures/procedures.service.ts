import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { CreateProcedureDto } from '../dto/create-procedure.dto';
import { UpdateProcedureDto } from '../dto/update-procedure.dto';
import { Decimal } from '@prisma/client/runtime/library';

@Injectable()
export class ProceduresService {
  constructor(private readonly prisma: PrismaService) {}

  async create(dto: CreateProcedureDto) {
    return this.prisma.procedure.create({
      data: {
        name: dto.name,
        description: dto.description,
        price: new Decimal(dto.price),
        durationMinutes: dto.durationMinutes,
        recommendedMonths: dto.recommendedMonths,
      },
    });
  }

  async findAll() {
    return this.prisma.procedure.findMany({
      orderBy: { name: 'asc' },
    });
  }

  async findOne(id: string) {
    const procedure = await this.prisma.procedure.findUnique({
      where: { id },
    });

    if (!procedure) {
      throw new NotFoundException('Procedimento não encontrado');
    }

    return procedure;
  }

  async update(id: string, dto: UpdateProcedureDto) {
    await this.findOne(id);

    const data: Record<string, unknown> = { ...dto };
    // Converte price para Decimal se foi enviado
    if (dto.price !== undefined) {
      data.price = new Decimal(dto.price);
    }

    return this.prisma.procedure.update({
      where: { id },
      data,
    });
  }

  async remove(id: string) {
    await this.findOne(id);

    return this.prisma.procedure.delete({
      where: { id },
    });
  }
}