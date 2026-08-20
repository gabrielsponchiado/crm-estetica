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
    <div className="flex items-center justify-between gap-4 border-b bg-muted/20 px-5 py-3">
      {/* ── Left: Navigation ── */}
      <div className="flex items-center gap-3">
        {/* Today button */}
        <button
          type="button"
          onClick={onToday}
          className="flex h-8 items-center rounded-lg border border-border bg-background px-3 text-xs font-semibold text-foreground shadow-sm transition-all hover:bg-muted hover:shadow-none active:scale-95"
        >
          Hoje
        </button>

        {/* Divider */}
        <div className="h-5 w-px bg-border" />

        {/* Prev / Next arrows */}
        <div className="flex items-center gap-0.5">
          <button
            type="button"
            onClick={onPrevious}
            aria-label="Período anterior"
            className="flex h-8 w-8 items-center justify-center rounded-lg text-muted-foreground transition-all hover:bg-muted hover:text-foreground active:scale-95"
          >
            <ChevronLeft className="h-4 w-4" />
          </button>
          <button
            type="button"
            onClick={onNext}
            aria-label="Próximo período"
            className="flex h-8 w-8 items-center justify-center rounded-lg text-muted-foreground transition-all hover:bg-muted hover:text-foreground active:scale-95"
          >
            <ChevronRight className="h-4 w-4" />
          </button>
        </div>

        {/* Period title */}
        <div className="flex items-center gap-2">
          <CalendarDays className="h-4 w-4 shrink-0 text-primary" />
          <h2 className="min-w-[180px] text-sm font-bold tracking-tight text-foreground capitalize">
            {periodLabel}
          </h2>
        </div>
      </div>

      {/* ── Right: View segmented control ── */}
      <div className="flex items-center rounded-lg border border-border bg-muted/40 p-0.5">
        {VIEW_OPTIONS.map(({ value, label }) => (
          <button
            key={value}
            type="button"
            onClick={() => onViewChange(value)}
            className={`relative h-7 rounded-md px-3.5 text-xs font-semibold transition-all ${
              viewMode === value
                ? "bg-background text-foreground shadow-sm"
                : "text-muted-foreground hover:text-foreground"
            }`}
          >
            {label}
          </button>
        ))}
      </div>
    </div>
  );
}