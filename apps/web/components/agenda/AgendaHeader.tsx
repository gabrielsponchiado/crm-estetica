"use client";

import { Plus, CalendarDays } from "lucide-react";
import { Button } from "@/components/ui/button";

interface AgendaHeaderProps {
  onNewAppointment: () => void;
}

export function AgendaHeader({
  onNewAppointment,
}: AgendaHeaderProps) {
  return (
    <header className="flex shrink-0 items-end justify-between gap-6">
      <div className="flex items-center gap-3">
        <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-primary/10">
          <CalendarDays className="h-[18px] w-[18px] text-primary" />
        </div>

        <div>
          <h1 className="text-2xl font-semibold tracking-tight">Agenda</h1>
          <p className="text-sm text-muted-foreground">
            Gerencie os atendimentos da clínica.
          </p>
        </div>
      </div>

      <Button
        onClick={onNewAppointment}
        className="h-10 gap-2 rounded-lg px-4 shadow-sm"
      >
        <Plus className="h-4 w-4" />
        Novo agendamento
      </Button>
    </header>
  );
}