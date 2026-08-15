"use client";

import { useMemo, useState } from "react";
import {
  format,
  addMonths,
  subMonths,
  startOfMonth,
  endOfMonth,
  startOfWeek,
  endOfWeek,
  eachDayOfInterval,
  isSameMonth,
  isSameDay,
  addDays,
  subDays,
  isBefore,
  startOfDay,
  isToday,
} from "date-fns";
import { ptBR } from "date-fns/locale";

import {
  Calendar as CalendarIcon,
  ChevronLeft,
  ChevronRight,
  Clock3,
  MoreHorizontal,
  Plus,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";

import { NewAppointmentModal } from "./NewAppointmentModal";
import { AppointmentDetailsModal } from "./AppointmentDetailsModal";

interface Appointment {
  id: string;
  patientName: string;
  procedure: string;
  startTime: string;
  durationMinutes: number;
  status: "SCHEDULED" | "CONFIRMED" | "IN_PROGRESS" | "COMPLETED" | "CANCELLED";
  phone: string;
  date: string;
}

const initialAppointments: Appointment[] = [
  {
    id: "1",
    patientName: "Maria Silva",
    procedure: "Toxina Botulínica (Botox)",
    startTime: "09:00",
    durationMinutes: 60,
    status: "CONFIRMED",
    phone: "11999999999",
    date: "2026-07-28",
  },
  {
    id: "2",
    patientName: "Carla Dias",
    procedure: "Limpeza de Pele Profunda",
    startTime: "14:00",
    durationMinutes: 60,
    status: "SCHEDULED",
    phone: "11977777777",
    date: "2026-07-28",
  },
];

const statusConfig = {
  SCHEDULED: {
    label: "Agendado",
    dot: "bg-amber-500",
    border: "border-l-amber-500",
    bg: "bg-amber-500/[0.055]",
    hover: "hover:bg-amber-500/[0.10]",
    text: "text-amber-700 dark:text-amber-400",
  },

  CONFIRMED: {
    label: "Confirmado",
    dot: "bg-emerald-500",
    border: "border-l-emerald-500",
    bg: "bg-emerald-500/[0.055]",
    hover: "hover:bg-emerald-500/[0.10]",
    text: "text-emerald-700 dark:text-emerald-400",
  },

  IN_PROGRESS: {
    label: "Em atendimento",
    dot: "bg-rose-500",
    border: "border-l-rose-500",
    bg: "bg-rose-500/[0.055]",
    hover: "hover:bg-rose-500/[0.10]",
    text: "text-rose-700 dark:text-rose-400",
  },

  COMPLETED: {
    label: "Concluído",
    dot: "bg-slate-400",
    border: "border-l-slate-400",
    bg: "bg-slate-500/[0.045]",
    hover: "hover:bg-slate-500/[0.08]",
    text: "text-slate-600 dark:text-slate-400",
  },

  CANCELLED: {
    label: "Cancelado",
    dot: "bg-destructive",
    border: "border-l-destructive",
    bg: "bg-destructive/[0.045]",
    hover: "hover:bg-destructive/[0.08]",
    text: "text-destructive",
  },
};

const timeSlots = [
  "08:00",
  "09:00",
  "10:00",
  "11:00",
  "13:00",
  "14:00",
  "15:00",
  "16:00",
  "17:00",
];

const weekDaysLabels = ["Dom", "Seg", "Ter", "Qua", "Qui", "Sex", "Sáb"];

function formatDuration(minutes: number) {
  if (minutes < 60) {
    return `${minutes} min`;
  }

  const hours = Math.floor(minutes / 60);
  const remainingMinutes = minutes % 60;

  if (remainingMinutes === 0) {
    return `${hours}h`;
  }

  return `${hours}h ${remainingMinutes}min`;
}

export function AgendaPage() {
  const [viewMode, setViewMode] = useState<"day" | "week" | "month">("month");
  const [currentDate, setCurrentDate] = useState(new Date(2026, 6, 28));
  const [appointments] = useState<Appointment[]>(initialAppointments);
  const [isNewAppointmentOpen, setIsNewAppointmentOpen] = useState(false);
  const [selectedAppointment, setSelectedAppointment] =
    useState<Appointment | null>(null);

  const today = startOfDay(new Date());

  const monthStart = startOfMonth(currentDate);
  const monthEnd = endOfMonth(currentDate);

  const monthDays = eachDayOfInterval({
    start: startOfWeek(monthStart, {
      weekStartsOn: 0,
    }),
    end: endOfWeek(monthEnd, {
      weekStartsOn: 0,
    }),
  });

  const weekStart = startOfWeek(currentDate, {
    weekStartsOn: 0,
  });

  const weekEnd = endOfWeek(currentDate, {
    weekStartsOn: 0,
  });

  const weekDays = eachDayOfInterval({
    start: weekStart,
    end: weekEnd,
  });

  const formattedSelectedDate = format(currentDate, "yyyy-MM-dd");

  const currentMonthAppointments = useMemo(() => {
    return appointments.filter((appointment) => {
      const appointmentDate = new Date(`${appointment.date}T12:00:00`);

      return appointmentDate >= monthStart && appointmentDate <= monthEnd;
    });
  }, [appointments, monthStart, monthEnd]);

  const stats = useMemo(() => {
    return {
      total: currentMonthAppointments.length,

      confirmed: currentMonthAppointments.filter(
        (appointment) => appointment.status === "CONFIRMED",
      ).length,

      scheduled: currentMonthAppointments.filter(
        (appointment) => appointment.status === "SCHEDULED",
      ).length,

      inProgress: currentMonthAppointments.filter(
        (appointment) => appointment.status === "IN_PROGRESS",
      ).length,
    };
  }, [currentMonthAppointments]);

  const handlePrevious = () => {
    if (viewMode === "month") {
      setCurrentDate(subMonths(currentDate, 1));
      return;
    }

    if (viewMode === "week") {
      setCurrentDate(subDays(currentDate, 7));
      return;
    }

    setCurrentDate(subDays(currentDate, 1));
  };

  const handleNext = () => {
    if (viewMode === "month") {
      setCurrentDate(addMonths(currentDate, 1));
      return;
    }

    if (viewMode === "week") {
      setCurrentDate(addDays(currentDate, 7));
      return;
    }

    setCurrentDate(addDays(currentDate, 1));
  };

  const handleToday = () => {
    setCurrentDate(new Date());
  };

  const getHeaderTitle = () => {
    if (viewMode === "day") {
      return format(currentDate, "EEEE, d 'de' MMMM 'de' yyyy", {
        locale: ptBR,
      });
    }

    if (viewMode === "week") {
      return `${format(weekStart, "d MMM", {
        locale: ptBR,
      })} – ${format(weekEnd, "d MMM yyyy", {
        locale: ptBR,
      })}`;
    }

    return format(currentDate, "MMMM 'de' yyyy", {
      locale: ptBR,
    });
  };

  const getAppointmentsForDay = (day: Date) => {
    const dayString = format(day, "yyyy-MM-dd");

    return appointments
      .filter((appointment) => appointment.date === dayString)
      .sort((a, b) => a.startTime.localeCompare(b.startTime));
  };

  const openNewAppointment = (date?: Date) => {
    if (date) {
      setCurrentDate(date);
    }

    setIsNewAppointmentOpen(true);
  };

  const openAppointment = (appointment: Appointment) => {
    setSelectedAppointment(appointment);
  };

  return (
    <div className="flex h-[calc(100vh-6rem)] min-h-[680px] flex-col gap-5">
      <header className="flex shrink-0 items-end justify-between gap-6">
        <div className="space-y-1">
          <div className="flex items-center gap-3">
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-primary/10">
              <CalendarIcon className="h-[18px] w-[18px] text-primary" />
            </div>

            <div>
              <h1 className="text-2xl font-semibold tracking-tight">Agenda</h1>

              <p className="text-sm text-muted-foreground">
                Gerencie os horários e atendimentos da clínica.
              </p>
            </div>
          </div>
        </div>

        <Button
          onClick={() => openNewAppointment()}
          className="h-10 gap-2 rounded-lg px-4 shadow-sm"
        >
          <Plus className="h-4 w-4" />
          Novo agendamento
        </Button>
      </header>

      <div className="grid shrink-0 grid-cols-4 gap-3">
        <Card className="border-border/60 bg-background p-4 shadow-none">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs font-medium text-muted-foreground">
                Atendimentos
              </p>

              <p className="mt-1 text-2xl font-semibold tracking-tight">
                {stats.total}
              </p>
            </div>

            <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-primary/10">
              <CalendarIcon className="h-4 w-4 text-primary" />
            </div>
          </div>
        </Card>

        <Card className="border-border/60 bg-background p-4 shadow-none">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs font-medium text-muted-foreground">
                Confirmados
              </p>

              <p className="mt-1 text-2xl font-semibold tracking-tight">
                {stats.confirmed}
              </p>
            </div>

            <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-emerald-500/10">
              <span className="h-2.5 w-2.5 rounded-full bg-emerald-500" />
            </div>
          </div>
        </Card>

        <Card className="border-border/60 bg-background p-4 shadow-none">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs font-medium text-muted-foreground">
                Pendentes
              </p>

              <p className="mt-1 text-2xl font-semibold tracking-tight">
                {stats.scheduled}
              </p>
            </div>

            <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-amber-500/10">
              <Clock3 className="h-4 w-4 text-amber-600" />
            </div>
          </div>
        </Card>

        <Card className="border-border/60 bg-background p-4 shadow-none">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs font-medium text-muted-foreground">
                Em atendimento
              </p>

              <p className="mt-1 text-2xl font-semibold tracking-tight">
                {stats.inProgress}
              </p>
            </div>

            <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-rose-500/10">
              <span className="h-2.5 w-2.5 animate-pulse rounded-full bg-rose-500" />
            </div>
          </div>
        </Card>
      </div>

      <div className="flex shrink-0 items-center justify-between rounded-xl border border-border/60 bg-background p-2 shadow-sm">
        <div className="flex items-center gap-3">
          <div className="flex items-center rounded-lg border border-border/60 bg-muted/40 p-1">
            <Button
              variant="ghost"
              size="icon"
              onClick={handlePrevious}
              className="h-7 w-7 rounded-md"
              title="Anterior"
            >
              <ChevronLeft className="h-4 w-4" />
            </Button>

            <Button
              variant="ghost"
              size="sm"
              onClick={handleToday}
              className="h-7 px-3 text-xs font-medium"
            >
              Hoje
            </Button>

            <Button
              variant="ghost"
              size="icon"
              onClick={handleNext}
              className="h-7 w-7 rounded-md"
              title="Próximo"
            >
              <ChevronRight className="h-4 w-4" />
            </Button>
          </div>

          <div className="h-5 w-px bg-border" />

          <h2 className="text-sm font-semibold capitalize">
            {getHeaderTitle()}
          </h2>
        </div>

        <div className="flex items-center rounded-lg border border-border/60 bg-muted/40 p-1">
          {(["day", "week", "month"] as const).map((mode) => {
            const active = viewMode === mode;

            return (
              <Button
                key={mode}
                variant={active ? "default" : "ghost"}
                size="sm"
                onClick={() => setViewMode(mode)}
                className={`h-7 rounded-md px-3 text-xs ${
                  active ? "shadow-sm" : "text-muted-foreground"
                }`}
              >
                {mode === "day" ? "Dia" : mode === "week" ? "Semana" : "Mês"}
              </Button>
            );
          })}
        </div>
      </div>

      <Card className="min-h-0 flex-1 overflow-hidden border-border/60 p-0 shadow-sm">
        {viewMode === "day" && (
          <div className="flex h-full flex-col">
            <div className="flex shrink-0 items-center justify-between border-b border-border/60 px-5 py-4">
              <div>
                <p className="text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">
                  Agenda do dia
                </p>

                <h3 className="mt-1 text-base font-semibold capitalize">
                  {format(currentDate, "EEEE, d 'de' MMMM", {
                    locale: ptBR,
                  })}
                </h3>
              </div>

              <Badge
                variant="secondary"
                className="rounded-md px-2.5 py-1 text-xs"
              >
                {getAppointmentsForDay(currentDate).length}{" "}
                {getAppointmentsForDay(currentDate).length === 1
                  ? "atendimento"
                  : "atendimentos"}
              </Badge>
            </div>

            <div className="min-h-0 flex-1 overflow-y-auto">
              {timeSlots.map((time) => {
                const appointment = appointments.find(
                  (app) =>
                    app.date === formattedSelectedDate &&
                    app.startTime === time,
                );

                const isPastDate = isBefore(startOfDay(currentDate), today);

                const config = appointment
                  ? statusConfig[appointment.status]
                  : null;

                return (
                  <div
                    key={time}
                    className="grid min-h-[82px] grid-cols-[72px_1fr] border-b border-border/40 last:border-b-0"
                  >
                    <div className="flex justify-center border-r border-border/40 pt-4">
                      <span className="text-xs font-medium text-muted-foreground">
                        {time}
                      </span>
                    </div>

                    <div className="relative p-2.5">
                      {appointment && config ? (
                        <button
                          onClick={() => openAppointment(appointment)}
                          className={`flex w-full items-center justify-between rounded-lg border border-border/60 border-l-[3px] ${config.border} ${config.bg} ${config.hover} px-4 py-3 text-left transition`}
                        >
                          <div className="min-w-0">
                            <div className="flex items-center gap-2">
                              <span
                                className={`h-2 w-2 shrink-0 rounded-full ${config.dot}`}
                              />

                              <p className="truncate text-sm font-semibold">
                                {appointment.patientName}
                              </p>
                            </div>

                            <p className="mt-1 truncate pl-4 text-xs text-muted-foreground">
                              {appointment.procedure}
                            </p>
                          </div>

                          <div className="ml-4 hidden shrink-0 items-center gap-4 sm:flex">
                            <div className="text-right">
                              <p className="text-xs font-semibold">
                                {appointment.startTime}
                              </p>

                              <p className="text-[11px] text-muted-foreground">
                                {formatDuration(appointment.durationMinutes)}
                              </p>
                            </div>

                            <Badge
                              variant="outline"
                              className={`rounded-md bg-background/70 text-[10px] ${config.text}`}
                            >
                              {config.label}
                            </Badge>
                          </div>
                        </button>
                      ) : (
                        !isPastDate && (
                          <button
                            onClick={() => openNewAppointment(currentDate)}
                            className="flex h-full min-h-[56px] w-full items-center rounded-lg border border-dashed border-transparent px-4 text-left text-xs text-muted-foreground/0 transition hover:border-border hover:bg-muted/30 hover:text-muted-foreground"
                          >
                            <Plus className="mr-2 h-3.5 w-3.5" />
                            Agendar atendimento às {time}
                          </button>
                        )
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {viewMode === "week" && (
          <div className="flex h-full flex-col overflow-hidden">
            <div className="grid shrink-0 grid-cols-7 border-b border-border/60">
              {weekDays.map((day) => {
                const dayIsToday = isToday(day);

                return (
                  <button
                    key={day.toISOString()}
                    onClick={() => {
                      setCurrentDate(day);
                      setViewMode("day");
                    }}
                    className={`border-r border-border/40 px-2 py-3 text-center transition last:border-r-0 hover:bg-muted/40 ${
                      dayIsToday ? "bg-primary/[0.04]" : ""
                    }`}
                  >
                    <p
                      className={`text-[10px] font-semibold uppercase tracking-wider ${
                        dayIsToday ? "text-primary" : "text-muted-foreground"
                      }`}
                    >
                      {weekDaysLabels[day.getDay()]}
                    </p>

                    <div
                      className={`mx-auto mt-1 flex h-8 w-8 items-center justify-center rounded-full text-sm font-semibold ${
                        dayIsToday
                          ? "bg-primary text-primary-foreground"
                          : "text-foreground"
                      }`}
                    >
                      {format(day, "d")}
                    </div>
                  </button>
                );
              })}
            </div>

            {/* Content */}
            <div className="min-h-0 flex-1 overflow-y-auto">
              <div className="grid min-h-full grid-cols-7">
                {weekDays.map((day) => {
                  const dayAppointments = getAppointmentsForDay(day);

                  const isPast = isBefore(startOfDay(day), today);

                  return (
                    <div
                      key={format(day, "yyyy-MM-dd")}
                      className={`min-h-[420px] border-r border-border/40 p-2 last:border-r-0 ${
                        isPast ? "bg-muted/[0.18]" : ""
                      }`}
                    >
                      <div className="flex h-full flex-col gap-2">
                        {dayAppointments.map((appointment) => {
                          const config = statusConfig[appointment.status];

                          return (
                            <button
                              key={appointment.id}
                              onClick={() => openAppointment(appointment)}
                              className={`group rounded-lg border border-border/60 border-l-[3px] ${config.border} ${config.bg} ${config.hover} p-2.5 text-left transition`}
                            >
                              <div className="flex items-center justify-between gap-2">
                                <span className="text-[11px] font-semibold">
                                  {appointment.startTime}
                                </span>

                                <MoreHorizontal className="h-3.5 w-3.5 text-muted-foreground opacity-0 transition group-hover:opacity-100" />
                              </div>

                              <div className="mt-2 flex min-w-0 items-center gap-2">
                                <span
                                  className={`h-1.5 w-1.5 shrink-0 rounded-full ${config.dot}`}
                                />

                                <span className="truncate text-xs font-semibold">
                                  {appointment.patientName}
                                </span>
                              </div>

                              <p className="mt-1.5 truncate text-[10px] text-muted-foreground">
                                {appointment.procedure}
                              </p>

                              <div className="mt-2 flex items-center gap-1.5">
                                <span className={`text-[9px] ${config.text}`}>
                                  {config.label}
                                </span>
                              </div>
                            </button>
                          );
                        })}

                        {!isPast && (
                          <button
                            onClick={() => openNewAppointment(day)}
                            className="flex min-h-10 items-center justify-center rounded-lg border border-dashed border-transparent text-muted-foreground/30 transition hover:border-border hover:bg-background hover:text-muted-foreground"
                          >
                            <Plus className="h-4 w-4" />
                          </button>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        )}

        {viewMode === "month" && (
          <div className="flex h-full flex-col overflow-hidden">
            <div className="grid shrink-0 grid-cols-7 border-b border-border/60 bg-muted/[0.12]">
              {weekDaysLabels.map((day) => (
                <div
                  key={day}
                  className="border-r border-border/40 px-3 py-3 text-[10px] font-semibold uppercase tracking-wider text-muted-foreground last:border-r-0"
                >
                  {day}
                </div>
              ))}
            </div>

            <div
              className={`grid min-h-0 flex-1 grid-cols-7 overflow-hidden ${
                monthDays.length === 42 ? "grid-rows-6" : "grid-rows-5"
              }`}
            >
              {monthDays.map((day) => {
                const dayString = format(day, "yyyy-MM-dd");
                const dayAppointments = getAppointmentsForDay(day);
                const currentMonth = isSameMonth(day, monthStart);
                const dayIsToday = isToday(day);
                const past = isBefore(startOfDay(day), today);

                return (
                  <div
                    key={dayString}
                    className={`group relative min-h-0 overflow-hidden border-b border-r border-border/40 p-2 transition ${
                      !currentMonth
                        ? "bg-muted/[0.18] text-muted-foreground"
                        : "bg-background"
                    } ${past ? "bg-muted/[0.08]" : "hover:bg-muted/[0.16]"}`}
                  >
                    <div className="flex items-center justify-between">
                      <button
                        onClick={() => {
                          setCurrentDate(day);

                          if (dayAppointments.length > 0) {
                            setViewMode("day");
                          }
                        }}
                        className={`flex h-7 w-7 items-center justify-center rounded-full text-xs font-medium transition ${
                          dayIsToday
                            ? "bg-primary font-bold text-primary-foreground shadow-sm"
                            : "hover:bg-muted"
                        }`}
                      >
                        {format(day, "d")}
                      </button>

                      {!past && currentMonth && (
                        <button
                          onClick={() => openNewAppointment(day)}
                          className="flex h-6 w-6 items-center justify-center rounded-md text-muted-foreground/0 transition group-hover:text-muted-foreground hover:bg-muted hover:text-foreground"
                          title="Novo agendamento"
                        >
                          <Plus className="h-3.5 w-3.5" />
                        </button>
                      )}
                    </div>
                    <div className="mt-1.5 flex min-h-0 flex-col gap-1 overflow-hidden">
                      {dayAppointments.slice(0, 3).map((appointment) => {
                        const config = statusConfig[appointment.status];

                        return (
                          <button
                            key={appointment.id}
                            onClick={() => openAppointment(appointment)}
                            className={`group/event flex min-w-0 items-center gap-1.5 rounded-md border border-border/50 border-l-2 ${config.border} ${config.bg} ${config.hover} px-1.5 py-1 text-left transition`}
                          >
                            <span
                              className={`h-1.5 w-1.5 shrink-0 rounded-full ${config.dot}`}
                            />

                            <span className="shrink-0 text-[10px] font-medium">
                              {appointment.startTime}
                            </span>

                            <span className="truncate text-[10px] text-muted-foreground">
                              {appointment.patientName}
                            </span>
                          </button>
                        );
                      })}

                      {dayAppointments.length > 3 && (
                        <button
                          onClick={() => {
                            setCurrentDate(day);
                            setViewMode("day");
                          }}
                          className="px-1.5 text-left text-[10px] font-medium text-muted-foreground hover:text-foreground"
                        >
                          +{dayAppointments.length - 3} outros
                        </button>
                      )}
                    </div>
                    {dayAppointments.length === 0 && currentMonth && !past && (
                      <button
                        onClick={() => openNewAppointment(day)}
                        className="mt-2 flex w-full items-center justify-center rounded-md border border-dashed border-transparent py-1.5 text-[10px] text-transparent transition group-hover:border-border group-hover:text-muted-foreground"
                      >
                        <Plus className="mr-1 h-3 w-3" />
                        Agendar
                      </button>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        )}
      </Card>

      <NewAppointmentModal
        isOpen={isNewAppointmentOpen}
        onClose={() => setIsNewAppointmentOpen(false)}
      />

      <AppointmentDetailsModal
        appointment={selectedAppointment}
        onClose={() => setSelectedAppointment(null)}
      />
    </div>
  );
}
