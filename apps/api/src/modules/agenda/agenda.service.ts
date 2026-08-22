import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreateAgendaDto } from '../dto/create-agenda.dto';
import { UpdateAgendaDto } from '../dto/update-agenda.dto';

@Injectable()
export class AgendaService {
  constructor(private readonly prisma: PrismaService) {}

  async create(dto: CreateAgendaDto, clinicId: string) {
    return await this.prisma.appointment.create({
      data: {
        clinicId,
        patientId: dto.patientId,
        procedureId: dto.procedureId,
        scheduledAt: new Date(dto.date),
        durationMinutes: dto.duration,
        notes: dto.notes,
      },
      include: {
        patient: true,
        procedure: true,
      },
    });
  }

  async findAll(clinicId: string, startDate?: string, endDate?: string) {
    return await this.prisma.appointment.findMany({
      where: {
        clinicId,
        ...(startDate &&
          endDate && {
            scheduledAt: {
              gte: new Date(startDate),
              lte: new Date(endDate),
            },
          }),
      },
      include: {
        patient: true,
        procedure: true,
      },
      orderBy: {
        scheduledAt: 'asc',
      },
    });
  }

  async findOne(id: string, clinicId: string) {
    const appointment = await this.prisma.appointment.findFirst({
      where: { id, clinicId },
      include: {
        patient: true,
        procedure: true,
      },
    });

    if (!appointment) {
      throw new NotFoundException(
        `Agendamento com ID ${id} não foi encontrado.`,
      );
    }

    return appointment;
  }

  async update(id: string, dto: UpdateAgendaDto, clinicId: string) {
    await this.findOne(id, clinicId);

    return await this.prisma.appointment.update({
      where: { id },
      data: {
        ...(dto.patientId && { patientId: dto.patientId }),
        ...(dto.procedureId && { procedureId: dto.procedureId }),
        ...(dto.date && { scheduledAt: new Date(dto.date) }),
        ...(dto.duration && { durationMinutes: dto.duration }),
        ...(dto.notes !== undefined && { notes: dto.notes }),
        ...(dto.status && { status: dto.status }),
      },
      include: {
        patient: true,
        procedure: true,
      },
    });
  }

  async remove(id: string, clinicId: string) {
    await this.findOne(id, clinicId);

    return await this.prisma.appointment.delete({
      where: { id },
    });
  }
}

