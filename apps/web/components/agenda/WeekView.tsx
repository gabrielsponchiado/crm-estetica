"use client";

import { format } from "date-fns";
import { ptBR } from "date-fns/locale";

import type { Appointment } from "hooks/useAppointments";

interface WeekViewProps {
  days: Date[];
  getAppointmentsForDay: (date: Date) => Appointment[];
  isToday: (date: Date) => boolean;
}

export function WeekView({
  days,
  getAppointmentsForDay,
  isToday,
}: WeekViewProps) {
  return (
    <div className="overflow-hidden rounded-xl border bg-card">
      <div className="grid grid-cols-7">
        {days.map((day) => {
          const appointments = getAppointmentsForDay(day);

          return (
            <div
              key={day.toISOString()}
              className="min-h-[600px] border-r last:border-r-0"
            >
              <div className="border-b p-3 text-center">
                <p className="text-xs font-medium uppercase text-muted-foreground">
                  {format(day, "EEE", {
                    locale: ptBR,
                  })}
                </p>

                <div
                  className={`mx-auto mt-1 flex h-9 w-9 items-center justify-center rounded-full text-sm font-semibold ${
                    isToday(day) ? "bg-primary text-primary-foreground" : ""
                  }`}
                >
                  {format(day, "d")}
                </div>
              </div>

              <div className="space-y-2 p-2">
                {appointments.map((appointment) => (
                  <div
                    key={appointment.id}
                    className="rounded-lg border bg-primary/5 p-2"
                  >
                    <p className="text-xs font-semibold text-primary">
                      {appointment.startTime}
                    </p>

                    <p className="mt-1 truncate text-sm font-medium">
                      {appointment.patientName}
                    </p>

                    <p className="mt-0.5 truncate text-xs text-muted-foreground">
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
