"use client";

import { Search, X } from "lucide-react";

import { Input } from "@/components/ui/input";

interface PatientsToolbarProps {
  searchTerm: string;
  totalPatients: number;
  onSearchChange: (value: string) => void;
}

export function PatientsToolbar({
  searchTerm,
  totalPatients,
  onSearchChange,
}: PatientsToolbarProps) {
  return (
    <div className="flex shrink-0 items-center justify-between gap-4 border-b border-border/60 p-3">
      <div className="relative max-w-xl flex-1">
        <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />

        <Input
          value={searchTerm}
          onChange={(event) => onSearchChange(event.target.value)}
          placeholder="Buscar por nome, telefone, CPF ou e-mail..."
          className="h-9 rounded-lg border-border/60 bg-muted/30 pl-9 pr-9 text-sm shadow-none transition-colors focus-visible:bg-background"
        />

        {searchTerm && (
          <button
            type="button"
            onClick={() => onSearchChange("")}
            className="absolute right-2.5 top-1/2 flex h-5 w-5 -translate-y-1/2 items-center justify-center rounded-md text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
            aria-label="Limpar busca"
          >
            <X className="h-3.5 w-3.5" />
          </button>
        )}
      </div>

      <div className="shrink-0 text-xs text-muted-foreground">
        <span className="font-medium text-foreground">
          {totalPatients}
        </span>{" "}
        {totalPatients === 1 ? "cliente" : "clientes"}
      </div>
    </div>
  );
}