import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class DashboardService {
  constructor(private readonly prisma: PrismaService) {}

  async getSummary(clinicId: string) {
    const [appointmentsToday, patientsStats, birthdays, inactivePatients] =
      await Promise.all([
        this.getAppointmentsToday(clinicId),
        this.getPatientsStats(clinicId),
        this.getBirthdaysThisMonth(clinicId),
        this.getInactivePatients(clinicId),
      ]);

    return { appointmentsToday, patientsStats, birthdays, inactivePatients };
  }

  async getAppointmentsToday(clinicId: string) {
    const startOfDay = new Date();
    startOfDay.setHours(0, 0, 0, 0);

    const endOfDay = new Date();
    endOfDay.setHours(23, 59, 59, 999);

    const grouped = await this.prisma.appointment.groupBy({
      by: ['status'],
      where: { clinicId, scheduledAt: { gte: startOfDay, lte: endOfDay } },
      _count: true,
    });

    const result = { total: 0, confirmados: 0, agendados: 0 };

    for (const item of grouped) {
      result.total += item._count;
      if (item.status === 'CONFIRMED') {
        result.confirmados += item._count;
      } else if (item.status === 'SCHEDULED') {
        result.agendados += item._count;
      }
    }
    return result;
  }

 async getPatientsStats(clinicId: string) {
    const now = new Date();
    const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);

    const [total, newThisMonth] = await Promise.all([
      this.prisma.patient.count({ where: { clinicId, deletedAt: null } }),
      this.prisma.patient.count({
        where: { clinicId, deletedAt: null, createdAt: { gte: startOfMonth } },
      }),
    ]);

    return { total, newThisMonth };
  }

  async getBirthdaysThisMonth(clinicId: string) {
    const patientsWithBirthDate = await this.prisma.patient.findMany({
      where: { clinicId, deletedAt: null, birthDate: { not: null }},
      select: { id: true, name: true, birthDate: true },
    })

    const currentMonth = new Date().getMonth();
    const filtered = patientsWithBirthDate.filter((patient) => {
      return patient.birthDate && patient.birthDate.getMonth() === currentMonth;
    })
    return filtered;
  }

  async getInactivePatients(clinicId: string) {
    const inactivePatients = await this.prisma.patient.findMany({
      where: { clinicId, deletedAt: null },
      select: { id: true, name: true, appointments: {
        where: { status: "COMPLETED" },
        orderBy: { scheduledAt: "desc" },
        take: 1,
        select: { scheduledAt: true },
      }},
    });
    const ninetyDaysAgo = new Date();
    ninetyDaysAgo.setDate(ninetyDaysAgo.getDate() - 90);

    const filtered = inactivePatients.filter((patient) => {
      const lastAppointment = patient.appointments[0];
      return !lastAppointment || lastAppointment.scheduledAt < ninetyDaysAgo;
    })
    
    return filtered;
  }
}
