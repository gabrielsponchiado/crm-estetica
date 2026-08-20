"use client";

import { useState } from "react";
import { format } from "date-fns";

import { useAgenda } from "@/hooks/useAgenda";
import { useAppointments } from "@/hooks/useAppointments";
import type { Appointment, CreateAppointmentInput } from "@/types/appointment";
import type { AppointmentStatus } from "@/types/appointment";

import { AgendaHeader } from "./AgendaHeader";
import { AgendaStats } from "./AgendaStats";
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
  } = useAppointments({ startDate: agenda.rangeStart, endDate: agenda.rangeEnd });

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalInitialDate, setModalInitialDate] = useState<string | undefined>();
  const [editingAppointment, setEditingAppointment] = useState<Appointment | null>(null);
  const [selectedAppointment, setSelectedAppointment] = useState<Appointment | null>(null);
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

  const handleSave = (data: CreateAppointmentInput) =>
    editingAppointment ? updateAppointment(editingAppointment.id, data) : createAppointment(data);

  const handleCancel = async (appointment: Appointment) => {
    setCancellingId(appointment.id);
    await updateAppointmentStatus(appointment.id, "CANCELED");
    setCancellingId(null);
    setSelectedAppointment(null);
  };

  const handleStatusChange = async (appointment: Appointment, status: AppointmentStatus) => {
    setCancellingId(appointment.id); // reutilizando o loading state
    await updateAppointmentStatus(appointment.id, status);
    setCancellingId(null);
    // Keep modal open after status change so user can see the updated badge
    setSelectedAppointment((prev) => prev ? { ...prev, status } : null);
  };

  return (
    <div className="flex flex-col gap-5">
      <AgendaHeader onNewAppointment={() => openNewAppointment()} />

      <AgendaStats
        total={stats.total}
        confirmed={stats.confirmed}
        scheduled={stats.scheduled}
        cancelled={stats.cancelled}
      />

      <Card className="overflow-hidden border-border/60 shadow-sm">
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
          <div className="flex h-48 items-center justify-center text-sm text-muted-foreground">{error}</div>
        ) : (
          <>
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
          </>
        )}
      </Card>

      <NewAppointmentModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
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