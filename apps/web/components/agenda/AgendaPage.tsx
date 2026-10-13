"use client";

import { useState } from "react";
import { format } from "date-fns";
import { toast } from "sonner";

import { useAgenda } from "@/hooks/useAgenda";
import { useAppointments } from "@/hooks/useAppointments";
import type {
  Appointment,
  AppointmentStatus,
  CreateAppointmentInput,
} from "@/types/appointment";

import { AgendaHeader } from "./AgendaHeader";
import { AgendaToolbar } from "./AgendaToolbar";
import { MonthView } from "./MonthView";
import { WeekView } from "./WeekView";
import { DayView } from "./DayView";
import { NewAppointmentModal } from "./NewAppointmentModal";
import { AppointmentDetailsModal } from "./AppointmentDetailsModal";

import { Card } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";

export function AgendaPage() {
  const agenda = useAgenda();

  const {
    stats,
    loading,
    error,
    getAppointmentsForDay,
    createAppointment,
    updateAppointment,
    updateAppointmentStatus,
  } = useAppointments({
    startDate: agenda.rangeStart,
    endDate: agenda.rangeEnd,
  });

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalInitialDate, setModalInitialDate] = useState<
    string | undefined
  >();
  const [editingAppointment, setEditingAppointment] =
    useState<Appointment | null>(null);
  const [selectedAppointment, setSelectedAppointment] =
    useState<Appointment | null>(null);
  const [cancellingId, setCancellingId] = useState<string | null>(null);

  const openNewAppointment = (date?: Date) => {
    setEditingAppointment(null);
    setModalInitialDate(date ? format(date, "yyyy-MM-dd") : undefined);
    setIsModalOpen(true);
  };

  const openEditAppointment = (appointment: Appointment) => {
    setSelectedAppointment(null);
    setEditingAppointment(appointment);
    setIsModalOpen(true);
  };

  const handleSave = async (data: CreateAppointmentInput) => {
    const result = editingAppointment
      ? await updateAppointment(editingAppointment.id, data)
      : await createAppointment(data);

    if (!result.success) {
      toast.error(
        editingAppointment
          ? "Não foi possível atualizar o agendamento."
          : "Não foi possível criar o agendamento.",
        {
          description: result.error || "Verifique os dados e tente novamente.",
        },
      );

      return result;
    }

    toast.success(
      editingAppointment
        ? "Agendamento atualizado com sucesso."
        : "Agendamento criado com sucesso.",
    );

    setEditingAppointment(null);

    return result;
  };

  const handleCancel = async (appointment: Appointment) => {
    setCancellingId(appointment.id);

    const result = await updateAppointmentStatus(appointment.id, "CANCELED");

    setCancellingId(null);

    if (!result.success) {
      toast.error("Não foi possível cancelar o agendamento.", {
        description: result.error || "Tente novamente em alguns instantes.",
      });

      return;
    }

    toast.success("Agendamento cancelado com sucesso.");
    setSelectedAppointment(null);
  };

  const handleStatusChange = async (
    appointment: Appointment,
    status: AppointmentStatus,
  ) => {
    setCancellingId(appointment.id);

    const result = await updateAppointmentStatus(appointment.id, status);

    setCancellingId(null);

    if (!result.success) {
      toast.error("Não foi possível atualizar o status.", {
        description: result.error || "Tente novamente em alguns instantes.",
      });

      return;
    }

    toast.success("Status atualizado com sucesso.");

    setSelectedAppointment((previous) =>
      previous
        ? {
            ...previous,
            status,
          }
        : null,
    );
  };

  return (
    <div className="flex h-full flex-1 flex-col gap-5">
      <AgendaHeader onNewAppointment={() => openNewAppointment()} />

      <Card className="flex flex-1 flex-col overflow-hidden border-border/60 shadow-sm">
        <AgendaToolbar
          periodLabel={agenda.periodLabel}
          viewMode={agenda.viewMode}
          onViewChange={agenda.setViewMode}
          onPrevious={agenda.goToPrevious}
          onNext={agenda.goToNext}
          onToday={agenda.goToToday}
        />

        {loading ? (
          <div className="space-y-2 p-4">
            <Skeleton className="h-10 w-full" />
            <Skeleton className="h-24 w-full" />
            <Skeleton className="h-24 w-full" />
          </div>
        ) : error ? (
          <div className="flex h-48 items-center justify-center text-sm text-muted-foreground">
            {error}
          </div>
        ) : (
          <div className="flex flex-1 flex-col overflow-y-auto">
            {agenda.viewMode === "month" && (
              <MonthView
                days={agenda.monthDays}
                getAppointmentsForDay={getAppointmentsForDay}
                isToday={agenda.isToday}
                isCurrentMonth={agenda.isCurrentMonth}
                onSelectDate={(date) => {
                  agenda.selectDate(date);
                  agenda.setViewMode("day");
                }}
                onSelectAppointment={setSelectedAppointment}
                onNewAppointment={openNewAppointment}
              />
            )}

            {agenda.viewMode === "week" && (
              <WeekView
                days={agenda.weekDays}
                getAppointmentsForDay={getAppointmentsForDay}
                isToday={agenda.isToday}
                onSelectAppointment={setSelectedAppointment}
                onNewAppointment={openNewAppointment}
              />
            )}

            {agenda.viewMode === "day" && (
              <DayView
                date={agenda.currentDate}
                appointments={getAppointmentsForDay(agenda.currentDate)}
                onSelectAppointment={setSelectedAppointment}
                onNewAppointment={openNewAppointment}
              />
            )}
          </div>
        )}
      </Card>

      <NewAppointmentModal
        isOpen={isModalOpen}
        onClose={() => {
          setIsModalOpen(false);
          setEditingAppointment(null);
        }}
        onSave={handleSave}
        initialDate={modalInitialDate}
        appointment={editingAppointment}
      />

      <AppointmentDetailsModal
        appointment={selectedAppointment}
        onClose={() => setSelectedAppointment(null)}
        onEdit={openEditAppointment}
        onCancel={handleCancel}
        onStatusChange={handleStatusChange}
        isCancelling={!!cancellingId}
      />
    </div>
  );
}
