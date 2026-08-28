"use client";

import { ChevronLeft, ChevronRight } from "lucide-react";

import { Button } from "@/components/ui/button";

interface PatientsPaginationProps {
  currentPage: number;
  totalPages: number;
  totalPatients: number;
  itemsPerPage: number;
  loading: boolean;
  onPageChange: (page: number) => void;
}

export function PatientsPagination({
  currentPage,
  totalPages,
  totalPatients,
  itemsPerPage,
  loading,
  onPageChange,
}: PatientsPaginationProps) {
  const getPages = (): (number | string)[] => {
    const pages: (number | string)[] = [];

    if (totalPages <= 7) {
      for (let i = 1; i <= totalPages; i++) {
        pages.push(i);
      }

      return pages;
    }

    if (currentPage <= 4) {
      return [1, 2, 3, 4, 5, "...", totalPages];
    }

    if (currentPage >= totalPages - 3) {
      return [
        1,
        "...",
        totalPages - 4,
        totalPages - 3,
        totalPages - 2,
        totalPages - 1,
        totalPages,
      ];
    }

    return [
      1,
      "...",
      currentPage - 1,
      currentPage,
      currentPage + 1,
      "...",
      totalPages,
    ];
  };

  const firstItem =
    totalPatients === 0 ? 0 : (currentPage - 1) * itemsPerPage + 1;

  const lastItem =
    totalPatients === 0
      ? 0
      : Math.min(currentPage * itemsPerPage, totalPatients);

  return (
    <div className="flex shrink-0 flex-col items-center justify-between gap-3 border-t border-border/60 px-4 py-3 sm:flex-row">
      <p className="text-xs text-muted-foreground">
        Exibindo{" "}
        <span className="font-medium text-foreground">
          {firstItem}-{lastItem}
        </span>{" "}
        de <span className="font-medium text-foreground">{totalPatients}</span>{" "}
        clientes
      </p>

      <div className="flex items-center gap-1">
        <Button
          variant="ghost"
          size="sm"
          disabled={currentPage <= 1 || loading}
          onClick={() => onPageChange(Math.max(1, currentPage - 1))}
          className="h-8 gap-1 rounded-md px-2.5 text-xs"
        >
          <ChevronLeft className="h-3.5 w-3.5" />

          <span className="hidden sm:inline">Anterior</span>
        </Button>

        <div className="mx-1 flex items-center gap-0.5">
          {getPages().map((page, index) => {
            if (typeof page === "string") {
              return (
                <span
                  key={`ellipsis-${index}`}
                  className="px-1.5 text-xs text-muted-foreground"
                >
                  ...
                </span>
              );
            }

            const active = page === currentPage;

            return (
              <Button
                key={page}
                variant={active ? "default" : "ghost"}
                size="icon"
                disabled={loading}
                onClick={() => onPageChange(page)}
                className={`h-8 w-8 rounded-md text-xs ${
                  active ? "font-semibold shadow-sm" : "text-muted-foreground"
                }`}
              >
                {page}
              </Button>
            );
          })}
        </div>

        <Button
          variant="ghost"
          size="sm"
          disabled={currentPage >= totalPages || loading}
          onClick={() => onPageChange(Math.min(totalPages, currentPage + 1))}
          className="h-8 gap-1 rounded-md px-2.5 text-xs"
        >
          <span className="hidden sm:inline">Próximo</span>

          <ChevronRight className="h-3.5 w-3.5" />
        </Button>
      </div>
    </div>
  );
}
