"use client";

import { Search, X, SlidersHorizontal, Check } from "lucide-react";

import { Input } from "@/components/ui/input";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import type { PatientSearchField } from "@/hooks/usePatient";

interface PatientsToolbarProps {
  searchTerm: string;
  searchField: PatientSearchField;
  totalPatients: number;
  onSearchChange: (value: string) => void;
  onSearchFieldChange: (field: PatientSearchField) => void;
}

const FIELD_LABELS: Record<PatientSearchField, string> = {
  all: "Todos os campos",
  name: "Somente nome",
  email: "Somente e-mail",
  cpf: "Somente CPF",
};

export function PatientsToolbar({
  searchTerm,
  searchField,
  totalPatients,
  onSearchChange,
  onSearchFieldChange,
}: PatientsToolbarProps) {
  return (
    <div className="flex shrink-0 flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
      <div className="flex flex-1 items-center gap-2">
        <div className="relative w-full max-w-xl">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />

          <Input
            value={searchTerm}
            onChange={(event) => onSearchChange(event.target.value)}
            placeholder="Buscar por nome, telefone, CPF ou e-mail..."
            maxLength={100}
            className="h-10 rounded-lg border-border/60 bg-background pl-9 pr-9 text-sm shadow-sm transition-colors"
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

        <DropdownMenu>
          <DropdownMenuTrigger className="inline-flex h-10 shrink-0 items-center gap-2 rounded-lg border border-border/60 bg-background px-3 text-sm font-medium text-muted-foreground shadow-sm transition-colors hover:bg-muted hover:text-foreground cursor-pointer">
            <SlidersHorizontal className="h-3.5 w-3.5" />
            <span className="hidden sm:inline">
              {searchField === "all" ? "Filtros" : FIELD_LABELS[searchField]}
            </span>
          </DropdownMenuTrigger>

          <DropdownMenuContent align="start" className="w-52">
            {(Object.keys(FIELD_LABELS) as PatientSearchField[]).map(
              (field) => (
                <DropdownMenuItem
                  key={field}
                  onClick={() => onSearchFieldChange(field)}
                  className="cursor-pointer justify-between"
                >
                  {FIELD_LABELS[field]}
                  {searchField === field && (
                    <Check className="h-3.5 w-3.5 text-primary" />
                  )}
                </DropdownMenuItem>
              ),
            )}
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </div>
  );
}