"use client";

import { useEffect, useState } from "react";
import { Calendar, DollarSign, Pencil, Plus } from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { fetcher } from "@/lib/api";

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

type Quote = {
  id: string;
  totalValue: number | string;
  status: string;
  details?: {
    description?: string;
  };
  createdAt: string;
};

type PatientQuotesProps = {
  patient: any;
};

export function PatientQuotes({ patient }: PatientQuotesProps) {
  const [quotes, setQuotes] = useState<Quote[]>(patient.quotes ?? []);

  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingQuote, setEditingQuote] = useState<Quote | null>(null);

  const [totalValue, setTotalValue] = useState("");
  const [description, setDescription] = useState("");
  const [status, setStatus] = useState("PENDING");

  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    setQuotes(patient.quotes ?? []);
  }, [patient.quotes]);

  function openCreateDialog() {
    setEditingQuote(null);
    setTotalValue("");
    setDescription("");
    setStatus("PENDING");
    setError("");
    setIsDialogOpen(true);
  }

  function openEditDialog(quote: Quote) {
    setEditingQuote(quote);
    setTotalValue(String(quote.totalValue));
    setDescription(quote.details?.description ?? "");
    setStatus(quote.status);
    setError("");
    setIsDialogOpen(true);
  }

  async function handleSave() {
    setError("");

    const parsedValue = Number(
      totalValue.replace(/\./g, "").replace(",", "."),
    );

    if (!totalValue || Number.isNaN(parsedValue) || parsedValue < 0) {
      setError("Informe um valor válido para o orçamento.");
      return;
    }

    if (!description.trim()) {
      setError("Informe uma descrição para o orçamento.");
      return;
    }

    setIsSaving(true);

    try {
      const payload = {
        totalValue: parsedValue,
        details: {
          description: description.trim(),
        },
      };

      if (editingQuote) {
        const updatedQuote = await fetcher<Quote>(
          `/patients/${patient.id}/quotes/${editingQuote.id}`,
          {
            method: "PATCH",
            body: JSON.stringify({
              ...payload,
              status,
            }),
          },
        );

        setQuotes((current) =>
          current.map((quote) =>
            quote.id === editingQuote.id
              ? {
                  ...quote,
                  ...updatedQuote,
                }
              : quote,
          ),
        );
      } else {
        const newQuote = await fetcher<Quote>(
          `/patients/${patient.id}/quotes`,
          {
            method: "POST",
            body: JSON.stringify(payload),
          },
        );

        setQuotes((current) => [newQuote, ...current]);
      }

      setIsDialogOpen(false);
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : "Não foi possível salvar o orçamento.",
      );
    } finally {
      setIsSaving(false);
    }
  }

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
          className="gap-2"
          onClick={openCreateDialog}
        >
          <Plus className="w-4 h-4" />
          Novo Orçamento
        </Button>
      </div>

      {quotes.length > 0 ? (
        <div className="grid gap-3 lg:grid-cols-2">
          {quotes.map((q) => {
            const cfg = QUOTE_STATUS[q.status] ?? {
              label: q.status || "Pendente",
              className: "bg-gray-100 text-gray-600",
            };

            return (
              <div
                key={q.id}
                className="flex items-center justify-between p-5 border rounded-xl bg-background"
              >
                <div className="flex gap-4 items-center min-w-0">
                  <div className="bg-primary/10 p-3 rounded-full text-primary shrink-0">
                    <DollarSign className="w-4 h-4" />
                  </div>

                  <div className="min-w-0">
                    <p className="font-semibold text-sm text-foreground">
                      Orçamento #{q.id.substring(0, 6).toUpperCase()}
                    </p>

                    {q.details?.description && (
                      <p className="text-xs text-muted-foreground truncate max-w-[220px] mt-0.5">
                        {q.details.description}
                      </p>
                    )}

                    <p className="text-xs text-muted-foreground flex items-center gap-1 mt-1">
                      <Calendar className="w-3 h-3" />

                      {new Date(q.createdAt).toLocaleDateString("pt-BR")}
                    </p>
                  </div>
                </div>

                <div className="text-right shrink-0 ml-4">
                  <p className="font-bold text-foreground">
                    R${" "}
                    {Number(q.totalValue).toLocaleString("pt-BR", {
                      minimumFractionDigits: 2,
                    })}
                  </p>

                  <div className="flex items-center justify-end gap-2 mt-1">
                    <span
                      className={`text-xs px-2.5 py-0.5 rounded-full font-medium ${cfg.className}`}
                    >
                      {cfg.label}
                    </span>

                    <button
                      type="button"
                      onClick={() => openEditDialog(q)}
                      className="text-muted-foreground hover:text-foreground transition-colors"
                      title="Editar orçamento"
                    >
                      <Pencil className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        <div className="text-center py-16 text-muted-foreground border border-dashed rounded-xl bg-muted/20">
          <DollarSign className="w-10 h-10 mx-auto mb-3 opacity-40" />

          <p className="font-medium">Nenhum orçamento registrado</p>

          <p className="text-sm mt-1">
            Crie o primeiro orçamento deste paciente.
          </p>
        </div>
      )}

      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>
              {editingQuote ? "Editar orçamento" : "Novo orçamento"}
            </DialogTitle>

            <DialogDescription>
              {editingQuote
                ? "Atualize os dados deste orçamento."
                : "Registre um novo orçamento para este paciente."}
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4 py-2">
            <div className="space-y-2">
              <label
                htmlFor="quote-total-value"
                className="text-sm font-medium"
              >
                Valor
              </label>

              <Input
                id="quote-total-value"
                type="text"
                inputMode="decimal"
                placeholder="Ex.: 1.500,00"
                value={totalValue}
                onChange={(event) => setTotalValue(event.target.value)}
              />
            </div>

            <div className="space-y-2">
              <label
                htmlFor="quote-description"
                className="text-sm font-medium"
              >
                Descrição
              </label>

              <Input
                id="quote-description"
                placeholder="Ex.: Plano de tratamento facial"
                value={description}
                onChange={(event) => setDescription(event.target.value)}
              />
            </div>

            {editingQuote && (
              <div className="space-y-2">
                <label
                  htmlFor="quote-status"
                  className="text-sm font-medium"
                >
                  Status
                </label>

                <select
                  id="quote-status"
                  value={status}
                  onChange={(event) => setStatus(event.target.value)}
                  className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
                >
                  <option value="PENDING">Pendente</option>
                  <option value="APPROVED">Aprovado</option>
                  <option value="REJECTED">Rejeitado</option>
                  <option value="EXPIRED">Expirado</option>
                </select>
              </div>
            )}

            {error && (
              <p className="text-sm text-destructive">
                {error}
              </p>
            )}
          </div>

          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              onClick={() => setIsDialogOpen(false)}
              disabled={isSaving}
            >
              Cancelar
            </Button>

            <Button
              type="button"
              onClick={handleSave}
              disabled={isSaving}
            >
              {isSaving
                ? "Salvando..."
                : editingQuote
                  ? "Salvar alterações"
                  : "Criar orçamento"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}