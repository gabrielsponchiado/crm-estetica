"use client";

import {
  ChevronLeft,
  ChevronRight,
} from "lucide-react";

import { Button } from "@/components/ui/button";

import type { AgendaView } from "hooks/useAgenda";

interface AgendaToolbarProps {
  periodLabel: string;
  viewMode: AgendaView;

  onViewChange: (
    view: AgendaView
  ) => void;

  onPrevious: () => void;
  onNext: () => void;
  onToday: () => void;
}

export function AgendaToolbar({
  periodLabel,
  viewMode,
  onViewChange,
  onPrevious,
  onNext,
  onToday,
}: AgendaToolbarProps) {
  return (
    <div className="flex items-center justify-between border-b px-4 py-3">
      <div className="flex items-center gap-2">
        <Button
          variant="outline"
          size="sm"
          onClick={onToday}
        >
          Hoje
        </Button>

        <div className="flex items-center">
          <Button
            variant="ghost"
            size="icon"
            onClick={onPrevious}
          >
            <ChevronLeft className="h-4 w-4" />
          </Button>

          <Button
            variant="ghost"
            size="icon"
            onClick={onNext}
          >
            <ChevronRight className="h-4 w-4" />
          </Button>
        </div>

        <h2 className="ml-2 min-w-[220px] text-base font-semibold capitalize">
          {periodLabel}
        </h2>
      </div>

      <select
        value={viewMode}
        onChange={(event) =>
          onViewChange(
            event.target.value as AgendaView
          )
        }
        className="h-9 rounded-md border border-input bg-background px-3 text-sm font-medium outline-none focus:ring-2 focus:ring-ring"
      >
        <option value="month">
          Mês
        </option>

        <option value="week">
          Semana
        </option>

        <option value="day">
          Dia
        </option>
      </select>
    </div>
  );
}