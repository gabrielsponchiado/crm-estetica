"use client";

import { format } from "date-fns";
import { ptBR } from "date-fns/locale";
import { Plus } from "lucide-react";

import type { Appointment } from "@/types/appointment";
import { statusConfig } from "./appointment-status";

interface WeekViewProps {
  days: Date[];
  getAppointmentsForDay: (date: Date) => Appointment[];
  isToday: (date: Date) => boolean;
  onSelectAppointment: (appointment: Appointment) => void;
  onNewAppointment: (date: Date) => void;
}

export function WeekView({
  days,
  getAppointmentsForDay,
  isToday,
  onSelectAppointment,
  onNewAppointment,
}: WeekViewProps) {
  return (
    <div className="overflow-hidden rounded-xl border bg-card">
      <div className="grid grid-cols-7">
        {days.map((day) => {
          const appointments = getAppointmentsForDay(day);

          return (
            <div key={day.toISOString()} className="min-h-[600px] border-r last:border-r-0">
              <div className="border-b p-3 text-center">
                <p className="text-xs font-medium uppercase text-muted-foreground">
                  {format(day, "EEE", { locale: ptBR })}
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
                {appointments.map((appointment) => {
                  const config = statusConfig[appointment.status];

                  return (
                    <button
                      key={appointment.id}
                      type="button"
                      onClick={() => onSelectAppointment(appointment)}
                      className={`w-full rounded-lg border-l-2 ${config.border} ${config.bg} ${config.hover} p-2 text-left`}
                    >
                      <p className={`text-xs font-semibold ${config.text}`}>{appointment.startTime}</p>
                      <p className="mt-1 truncate text-sm font-medium">{appointment.patientName}</p>
                      <p className="mt-0.5 truncate text-xs text-muted-foreground">{appointment.procedure}</p>
                    </button>
                  );
                })}

                <button
                  type="button"
                  onClick={() => onNewAppointment(day)}
                  className="flex w-full items-center justify-center rounded-lg border border-dashed border-transparent py-2 text-muted-foreground/40 transition hover:border-border hover:text-muted-foreground"
                >
                  <Plus className="h-4 w-4" />
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}