"use client";

import { format } from "date-fns";
import { ptBR } from "date-fns/locale";

import type { Appointment } from "hooks/useAppointments";

interface DayViewProps {
  date: Date;
  appointments: Appointment[];
}

export function DayView({ date, appointments }: DayViewProps) {
  const hours = Array.from({ length: 13 }, (_, index) => index + 8);

  return (
    <div className="overflow-hidden rounded-xl border bg-card">
      <div className="border-b px-5 py-4">
        <p className="text-sm font-medium text-muted-foreground">
          {format(date, "EEEE", {
            locale: ptBR,
          })}
        </p>

        <h2 className="text-xl font-bold capitalize">
          {format(date, "d 'de' MMMM", {
            locale: ptBR,
          })}
        </h2>
      </div>

      <div>
        {hours.map((hour) => {
          const hourString = `${String(hour).padStart(2, "0")}:00`;

          const hourAppointments = appointments.filter(
            (appointment) => Number(appointment.startTime.slice(0, 2)) === hour,
          );

          return (
            <div
              key={hour}
              className="grid min-h-[80px] grid-cols-[80px_1fr] border-b last:border-b-0"
            >
              <div className="border-r p-3 text-right text-xs text-muted-foreground">
                {hourString}
              </div>

              <div className="space-y-2 p-2">
                {hourAppointments.map((appointment) => (
                  <div
                    key={appointment.id}
                    className="rounded-lg border border-primary/20 bg-primary/5 p-3"
                  >
                    <div className="flex items-center justify-between">
                      <p className="text-sm font-semibold">
                        {appointment.patientName}
                      </p>

                      <span className="text-xs font-medium text-primary">
                        {appointment.startTime}
                      </span>
                    </div>

                    <p className="mt-1 text-xs text-muted-foreground">
                      {appointment.procedure}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
