"use client";

import { format } from "date-fns";
import { ptBR } from "date-fns/locale";
import { Plus } from "lucide-react";

import type { Appointment } from "@/types/appointment";
import { statusConfig } from "./appointment-status";

interface DayViewProps {
  date: Date;
  appointments: Appointment[];
  onSelectAppointment: (appointment: Appointment) => void;
  onNewAppointment: (date: Date) => void;
}

export function DayView({ date, appointments, onSelectAppointment, onNewAppointment }: DayViewProps) {
  const hours = Array.from({ length: 13 }, (_, index) => index + 8); // 08h–20h

  return (
    <div className="flex flex-1 flex-col overflow-hidden bg-background">
      <div className="border-b px-5 py-4">
        <p className="text-sm font-medium text-muted-foreground">
          {format(date, "EEEE", { locale: ptBR })}
        </p>
        <h2 className="text-xl font-bold capitalize">
          {format(date, "d 'de' MMMM", { locale: ptBR })}
        </h2>
      </div>

      <div className="flex-1 overflow-y-auto [&::-webkit-scrollbar]:w-1 [&::-webkit-scrollbar-track]:bg-transparent [&::-webkit-scrollbar-thumb]:bg-border [&::-webkit-scrollbar-thumb]:rounded-full hover:[&::-webkit-scrollbar-thumb]:bg-muted-foreground/30">
        {hours.map((hour) => {
          const hourString = `${String(hour).padStart(2, "0")}:00`;
          const hourAppointments = appointments.filter(
            (appointment) => Number(appointment.startTime.slice(0, 2)) === hour,
          );

          return (
            <div key={hour} className="grid min-h-[80px] grid-cols-[80px_1fr] border-b last:border-b-0">
              <div className="border-r p-3 text-right text-xs text-muted-foreground">{hourString}</div>

              <div className="space-y-2 p-2">
                {hourAppointments.map((appointment) => {
                  const config = statusConfig[appointment.status];

                  return (
                    <button
                      key={appointment.id}
                      type="button"
                      onClick={() => onSelectAppointment(appointment)}
                      className={`w-full rounded-lg border-l-2 ${config.border} ${config.bg} ${config.hover} p-3 text-left`}
                    >
                      <div className="flex items-center justify-between">
                        <p className="text-sm font-semibold">{appointment.patientName}</p>
                        <span className={`text-xs font-medium ${config.text}`}>{appointment.startTime}</span>
                      </div>
                      <p className="mt-1 text-xs text-muted-foreground">{appointment.procedure}</p>
                    </button>
                  );
                })}

                {hourAppointments.length === 0 && (
                  <button
                    type="button"
                    onClick={() => onNewAppointment(date)}
                    className="flex h-full min-h-[48px] w-full items-center rounded-lg border border-dashed border-transparent px-3 text-xs text-transparent transition hover:border-border hover:text-muted-foreground"
                  >
                    <Plus className="mr-2 h-3.5 w-3.5" />
                    Agendar às {hourString}
                  </button>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}