"use client";

import { useState } from "react";
import {
  CalendarDays,
  Check,
  ChevronDown,
  Clock3,
  MessageCircle,
  Pencil,
  Phone,
  XCircle,
} from "lucide-react";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

import type { Appointment, AppointmentStatus } from "@/types/appointment";
import { statusConfig } from "./appointment-status";

interface AppointmentDetailsModalProps {
  appointment: Appointment | null;
  onClose: () => void;
  onEdit?: (appointment: Appointment) => void;
  onCancel?: (appointment: Appointment) => void;
  onStatusChange?: (appointment: Appointment, status: AppointmentStatus) => Promise<void>;
  isCancelling?: boolean;
}

// All available statuses in logical progression order
const ALL_STATUSES: AppointmentStatus[] = [
  "SCHEDULED",
  "CONFIRMED",
  "IN_PROGRESS",
  "COMPLETED",
  "CANCELED",
  "NO_SHOW",
];

function formatDuration(minutes: number) {
  if (minutes < 60) return `${minutes} min`;
  const hours = Math.floor(minutes / 60);
  const remainingMinutes = minutes % 60;
  return remainingMinutes === 0 ? `${hours}h` : `${hours}h ${remainingMinutes}min`;
}

function getInitials(name: string) {
  return name
    .trim()
    .split(/\s+/)
    .slice(0, 2)
    .map((part) => part[0])
    .join("")
    .toUpperCase();
}

function formatPhone(phone: string) {
  const clean = phone.replace(/\D/g, "");
  if (clean.length === 11) return `(${clean.slice(0, 2)}) ${clean.slice(2, 7)}-${clean.slice(7)}`;
  if (clean.length === 10) return `(${clean.slice(0, 2)}) ${clean.slice(2, 6)}-${clean.slice(6)}`;
  return phone;
}

export function AppointmentDetailsModal({
  appointment,
  onClose,
  onEdit,
  onCancel,
  onStatusChange,
  isCancelling,
}: AppointmentDetailsModalProps) {
  const [showStatusMenu, setShowStatusMenu] = useState(false);
  const [isChangingStatus, setIsChangingStatus] = useState(false);

  const handleOpenWhatsApp = () => {
    if (!appointment?.phone) return;
    const cleanPhone = appointment.phone.replace(/\D/g, "");
    window.open(`https://wa.me/55${cleanPhone}`, "_blank", "noopener,noreferrer");
  };

  const handleStatusChange = async (newStatus: AppointmentStatus) => {
    if (!appointment || newStatus === appointment.status) {
      setShowStatusMenu(false);
      return;
    }

    // If cancelling via status menu, use the dedicated cancel handler for consistency
    if (newStatus === "CANCELED" && onCancel) {
      setShowStatusMenu(false);
      onCancel(appointment);
      return;
    }

    if (onStatusChange) {
      setIsChangingStatus(true);
      setShowStatusMenu(false);
      await onStatusChange(appointment, newStatus);
      setIsChangingStatus(false);
    }
  };

  if (!appointment) {
    return (
      <Dialog open={false} onOpenChange={() => {}}>
        <DialogContent />
      </Dialog>
    );
  }

  const status = statusConfig[appointment.status];
  const isCanceled = appointment.status === "CANCELED";
  const isCompleted = appointment.status === "COMPLETED";
  const isLoading = isCancelling || isChangingStatus;

  return (
    <Dialog open={!!appointment} onOpenChange={(open) => { if (!open) onClose(); }}>
      <DialogContent className="overflow-hidden p-0 sm:max-w-[500px]">
        <DialogHeader className="border-b bg-muted/20 px-6 pb-5 pt-6">
          <div className="flex items-start justify-between gap-4">
            <div className="flex min-w-0 items-center gap-3">
              <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-primary/10 text-sm font-bold text-primary">
                {getInitials(appointment.patientName)}
              </div>
              <div className="min-w-0">
                <DialogTitle className="truncate text-xl font-bold">{appointment.patientName}</DialogTitle>
                <DialogDescription className="mt-0.5">Detalhes do atendimento</DialogDescription>
              </div>
            </div>

            {/* Status Badge — clickable to open status menu */}
            <div className="relative shrink-0">
              <button
                type="button"
                onClick={() => setShowStatusMenu((v) => !v)}
                disabled={isLoading}
                className={`inline-flex items-center gap-1.5 rounded-full border px-3 py-1 text-xs font-semibold transition-opacity ${status.badge} hover:opacity-80 disabled:cursor-not-allowed disabled:opacity-50`}
              >
                {isLoading ? "Atualizando..." : status.label}
                <ChevronDown className={`h-3 w-3 transition-transform ${showStatusMenu ? "rotate-180" : ""}`} />
              </button>

              {/* Status dropdown */}
              {showStatusMenu && (
                <>
                  {/* Backdrop */}
                  <div
                    className="fixed inset-0 z-40"
                    onClick={() => setShowStatusMenu(false)}
                  />
                  <div className="absolute right-0 top-[calc(100%+6px)] z-50 min-w-[200px] overflow-hidden rounded-xl border border-border bg-background shadow-xl">
                    <p className="border-b px-3 py-2 text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">
                      Alterar status
                    </p>
                    {ALL_STATUSES.map((s) => {
                      const cfg = statusConfig[s];
                      const isActive = s === appointment.status;
                      return (
                        <button
                          key={s}
                          type="button"
                          onClick={() => handleStatusChange(s)}
                          className={`flex w-full items-center gap-2.5 px-3 py-2.5 text-left text-sm transition-colors hover:bg-muted/60 ${
                            isActive ? "bg-muted/40" : ""
                          }`}
                        >
                          {/* Colored dot */}
                          <span className={`h-2 w-2 shrink-0 rounded-full ${cfg.dot}`} />
                          <span className={`flex-1 font-medium ${isActive ? "text-foreground" : "text-foreground/80"}`}>
                            {cfg.label}
                          </span>
                          {isActive && <Check className="h-3.5 w-3.5 text-primary" />}
                        </button>
                      );
                    })}
                  </div>
                </>
              )}
            </div>
          </div>
        </DialogHeader>

        <div className="space-y-5 px-6 py-5">
          {/* Horário + Data */}
          <div className="rounded-xl border bg-card">
            <div className="grid grid-cols-2 divide-x">
              <div className="flex items-center gap-3 p-4">
                <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-primary/10">
                  <Clock3 className="h-4 w-4 text-primary" />
                </div>
                <div className="min-w-0">
                  <p className="text-xs font-medium text-muted-foreground">Horário</p>
                  <p className="mt-0.5 text-sm font-semibold">{appointment.startTime}</p>
                  <p className="text-xs text-muted-foreground">{formatDuration(appointment.durationMinutes)}</p>
                </div>
              </div>

              <div className="flex items-center gap-3 p-4">
                <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-primary/10">
                  <CalendarDays className="h-4 w-4 text-primary" />
                </div>
                <div className="min-w-0">
                  <p className="text-xs font-medium text-muted-foreground">Data</p>
                  <p className="mt-0.5 text-sm font-semibold">
                    {new Date(`${appointment.date}T00:00:00`).toLocaleDateString("pt-BR")}
                  </p>
                  <p className="text-xs text-muted-foreground">Atendimento</p>
                </div>
              </div>
            </div>
          </div>

          {/* Procedimento */}
          <div className="space-y-2">
            <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">Procedimento</p>
            <div className="rounded-xl border bg-muted/20 px-4 py-3.5">
              <p className="text-sm font-semibold">{appointment.procedure}</p>
            </div>
          </div>

          {/* Contato */}
          <div className="space-y-2">
            <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">Contato</p>
            <div className="rounded-xl border bg-muted/20">
              <div className="flex items-center gap-3 px-4 py-3.5">
                <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-muted">
                  <Phone className="h-4 w-4 text-muted-foreground" />
                </div>
                <div>
                  <p className="text-xs text-muted-foreground">Telefone / WhatsApp</p>
                  <p className="mt-0.5 text-sm font-medium">{formatPhone(appointment.phone)}</p>
                </div>
              </div>
            </div>
          </div>

          {/* Observações */}
          {appointment.notes && (
            <div className="space-y-2">
              <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">Observações</p>
              <div className="rounded-xl border bg-muted/20 px-4 py-3.5">
                <p className="text-sm">{appointment.notes}</p>
              </div>
            </div>
          )}

          {/* Actions */}
          <div className="space-y-3 pt-1">
            <Button type="button" onClick={handleOpenWhatsApp} className="h-11 w-full gap-2 font-semibold">
              <MessageCircle className="h-4 w-4" />
              Enviar lembrete pelo WhatsApp
            </Button>

            <div className="grid grid-cols-2 gap-3">
              <Button
                type="button"
                variant="outline"
                className="h-10 gap-2"
                onClick={() => onEdit?.(appointment)}
                disabled={isLoading}
              >
                <Pencil className="h-4 w-4" />
                Editar
              </Button>

              <Button
                type="button"
                variant="outline"
                disabled={isCanceled || isCompleted || isLoading}
                className="h-10 gap-2 border-destructive/30 text-destructive hover:bg-destructive/5 hover:text-destructive disabled:opacity-50"
                onClick={() => onCancel?.(appointment)}
              >
                <XCircle className="h-4 w-4" />
                {isCanceled
                  ? "Cancelado"
                  : isCancelling
                    ? "Cancelando..."
                    : "Cancelar"}
              </Button>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}