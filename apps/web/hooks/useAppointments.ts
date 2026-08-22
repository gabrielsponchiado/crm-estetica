"use client";

import { useState, useEffect, useMemo, useCallback } from "react";
import { format, isSameDay, parseISO } from "date-fns";
import { fetcher } from "@/lib/api";

import type {
  ApiAppointment,
  Appointment,
  AppointmentStatus,
  CreateAppointmentInput,
  UpdateAppointmentInput,
} from "@/types/appointment";

export type { Appointment, AppointmentStatus, CreateAppointmentInput, UpdateAppointmentInput };

interface UseAppointmentsOptions {
  startDate?: Date;
  endDate?: Date;
}

function normalizeAppointment(item: ApiAppointment): Appointment {
  const scheduled = new Date(item.scheduledAt);

  return {
    id: item.id,
    patientId: item.patientId,
    patientName: item.patient?.name ?? "Paciente removido",
    phone: item.patient?.phone ?? "",
    procedureId: item.procedureId ?? "",
    procedure: item.procedure?.name ?? "Procedimento removido",
    date: format(scheduled, "yyyy-MM-dd"),
    startTime: format(scheduled, "HH:mm"),
    durationMinutes: Number(item.durationMinutes) || 0,
    notes: item.notes ?? undefined,
    status: item.status,
  };
}

function toScheduledAtISO(date: string, startTime: string) {
  return new Date(`${date}T${startTime}:00`).toISOString();
}

export function useAppointments({ startDate, endDate }: UseAppointmentsOptions = {}) {
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const startKey = startDate ? startDate.toISOString() : undefined;
  const endKey = endDate ? endDate.toISOString() : undefined;

  const fetchAppointments = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);

      const params = new URLSearchParams();
      if (startKey) params.append("startDate", startKey);
      if (endKey) params.append("endDate", endKey);

      const query = params.toString();
      const data = await fetcher<ApiAppointment[]>(
        `/agenda${query ? `?${query}` : ""}`
      );
      setAppointments(data.map(normalizeAppointment));
    } catch (err: unknown) {
      const message =
        err instanceof Error ? err.message : "Erro desconhecido ao carregar a agenda.";
      console.error("Erro ao buscar agendamentos:", message);
      setError("Não foi possível carregar a agenda.");
    } finally {
      setLoading(false);
    }
  }, [startKey, endKey]);

  useEffect(() => {
    fetchAppointments();
  }, [fetchAppointments]);

  const getAppointmentsForDay = useCallback(
    (date: Date) =>
      appointments
        .filter((appointment) => isSameDay(parseISO(appointment.date), date))
        .sort((a, b) => a.startTime.localeCompare(b.startTime)),
    [appointments],
  );

  const stats = useMemo(() => {
    const total = appointments.length;
    const confirmed = appointments.filter((a) => a.status === "CONFIRMED").length;
    const scheduled = appointments.filter((a) => a.status === "SCHEDULED").length;
    const inProgress = appointments.filter((a) => a.status === "IN_PROGRESS").length;
    const completed = appointments.filter((a) => a.status === "COMPLETED").length;
    const cancelled = appointments.filter((a) => a.status === "CANCELED").length;

    return { total, confirmed, scheduled, inProgress, completed, cancelled };
  }, [appointments]);

  const createAppointment = async (
    input: CreateAppointmentInput,
  ): Promise<{ success: boolean; error?: string }> => {
    setIsSubmitting(true);
    try {
      await fetcher("/agenda", {
        method: "POST",
        body: JSON.stringify({
          patientId: input.patientId,
          procedureId: input.procedureId,
          date: toScheduledAtISO(input.date, input.startTime),
          duration: input.durationMinutes,
          notes: input.notes,
        }),
      });
      await fetchAppointments();
      return { success: true };
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : "Erro ao criar agendamento.";
      console.error("Erro ao criar agendamento:", message);
      return { success: false, error: message };
    } finally {
      setIsSubmitting(false);
    }
  };

  const updateAppointment = async (
    id: string,
    input: UpdateAppointmentInput,
  ): Promise<{ success: boolean; error?: string }> => {
    setIsSubmitting(true);
    try {
      const body: Record<string, unknown> = {};
      if (input.patientId) body.patientId = input.patientId;
      if (input.procedureId) body.procedureId = input.procedureId;
      if (input.notes !== undefined) body.notes = input.notes;
      if (input.status) body.status = input.status;
      if (input.durationMinutes !== undefined) body.duration = input.durationMinutes;
      if (input.date && input.startTime) {
        body.date = toScheduledAtISO(input.date, input.startTime);
      }

      await fetcher(`/agenda/${id}`, {
        method: "PATCH",
        body: JSON.stringify(body),
      });
      await fetchAppointments();
      return { success: true };
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : "Erro ao atualizar agendamento.";
      console.error("Erro ao atualizar agendamento:", message);
      return { success: false, error: message };
    } finally {
      setIsSubmitting(false);
    }
  };

  const updateAppointmentStatus = (id: string, status: AppointmentStatus) =>
    updateAppointment(id, { status });

  const deleteAppointment = async (id: string): Promise<boolean> => {
    try {
      await fetcher(`/agenda/${id}`, { method: "DELETE" });
      await fetchAppointments();
      return true;
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : "Erro ao excluir agendamento.";
      console.error("Erro ao excluir agendamento:", message);
      return false;
    }
  };

  return {
    appointments,
    stats,
    loading,
    isSubmitting,
    error,
    getAppointmentsForDay,
    createAppointment,
    updateAppointment,
    updateAppointmentStatus,
    deleteAppointment,
    refetch: fetchAppointments,
  };
}