"use client";

import { format } from "date-fns";
import { Plus } from "lucide-react";

import type { Appointment } from "@/types/appointment";
import { statusConfig } from "./appointment-status";

interface MonthViewProps {
  days: Date[];
  getAppointmentsForDay: (date: Date) => Appointment[];
  isToday: (date: Date) => boolean;
  isCurrentMonth: (date: Date) => boolean;
  onSelectDate: (date: Date) => void;
  onSelectAppointment: (appointment: Appointment) => void;
  onNewAppointment: (date: Date) => void;
}

const weekDays = ["Seg", "Ter", "Qua", "Qui", "Sex", "Sáb", "Dom"];

export function MonthView({
  days,
  getAppointmentsForDay,
  isToday,
  isCurrentMonth,
  onSelectDate,
  onSelectAppointment,
  onNewAppointment,
}: MonthViewProps) {
  return (
    <div>
      <div className="grid grid-cols-7 border-b bg-muted/30">
        {weekDays.map((day, index) => {
          const isWeekend = index >= 5; // Sáb, Dom
          return (
            <div
              key={day}
              className={`border-r px-3 py-2.5 text-center text-[11px] font-bold uppercase tracking-widest last:border-r-0 ${
                isWeekend ? "text-primary/60" : "text-muted-foreground"
              }`}
            >
              {day}
            </div>
          );
        })}
      </div>

      <div className="grid grid-cols-7">
        {days.map((day) => {
          const appointments = getAppointmentsForDay(day);
          const currentMonth = isCurrentMonth(day);
          const today = isToday(day);

          return (
            <div
              key={day.toISOString()}
              className={`group min-h-[140px] border-b border-r p-2 text-left transition-colors last:border-r-0 ${
                !currentMonth ? "bg-muted/10" : "bg-background hover:bg-muted/40"
              }`}
            >
              <div className="mb-2 flex items-center justify-between">
                <button
                  type="button"
                  onClick={() => onSelectDate(day)}
                  className={`flex h-7 w-7 items-center justify-center rounded-full text-sm font-medium transition ${
                    today
                      ? "bg-primary text-primary-foreground"
                      : currentMonth
                        ? "text-foreground hover:bg-muted"
                        : "text-muted-foreground"
                  }`}
                >
                  {format(day, "d")}
                </button>

                {currentMonth && (
                  <button
                    type="button"
                    onClick={() => onNewAppointment(day)}
                    className="flex h-6 w-6 items-center justify-center rounded-md text-muted-foreground/0 transition group-hover:text-muted-foreground hover:bg-muted hover:text-foreground"
                    title="Novo agendamento"
                  >
                    <Plus className="h-3.5 w-3.5" />
                  </button>
                )}
              </div>

              <div className="space-y-1">
                {appointments.slice(0, 3).map((appointment) => {
                  const config = statusConfig[appointment.status];

                  return (
                    <button
                      key={appointment.id}
                      type="button"
                      onClick={() => onSelectAppointment(appointment)}
                      className={`flex w-full items-center gap-1 truncate rounded-md border-l-2 ${config.border} ${config.bg} ${config.hover} px-2 py-1 text-left text-xs font-medium`}
                    >
                      <span className="shrink-0 font-semibold">{appointment.startTime}</span>
                      <span className="truncate">{appointment.patientName}</span>
                    </button>
                  );
                })}

                {appointments.length > 3 && (
                  <button
                    type="button"
                    onClick={() => onSelectDate(day)}
                    className="px-1 text-left text-xs text-muted-foreground hover:text-foreground"
                  >
                    +{appointments.length - 3} outros
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