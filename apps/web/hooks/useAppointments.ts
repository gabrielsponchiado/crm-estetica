"use client";

import { useMemo, useState } from "react";
import { isSameDay, parseISO } from "date-fns";

import type { CreateAppointmentInput } from "@/types/appointment";

export type AppointmentStatus =
  "scheduled" | "confirmed" | "in_progress" | "completed" | "cancelled";

export interface Appointment {
  id: string;
  patientName: string;
  phone: string;
  procedure: string;
  date: string;
  startTime: string;
  durationMinutes: number;
  notes?: string;
  status: AppointmentStatus;
}

const initialAppointments: Appointment[] = [
  {
    id: "1",
    patientName: "Maria Silva",
    phone: "(11) 99999-1111",
    procedure: "Toxina Botulínica (Botox)",
    date: "2026-08-15",
    startTime: "09:00",
    durationMinutes: 60,
    notes: "",
    status: "confirmed",
  },
  {
    id: "2",
    patientName: "Ana Carolina",
    phone: "(11) 99999-2222",
    procedure: "Preenchimento Labial",
    date: "2026-08-15",
    startTime: "10:30",
    durationMinutes: 90,
    notes: "",
    status: "scheduled",
  },
  {
    id: "3",
    patientName: "Juliana Costa",
    phone: "(11) 99999-3333",
    procedure: "Limpeza de Pele Profunda",
    date: "2026-08-16",
    startTime: "14:00",
    durationMinutes: 60,
    notes: "",
    status: "confirmed",
  },
];

export function useAppointments() {
  const [appointments, setAppointments] =
    useState<Appointment[]>(initialAppointments);

  const getAppointmentsForDay = (date: Date) => {
    return appointments.filter((appointment) =>
      isSameDay(parseISO(appointment.date), date),
    );
  };

  const stats = useMemo(() => {
    const total = appointments.length;

    const confirmed = appointments.filter(
      (appointment) => appointment.status === "confirmed",
    ).length;

    const scheduled = appointments.filter(
      (appointment) => appointment.status === "scheduled",
    ).length;

    const inProgress = appointments.filter(
      (appointment) => appointment.status === "in_progress",
    ).length;

    const completed = appointments.filter(
      (appointment) => appointment.status === "completed",
    ).length;

    const cancelled = appointments.filter(
      (appointment) => appointment.status === "cancelled",
    ).length;

    return {
      total,
      confirmed,
      scheduled,
      inProgress,
      completed,
      cancelled,
    };
  }, [appointments]);

  const createAppointment = (data: CreateAppointmentInput) => {
    const newAppointment: Appointment = {
      id: crypto.randomUUID(),
      patientName: data.patientName,
      phone: data.phone,
      procedure: data.procedure,
      date: data.date,
      startTime: data.startTime,
      durationMinutes: data.durationMinutes,
      notes: data.notes,
      status: "scheduled",
    };

    setAppointments((previous) => [...previous, newAppointment]);
  };

  const updateAppointmentStatus = (id: string, status: AppointmentStatus) => {
    setAppointments((previous) =>
      previous.map((appointment) =>
        appointment.id === id
          ? {
              ...appointment,
              status,
            }
          : appointment,
      ),
    );
  };

  const deleteAppointment = (id: string) => {
    setAppointments((previous) =>
      previous.filter((appointment) => appointment.id !== id),
    );
  };

  return {
    appointments,
    stats,
    getAppointmentsForDay,
    createAppointment,
    updateAppointmentStatus,
    deleteAppointment,
  };
}
