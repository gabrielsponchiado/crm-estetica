"use client";

import { Calendar, DollarSign, Plus } from "lucide-react";

import { Button } from "@/components/ui/button";

const QUOTE_STATUS: Record<string, { label: string; className: string }> = {
  APPROVED: {
    label: "Aprovado",
    className: "bg-green-100 text-green-700",
  },
  REJECTED: {
    label: "Rejeitado",
    className: "bg-red-100 text-red-700",
  },
  EXPIRED: {
    label: "Expirado",
    className: "bg-gray-100 text-gray-500",
  },
  PENDING: {
    label: "Pendente",
    className: "bg-yellow-100 text-yellow-700",
  },
};

type PatientQuotesProps = {
  patient: any;
};

export function PatientQuotes({ patient }: PatientQuotesProps) {
  return (
    <div className="p-6">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h3 className="text-base font-semibold text-foreground">
            Orçamentos e Propostas
          </h3>

          <p className="text-sm text-muted-foreground mt-0.5">
            Acompanhamento financeiro de planos de tratamento.
          </p>
        </div>

        <Button
          size="sm"
          variant="outline"
          disabled
          className="gap-2 opacity-60"
        >
          <Plus className="w-4 h-4" />
          Novo Orçamento
          <span className="text-[10px] bg-muted px-1.5 py-0.5 rounded-full">
            Em breve
          </span>
        </Button>
      </div>

      {patient.quotes?.length > 0 ? (
        <div className="grid gap-3 lg:grid-cols-2">
          {patient.quotes.map((q: any) => {
            const cfg = QUOTE_STATUS[q.status] ?? {
              label: q.status || "Pendente",
              className: "bg-gray-100 text-gray-600",
            };

            return (
              <div
                key={q.id}
                className="flex items-center justify-between p-5 border rounded-xl bg-background"
              >
                <div className="flex gap-4 items-center">
                  <div className="bg-primary/10 p-3 rounded-full text-primary shrink-0">
                    <DollarSign className="w-4 h-4" />
                  </div>

                  <div>
                    <p className="font-semibold text-sm text-foreground">
                      Orçamento #{q.id.substring(0, 6).toUpperCase()}
                    </p>

                    <p className="text-xs text-muted-foreground flex items-center gap-1 mt-0.5">
                      <Calendar className="w-3 h-3" />

                      {new Date(q.createdAt).toLocaleDateString("pt-BR")}
                    </p>
                  </div>
                </div>

                <div className="text-right">
                  <p className="font-bold text-foreground">
                    R${" "}
                    {Number(q.totalValue).toLocaleString("pt-BR", {
                      minimumFractionDigits: 2,
                    })}
                  </p>

                  <span
                    className={`inline-block mt-1 text-xs px-2.5 py-0.5 rounded-full font-medium ${cfg.className}`}
                  >
                    {cfg.label}
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        <div className="text-center py-16 text-muted-foreground border border-dashed rounded-xl bg-muted/20">
          <DollarSign className="w-10 h-10 mx-auto mb-3 opacity-40" />

          <p className="font-medium">Nenhum orçamento registrado</p>
        </div>
      )}
    </div>
  );
}
