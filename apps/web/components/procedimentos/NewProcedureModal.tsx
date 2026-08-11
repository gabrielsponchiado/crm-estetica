"use client";

import { useState, useEffect } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { FormField } from "@/components/ui/form-field";
import { Procedure, CreateProcedureInput } from "@/hooks/useProcedures";
import {
  Sparkles,
  Clock,
  DollarSign,
  Calendar,
  Edit3,
  Loader2,
} from "lucide-react";

interface ProcedureModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (data: CreateProcedureInput) => Promise<boolean | void> | void;
  initialData?: Procedure | null;
  isSubmitting?: boolean;
}

interface FormErrors {
  name?: string;
  durationValue?: string;
  price?: string;
}

export function ProcedureModal({
  isOpen,
  onClose,
  onSave,
  initialData,
  isSubmitting = false,
}: ProcedureModalProps) {
  const [name, setName] = useState("");
  const [durationValue, setDurationValue] = useState("60");
  const [durationUnit, setDurationUnit] = useState<"minutes" | "hours">(
    "minutes",
  );
  const [price, setPrice] = useState("");
  const [description, setDescription] = useState("");
  const [recommendedMonths, setRecommendedMonths] = useState("");
  const [errors, setErrors] = useState<FormErrors>({});

  const isEditing = Boolean(initialData);

  useEffect(() => {
    if (isOpen) {
      setErrors({});
      if (initialData) {
        setName(initialData.name);

        if (
          initialData.durationMinutes % 60 === 0 &&
          initialData.durationMinutes >= 60
        ) {
          setDurationValue(String(initialData.durationMinutes / 60));
          setDurationUnit("hours");
        } else {
          setDurationValue(String(initialData.durationMinutes));
          setDurationUnit("minutes");
        }

        setPrice(String(initialData.price));
        setDescription(initialData.description || "");
        setRecommendedMonths(
          initialData.recommendedMonths != null
            ? String(initialData.recommendedMonths)
            : "",
        );
      } else {
        setName("");
        setDurationValue("60");
        setDurationUnit("minutes");
        setPrice("");
        setDescription("");
        setRecommendedMonths("");
      }
    }
  }, [isOpen, initialData]);

  const validateForm = (): boolean => {
    const newErrors: FormErrors = {};

    if (!name.trim()) {
      newErrors.name = "Por favor, informe o nome do procedimento.";
    }

    const numDuration = parseFloat(durationValue);
    if (!durationValue || isNaN(numDuration) || numDuration <= 0) {
      newErrors.durationValue = "Informe uma duração válida.";
    }

    const parsedPrice = parseFloat(price.replace(",", "."));
    if (!price || isNaN(parsedPrice) || parsedPrice < 0) {
      newErrors.price = "Informe um preço válido maior que zero.";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateForm()) {
      return;
    }
    const rawValue = parseFloat(durationValue) || 0;
    const totalMinutes =
      durationUnit === "hours"
        ? Math.round(rawValue * 60)
        : Math.round(rawValue);
    const payload: CreateProcedureInput = {
      name: name.trim(),
      durationMinutes: totalMinutes,
      price: Number(price.replace(",", ".")),
      description: description.trim(),
      recommendedMonths: recommendedMonths
        ? Number(recommendedMonths)
        : undefined,
    };
    const success = await onSave(payload);
    if (success) {
      onClose();
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle className="text-xl font-bold flex items-center gap-2 text-foreground">
            {isEditing ? (
              <>
                <Edit3 className="w-5 h-5 text-primary" /> Editar Procedimento
              </>
            ) : (
              <>
                <Sparkles className="w-5 h-5 text-primary" /> Cadastrar Novo
                Procedimento
              </>
            )}
          </DialogTitle>
          <DialogDescription>
            {isEditing
              ? "Atualize as informações do procedimento do catálogo."
              : "Adicione um novo serviço com preço e duração estimada para a sua clínica."}
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} noValidate className="space-y-4 py-2">
          {/* Nome do Procedimento */}
          <FormField label="Nome do Procedimento" required error={errors.name}>
            <Input
              placeholder="Ex: Preenchimento Labial com Ácido Hialurônico"
              value={name}
              onChange={(e) => {
                setName(e.target.value);
                if (errors.name)
                  setErrors((prev) => ({ ...prev, name: undefined }));
              }}
              className={`h-10 ${errors.name ? "border-destructive focus-visible:ring-destructive" : ""}`}
            />
          </FormField>

          {/* Duração & Preço */}
          <div className="grid grid-cols-2 gap-3 items-start">
            <FormField
              label="Duração Padrão"
              required
              error={errors.durationValue}
            >
              <div className="flex items-center gap-1.5">
                <Input
                  type="number"
                  step="any"
                  min="1"
                  placeholder="60"
                  value={durationValue}
                  onChange={(e) => {
                    setDurationValue(e.target.value);
                    if (errors.durationValue)
                      setErrors((prev) => ({
                        ...prev,
                        durationValue: undefined,
                      }));
                  }}
                  className={`flex-1 h-10 ${errors.durationValue ? "border-destructive focus-visible:ring-destructive" : ""}`}
                />
                <select
                  value={durationUnit}
                  onChange={(e) =>
                    setDurationUnit(e.target.value as "minutes" | "hours")
                  }
                  aria-label="Unidade de duração"
                  className="h-10 px-2.5 rounded-md border border-input bg-background text-xs font-medium focus:outline-none focus:ring-2 focus:ring-ring cursor-pointer"
                >
                  <option value="minutes">min</option>
                  <option value="hours">h</option>
                </select>
              </div>
            </FormField>

            <FormField label="Preço (R$)" required error={errors.price}>
              <Input
                type="number"
                step="0.01"
                placeholder="1500.00"
                value={price}
                onChange={(e) => {
                  setPrice(e.target.value);
                  if (errors.price)
                    setErrors((prev) => ({ ...prev, price: undefined }));
                }}
                className={`h-10 ${errors.price ? "border-destructive focus-visible:ring-destructive" : ""}`}
              />
            </FormField>
          </div>

          {/* Retorno Recomendado */}
          <FormField
            label="Retorno Recomendado (Meses)"
            description="Usado pelo CRM para sugerir novo agendamento ao paciente."
          >
            <Input
              type="number"
              min="1"
              placeholder="Ex: 6 (para lembrete automático aos 6 meses)"
              value={recommendedMonths}
              onChange={(e) => setRecommendedMonths(e.target.value)}
              className="h-10"
            />
          </FormField>

          {/* Descrição */}
          <FormField label="Descrição e Recomendações (Opcional)">
            <Textarea
              rows={3}
              placeholder="Detalhes sobre o procedimento, produtos recomendados ou cuidados pós-aplicação..."
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="resize-none"
            />
          </FormField>

          <DialogFooter className="pt-3 gap-2">
            <Button
              type="button"
              variant="outline"
              onClick={onClose}
              disabled={isSubmitting}
            >
              Cancelar
            </Button>
            <Button
              type="submit"
              disabled={isSubmitting}
              className="min-w-[140px]"
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" /> Salvando...
                </>
              ) : isEditing ? (
                "Salvar Alterações"
              ) : (
                "Cadastrar Procedimento"
              )}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}

export { ProcedureModal as NewProcedureModal };
