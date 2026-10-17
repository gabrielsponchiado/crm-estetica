"use client";

import { Calendar, Clock, Plus } from "lucide-react";

import { Button } from "@/components/ui/button";

const STATUS_CONFIG: Record<string, { label: string; className: string }> = {
  COMPLETED: {
    label: "Finalizado",
    className: "bg-green-100 text-green-700 border-green-200",
  },
  CANCELED: {
    label: "Cancelado",
    className: "bg-red-100 text-red-700 border-red-200",
  },
  CONFIRMED: {
    label: "Confirmado",
    className: "bg-blue-100 text-blue-700 border-blue-200",
  },
  SCHEDULED: {
    label: "Agendado",
    className: "bg-orange-100 text-orange-700 border-orange-200",
  },
  IN_PROGRESS: {
    label: "Em andamento",
    className: "bg-purple-100 text-purple-700 border-purple-200",
  },
  NO_SHOW: {
    label: "Não compareceu",
    className: "bg-gray-100 text-gray-600 border-gray-200",
  },
};

type PatientAppointmentsProps = {
  patient: any;
  onNewAppointment: () => void;
};

export function PatientAppointments({
  patient,
  onNewAppointment,
}: PatientAppointmentsProps) {
  return (
    <div className="p-6">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h3 className="text-base font-semibold text-foreground">
            Histórico de Agendamentos
          </h3>

          <p className="text-sm text-muted-foreground mt-0.5">
            Consultas e sessões agendadas ou finalizadas.
          </p>
        </div>

        <Button size="sm" className="gap-2" onClick={onNewAppointment}>
          <Plus className="w-4 h-4" />
          Agendar Consulta
        </Button>
      </div>

      {patient.appointments?.length > 0 ? (
        <div className="grid gap-3 lg:grid-cols-2">
          {patient.appointments.map((apt: any) => {
            const cfg = STATUS_CONFIG[apt.status] ?? {
              label: apt.status || "Agendado",
              className: "bg-gray-100 text-gray-600 border-gray-200",
            };

            return (
              <div
                key={apt.id}
                className="flex flex-col sm:flex-row sm:items-center justify-between p-5 border rounded-xl bg-background gap-4"
              >
                <div className="flex items-center gap-4">
                  <div className="bg-primary/10 p-3 rounded-full text-primary shrink-0">
                    <Clock className="w-4 h-4" />
                  </div>

                  <div className="min-w-0">
                    <p className="font-semibold text-sm text-foreground truncate">
                      {apt.procedure?.name || "Consulta Estética"}
                    </p>

                    <p className="text-xs text-muted-foreground flex flex-wrap items-center gap-1.5 mt-0.5">
                      <Calendar className="w-3.5 h-3.5 shrink-0" />

                      {new Date(apt.scheduledAt).toLocaleDateString("pt-BR")}

                      <span>às</span>

                      <span className="font-medium">
                        {new Date(apt.scheduledAt).toLocaleTimeString("pt-BR", {
                          hour: "2-digit",
                          minute: "2-digit",
                        })}
                      </span>
                    </p>

                    {apt.notes && (
                      <p className="text-xs text-muted-foreground mt-1 truncate max-w-[240px]">
                        {apt.notes}
                      </p>
                    )}
                  </div>
                </div>

                <span
                  className={`text-xs px-3 py-1 rounded-full font-medium border shrink-0 ${cfg.className}`}
                >
                  {cfg.label}
                </span>
              </div>
            );
          })}
        </div>
      ) : (
        <div className="text-center py-16 text-muted-foreground border border-dashed rounded-xl bg-muted/20">
          <Clock className="w-10 h-10 mx-auto mb-3 opacity-40" />

          <p className="font-medium">Nenhum agendamento encontrado</p>

          <p className="text-xs mt-1 opacity-70">
            Crie o primeiro agendamento para este paciente
          </p>
        </div>
      )}
    </div>
  );
}
