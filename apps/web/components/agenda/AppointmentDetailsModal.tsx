"use client";

import {
  CalendarDays,
  Clock3,
  MessageCircle,
  Pencil,
  Phone,
  UserRound,
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

interface Appointment {
  id: string;
  patientName: string;
  procedure: string;
  startTime: string;
  durationMinutes: number;
  status: "SCHEDULED" | "CONFIRMED" | "IN_PROGRESS" | "COMPLETED" | "CANCELLED";
  phone: string;
  date?: string;
}

interface AppointmentDetailsModalProps {
  appointment: Appointment | null;
  onClose: () => void;
  onEdit?: (appointment: Appointment) => void;
  onCancel?: (appointment: Appointment) => void;
}

const statusConfig = {
  SCHEDULED: {
    label: "Agendado",
    className: "border-amber-200 bg-amber-50 text-amber-700",
  },

  CONFIRMED: {
    label: "Confirmado",
    className: "border-emerald-200 bg-emerald-50 text-emerald-700",
  },

  IN_PROGRESS: {
    label: "Em atendimento",
    className: "border-blue-200 bg-blue-50 text-blue-700",
  },

  COMPLETED: {
    label: "Concluído",
    className: "border-slate-200 bg-slate-50 text-slate-700",
  },

  CANCELLED: {
    label: "Cancelado",
    className: "border-red-200 bg-red-50 text-red-700",
  },
};

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

  if (clean.length === 11) {
    return `(${clean.slice(0, 2)}) ${clean.slice(2, 7)}-${clean.slice(7)}`;
  }

  if (clean.length === 10) {
    return `(${clean.slice(0, 2)}) ${clean.slice(2, 6)}-${clean.slice(6)}`;
  }

  return phone;
}

export function AppointmentDetailsModal({
  appointment,
  onClose,
  onEdit,
  onCancel,
}: AppointmentDetailsModalProps) {
  const handleOpenWhatsApp = () => {
    if (!appointment?.phone) return;

    const cleanPhone = appointment.phone.replace(/\D/g, "");

    window.open(
      `https://wa.me/55${cleanPhone}`,
      "_blank",
      "noopener,noreferrer",
    );
  };

  if (!appointment) {
    return (
      <Dialog open={false} onOpenChange={() => {}}>
        <DialogContent />
      </Dialog>
    );
  }

  const status = statusConfig[appointment.status];

  return (
    <Dialog
      open={!!appointment}
      onOpenChange={(open) => {
        if (!open) {
          onClose();
        }
      }}
    >
      <DialogContent className="overflow-hidden p-0 sm:max-w-[500px]">
        <DialogHeader className="border-b bg-muted/20 px-6 pb-5 pt-6">
          <div className="flex items-start justify-between gap-4">
            <div className="flex min-w-0 items-center gap-3">
              <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-primary/10 text-sm font-bold text-primary">
                {getInitials(appointment.patientName)}
              </div>

              <div className="min-w-0">
                <DialogTitle className="truncate text-xl font-bold">
                  {appointment.patientName}
                </DialogTitle>

                <DialogDescription className="mt-0.5">
                  Detalhes do atendimento
                </DialogDescription>
              </div>
            </div>

            <Badge
              variant="outline"
              className={`shrink-0 font-semibold ${status.className}`}
            >
              {status.label}
            </Badge>
          </div>
        </DialogHeader>

        <div className="space-y-5 px-6 py-5">
          <div className="rounded-xl border bg-card">
            <div className="grid grid-cols-2 divide-x">
              <div className="flex items-center gap-3 p-4">
                <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-primary/10">
                  <Clock3 className="h-4 w-4 text-primary" />
                </div>

                <div className="min-w-0">
                  <p className="text-xs font-medium text-muted-foreground">
                    Horário
                  </p>

                  <p className="mt-0.5 text-sm font-semibold">
                    {appointment.startTime}
                  </p>

                  <p className="text-xs text-muted-foreground">
                    {formatDuration(appointment.durationMinutes)}
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-3 p-4">
                <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-primary/10">
                  <CalendarDays className="h-4 w-4 text-primary" />
                </div>

                <div className="min-w-0">
                  <p className="text-xs font-medium text-muted-foreground">
                    Data
                  </p>

                  <p className="mt-0.5 text-sm font-semibold">
                    {appointment.date
                      ? new Date(
                          `${appointment.date}T00:00:00`,
                        ).toLocaleDateString("pt-BR")
                      : "Não informada"}
                  </p>

                  <p className="text-xs text-muted-foreground">Atendimento</p>
                </div>
              </div>
            </div>
          </div>

          <div className="space-y-2">
            <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
              Procedimento
            </p>

            <div className="rounded-xl border bg-muted/20 px-4 py-3.5">
              <p className="text-sm font-semibold">{appointment.procedure}</p>
            </div>
          </div>

          <div className="space-y-2">
            <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
              Contato
            </p>

            <div className="rounded-xl border bg-muted/20">
              <div className="flex items-center gap-3 px-4 py-3.5">
                <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-muted">
                  <Phone className="h-4 w-4 text-muted-foreground" />
                </div>

                <div>
                  <p className="text-xs text-muted-foreground">
                    Telefone / WhatsApp
                  </p>

                  <p className="mt-0.5 text-sm font-medium">
                    {formatPhone(appointment.phone)}
                  </p>
                </div>
              </div>
            </div>
          </div>

          <div className="space-y-3 pt-1">
            <Button
              type="button"
              onClick={handleOpenWhatsApp}
              className="h-11 w-full gap-2 font-semibold"
            >
              <MessageCircle className="h-4 w-4" />
              Enviar lembrete pelo WhatsApp
            </Button>

            <div className="grid grid-cols-2 gap-3">
              <Button
                type="button"
                variant="outline"
                className="h-10 gap-2"
                onClick={() => onEdit?.(appointment)}
              >
                <Pencil className="h-4 w-4" />
                Editar
              </Button>

              <Button
                type="button"
                variant="outline"
                className="h-10 gap-2 border-destructive/30 text-destructive hover:bg-destructive/5 hover:text-destructive"
                onClick={() => onCancel?.(appointment)}
              >
                <XCircle className="h-4 w-4" />
                Cancelar
              </Button>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
