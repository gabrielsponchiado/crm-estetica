"use client";

import { format } from "date-fns";
import { ptBR } from "date-fns/locale";

import type { Appointment } from "hooks/useAppointments";

interface MonthViewProps {
  days: Date[];
  currentMonth: Date;
  getAppointmentsForDay: (date: Date) => Appointment[];
  isToday: (date: Date) => boolean;
  isCurrentMonth: (date: Date) => boolean;
  onSelectDate: (date: Date) => void;
}

const weekDays = ["Seg", "Ter", "Qua", "Qui", "Sex", "Sáb", "Dom"];

export function MonthView({
  days,
  getAppointmentsForDay,
  isToday,
  isCurrentMonth,
  onSelectDate,
}: MonthViewProps) {
  return (
    <div className="overflow-hidden rounded-xl border bg-card">
      <div className="grid grid-cols-7 border-b bg-muted/30">
        {weekDays.map((day) => (
          <div
            key={day}
            className="border-r px-3 py-3 text-center text-xs font-semibold uppercase text-muted-foreground last:border-r-0"
          >
            {day}
          </div>
        ))}
      </div>

      <div className="grid grid-cols-7">
        {days.map((day) => {
          const appointments = getAppointmentsForDay(day);

          const currentMonth = isCurrentMonth(day);

          const today = isToday(day);

          return (
            <button
              key={day.toISOString()}
              type="button"
              onClick={() => onSelectDate(day)}
              className={`min-h-[130px] border-b border-r p-2 text-left transition-colors hover:bg-muted/40 ${
                !currentMonth ? "bg-muted/10" : "bg-background"
              }`}
            >
              <div className="mb-2 flex justify-end">
                <span
                  className={`flex h-7 w-7 items-center justify-center rounded-full text-sm font-medium ${
                    today
                      ? "bg-primary text-primary-foreground"
                      : currentMonth
                        ? "text-foreground"
                        : "text-muted-foreground"
                  }`}
                >
                  {format(day, "d")}
                </span>
              </div>

              <div className="space-y-1">
                {appointments.slice(0, 3).map((appointment) => (
                  <div
                    key={appointment.id}
                    className="truncate rounded-md bg-primary/10 px-2 py-1 text-xs font-medium text-primary"
                  >
                    <span className="mr-1 font-semibold">
                      {appointment.startTime}
                    </span>

                    {appointment.patientName}
                  </div>
                ))}

                {appointments.length > 3 && (
                  <p className="px-1 text-xs text-muted-foreground">
                    +{appointments.length - 3} outros
                  </p>
                )}
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
}
