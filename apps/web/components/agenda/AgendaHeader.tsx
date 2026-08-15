"use client";

import { Plus } from "lucide-react";
import { Button } from "@/components/ui/button";

interface AgendaHeaderProps {
  onNewAppointment: () => void;
}

export function AgendaHeader({
  onNewAppointment,
}: AgendaHeaderProps) {
  return (
    <div className="flex items-center justify-between">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">
          Agenda
        </h1>

        <p className="mt-1 text-sm text-muted-foreground">
          Gerencie os atendimentos da clínica.
        </p>
      </div>

      <Button
        onClick={onNewAppointment}
        className="gap-2"
      >
        <Plus className="h-4 w-4" />
        Novo agendamento
      </Button>
    </div>
  );
}