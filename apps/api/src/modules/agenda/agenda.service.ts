import {
  Injectable,
  NotFoundException,
  BadRequestException,
  ConflictException,
} from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreateAgendaDto } from '../dto/create-agenda.dto';
import { UpdateAgendaDto } from '../dto/update-agenda.dto';
import { Prisma } from '@prisma/client';

@Injectable()
export class AgendaService {
  constructor(private readonly prisma: PrismaService) {}

  private async lockClinic(
    tx: Prisma.TransactionClient,
    clinicId: string,
  ) {
    await tx.$executeRaw`
      SELECT pg_advisory_xact_lock(hashtext(${clinicId}));
    `;
  }

  private async assertBelongsToClinic(
    prisma: Prisma.TransactionClient | PrismaService,
    patientId: string | undefined,
    procedureId: string | undefined,
    clinicId: string,
  ) {
    if (patientId) {
      const patient = await prisma.patient.findFirst({
        where: {
          id: patientId,
          clinicId,
          deletedAt: null,
        },
        select: { id: true },
      });

      if (!patient) {
        throw new BadRequestException(
          'Paciente informado não foi encontrado nesta clínica.',
        );
      }
    }

    if (procedureId) {
      const procedure = await prisma.procedure.findFirst({
        where: {
          id: procedureId,
          clinicId,
          deletedAt: null,
        },
        select: { id: true },
      });

      if (!procedure) {
        throw new BadRequestException(
          'Procedimento informado não foi encontrado nesta clínica.',
        );
      }
    }
  }

  private async assertNoScheduleConflict(
    prisma: Prisma.TransactionClient | PrismaService,
    scheduledAt: Date,
    durationMinutes: number,
    clinicId: string,
    excludeAppointmentId?: string,
  ) {
    const scheduledEnd = new Date(
      scheduledAt.getTime() + durationMinutes * 60 * 1000,
    );

    const appointments = await prisma.appointment.findMany({
      where: {
        clinicId,
        status: {
          not: 'CANCELED',
        },
        ...(excludeAppointmentId && {
          id: {
            not: excludeAppointmentId,
          },
        }),
      },
      select: {
        id: true,
        scheduledAt: true,
        durationMinutes: true,
      },
    });

    const hasConflict = appointments.some((appointment) => {
      const appointmentStart = appointment.scheduledAt;

      const appointmentEnd = new Date(
        appointmentStart.getTime() +
          appointment.durationMinutes * 60 * 1000,
      );

      return (
        scheduledAt < appointmentEnd &&
        scheduledEnd > appointmentStart
      );
    });

    if (hasConflict) {
      throw new ConflictException(
        'Já existe um agendamento neste horário.',
      );
    }
  }

  async create(dto: CreateAgendaDto, clinicId: string) {
    return await this.prisma.$transaction(async (tx) => {
      // Impede duas operações simultâneas na mesma clínica
      // de passarem pela verificação de conflito ao mesmo tempo.
      await this.lockClinic(tx, clinicId);

      await this.assertBelongsToClinic(
        tx,
        dto.patientId,
        dto.procedureId,
        clinicId,
      );

      const scheduledAt = new Date(dto.date);

      await this.assertNoScheduleConflict(
        tx,
        scheduledAt,
        dto.duration,
        clinicId,
      );

      return await tx.appointment.create({
        data: {
          clinicId,
          patientId: dto.patientId,
          procedureId: dto.procedureId,
          scheduledAt,
          durationMinutes: dto.duration,
          notes: dto.notes,
        },
        include: {
          patient: true,
          procedure: true,
        },
      });
    });
  }

  async findAll(
    clinicId: string,
    startDate?: string,
    endDate?: string,
  ) {
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
      where: {
        id,
        clinicId,
      },
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

  async update(
    id: string,
    dto: UpdateAgendaDto,
    clinicId: string,
  ) {
    return await this.prisma.$transaction(async (tx) => {
      // Mesma proteção do create:
      // duas atualizações simultâneas da mesma clínica
      // não podem passar pela verificação ao mesmo tempo.
      await this.lockClinic(tx, clinicId);

      const currentAppointment =
        await tx.appointment.findFirst({
          where: {
            id,
            clinicId,
          },
          include: {
            patient: true,
            procedure: true,
          },
        });

      if (!currentAppointment) {
        throw new NotFoundException(
          `Agendamento com ID ${id} não foi encontrado.`,
        );
      }

      await this.assertBelongsToClinic(
        tx,
        dto.patientId,
        dto.procedureId,
        clinicId,
      );

      const scheduledAt = dto.date
        ? new Date(dto.date)
        : currentAppointment.scheduledAt;

      const durationMinutes =
        dto.duration ?? currentAppointment.durationMinutes;

      await this.assertNoScheduleConflict(
        tx,
        scheduledAt,
        durationMinutes,
        clinicId,
        id,
      );

      return await tx.appointment.update({
        where: {
          id,
        },
        data: {
          ...(dto.patientId && {
            patientId: dto.patientId,
          }),
          ...(dto.procedureId && {
            procedureId: dto.procedureId,
          }),
          ...(dto.date && {
            scheduledAt,
          }),
          ...(dto.duration && {
            durationMinutes: dto.duration,
          }),
          ...(dto.notes !== undefined && {
            notes: dto.notes,
          }),
          ...(dto.status && {
            status: dto.status,
          }),
        },
        include: {
          patient: true,
          procedure: true,
        },
      });
    });
  }

  async remove(id: string, clinicId: string) {
    await this.findOne(id, clinicId);

    return await this.prisma.appointment.delete({
      where: {
        id,
      },
    });
  }

  /**
   * Faturamento mensal dos últimos `months` meses
   * (incluindo o mês atual).
   *
   * Só conta atendimentos com status COMPLETED.
   */
  async getMonthlyRevenue(clinicId: string, months = 6) {
    const now = new Date();

    const rangeStart = new Date(
      now.getFullYear(),
      now.getMonth() - (months - 1),
      1,
    );

    const appointments = await this.prisma.appointment.findMany({
      where: {
        clinicId,
        status: 'COMPLETED',
        scheduledAt: {
          gte: rangeStart,
        },
      },
      select: {
        scheduledAt: true,
        procedure: {
          select: {
            price: true,
          },
        },
      },
    });

    const buckets = new Map<
      string,
      {
        month: string;
        label: string;
        revenue: number;
      }
    >();

    for (let i = months - 1; i >= 0; i--) {
      const d = new Date(
        now.getFullYear(),
        now.getMonth() - i,
        1,
      );

      const key = `${d.getFullYear()}-${String(
        d.getMonth() + 1,
      ).padStart(2, '0')}`;

      const label = d
        .toLocaleDateString('pt-BR', {
          month: 'short',
        })
        .replace('.', '');

      const labelCapitalizado =
        label.charAt(0).toUpperCase() + label.slice(1);

      buckets.set(key, {
        month: key,
        label: labelCapitalizado,
        revenue: 0,
      });
    }

    for (const appt of appointments) {
      const d = appt.scheduledAt;

      const key = `${d.getFullYear()}-${String(
        d.getMonth() + 1,
      ).padStart(2, '0')}`;

      const bucket = buckets.get(key);

      if (bucket && appt.procedure) {
        bucket.revenue += Number(appt.procedure.price);
      }
    }

    return Array.from(buckets.values());
  }
}