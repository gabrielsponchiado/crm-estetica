"use client";

import { CalendarDays, ChevronLeft, ChevronRight } from "lucide-react";
import type { AgendaView } from "@/hooks/useAgenda";

interface AgendaToolbarProps {
  periodLabel: string;
  viewMode: AgendaView;
  onViewChange: (view: AgendaView) => void;
  onPrevious: () => void;
  onNext: () => void;
  onToday: () => void;
}

const VIEW_OPTIONS: { value: AgendaView; label: string }[] = [
  { value: "month", label: "Mês" },
  { value: "week", label: "Semana" },
  { value: "day", label: "Dia" },
];

export function AgendaToolbar({
  periodLabel,
  viewMode,
  onViewChange,
  onPrevious,
  onNext,
  onToday,
}: AgendaToolbarProps) {
  return (
    <div className="flex items-center justify-between border-b border-border bg-white px-5 py-3">
      {/* ── Left: View segmented control ── */}
      <div className="flex items-center rounded-lg bg-muted/40 p-1 shadow-sm border border-border/50">
        {VIEW_OPTIONS.map(({ value, label }) => (
          <button
            key={value}
            type="button"
            onClick={() => onViewChange(value)}
            className={`relative h-8 rounded-md px-4 text-xs font-semibold transition-all ${
              viewMode === value
                ? "bg-white text-foreground shadow-sm ring-1 ring-border/50"
                : "text-muted-foreground hover:text-foreground hover:bg-white/50"
            }`}
          >
            {label}
          </button>
        ))}
      </div>

      {/* ── Right: Period & Navigation ── */}
      <div className="flex items-center gap-5">
        <div className="flex items-center gap-2">
          <CalendarDays className="h-4 w-4 text-muted-foreground" />
          <h2 className="text-sm font-bold text-foreground capitalize">
            {periodLabel}
          </h2>
        </div>

        <div className="flex items-center gap-1">
          <button
            type="button"
            onClick={onPrevious}
            title="Período anterior"
            className="flex h-8 w-8 items-center justify-center rounded-md border border-border bg-white text-muted-foreground shadow-sm hover:bg-muted hover:text-foreground transition-all"
          >
            <ChevronLeft className="h-4 w-4" />
          </button>
          
          <button
            type="button"
            onClick={onToday}
            className="flex h-8 items-center px-3 mx-1 text-xs font-medium rounded-md border border-border bg-white text-foreground shadow-sm hover:bg-muted transition-all"
          >
            Hoje
          </button>

          <button
            type="button"
            onClick={onNext}
            title="Próximo período"
            className="flex h-8 w-8 items-center justify-center rounded-md border border-border bg-white text-muted-foreground shadow-sm hover:bg-muted hover:text-foreground transition-all"
          >
            <ChevronRight className="h-4 w-4" />
          </button>
        </div>
      </div>
    </div>
  );
}