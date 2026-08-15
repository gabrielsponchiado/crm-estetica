"use client";

import { useEffect, useState } from "react";
import type { CreateAppointmentInput } from "@/types/appointment";
import type { DurationUnit } from "@/types/procedure";

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

import {
  CalendarDays,
  Clock3,
  FileText,
  Phone,
  Plus,
  Stethoscope,
  UserRound,
} from "lucide-react";

interface NewAppointmentModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave?: (appointment: CreateAppointmentInput) => void | Promise<void>;
  initialDate?: string;
}

interface AppointmentFormErrors {
  patientName?: string;
  phone?: string;
  procedure?: string;
  date?: string;
  startTime?: string;
  durationValue?: string;
}

const procedures = [
  "Toxina Botulínica (Botox)",
  "Preenchimento Labial",
  "Limpeza de Pele Profunda",
  "Bioestimulador de Colágeno",
];

function getTodayDate() {
  const today = new Date();

  const year = today.getFullYear();
  const month = String(today.getMonth() + 1).padStart(2, "0");
  const day = String(today.getDate()).padStart(2, "0");

  return `${year}-${month}-${day}`;
}

export function NewAppointmentModal({
  isOpen,
  onClose,
  onSave,
  initialDate,
}: NewAppointmentModalProps) {
  const [patientName, setPatientName] = useState("");
  const [phone, setPhone] = useState("");
  const [procedure, setProcedure] = useState("");
  const [date, setDate] = useState(initialDate || getTodayDate());
  const [startTime, setStartTime] = useState("09:00");
  const [durationValue, setDurationValue] = useState("60");
  const [durationUnit, setDurationUnit] = useState<DurationUnit>("minutes");
  const [notes, setNotes] = useState("");
  const [errors, setErrors] = useState<AppointmentFormErrors>({});

  useEffect(() => {
    if (!isOpen) return;

    setPatientName("");
    setPhone("");
    setProcedure("");
    setDate(initialDate || getTodayDate());
    setStartTime("09:00");
    setDurationValue("60");
    setDurationUnit("minutes");
    setNotes("");
    setErrors({});
  }, [isOpen, initialDate]);

  const clearError = (field: keyof AppointmentFormErrors) => {
    if (!errors[field]) return;

    setErrors((previous) => ({
      ...previous,
      [field]: undefined,
    }));
  };

  const validateForm = () => {
    const newErrors: AppointmentFormErrors = {};

    if (!patientName.trim()) {
      newErrors.patientName = "Informe o nome do paciente.";
    }

    if (!phone.trim()) {
      newErrors.phone = "Informe o telefone ou WhatsApp.";
    }

    if (!procedure) {
      newErrors.procedure = "Selecione um procedimento.";
    }

    if (!date) {
      newErrors.date = "Informe a data do atendimento.";
    }

    if (!startTime) {
      newErrors.startTime = "Informe o horário do atendimento.";
    }

    const parsedDuration = Number(durationValue);

    if (!durationValue || Number.isNaN(parsedDuration) || parsedDuration <= 0) {
      newErrors.durationValue = "Informe uma duração válida.";
    }

    setErrors(newErrors);

    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (!validateForm()) {
      return;
    }

    const rawValue = Number(durationValue);

    const totalMinutes =
      durationUnit === "hours"
        ? Math.round(rawValue * 60)
        : Math.round(rawValue);

    const payload: CreateAppointmentInput = {
      patientName: patientName.trim(),
      phone: phone.trim(),
      procedure,
      date,
      startTime,
      durationMinutes: totalMinutes,
      notes: notes.trim(),
    };

    if (onSave) {
      await onSave(payload);
    }

    onClose();
  };

  return (
    <Dialog
      open={isOpen}
      onOpenChange={(open) => {
        if (!open) {
          onClose();
        }
      }}
    >
      <DialogContent className="sm:max-w-[560px]">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 text-xl font-bold">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary/10">
              <CalendarDays className="h-4 w-4 text-primary" />
            </div>
            Novo Agendamento
          </DialogTitle>

          <DialogDescription>
            Agende um novo atendimento para um paciente da clínica.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} noValidate className="space-y-5 py-2">
          <div className="space-y-3">
            <div className="flex items-center gap-2">
              <UserRound className="h-4 w-4 text-primary" />

              <h3 className="text-sm font-semibold">Dados do paciente</h3>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <FormField
                label="Nome do Paciente"
                required
                error={errors.patientName}
              >
                <Input
                  placeholder="Ex: Maria Silva"
                  value={patientName}
                  onChange={(event) => {
                    setPatientName(event.target.value);

                    clearError("patientName");
                  }}
                  className={`h-10 ${
                    errors.patientName
                      ? "border-destructive focus-visible:ring-destructive"
                      : ""
                  }`}
                />
              </FormField>

              <FormField
                label="Telefone / WhatsApp"
                required
                error={errors.phone}
              >
                <div className="relative">
                  <Phone className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />

                  <Input
                    type="tel"
                    placeholder="(11) 99999-9999"
                    value={phone}
                    onChange={(event) => {
                      setPhone(event.target.value);

                      clearError("phone");
                    }}
                    className={`h-10 pl-9 ${
                      errors.phone
                        ? "border-destructive focus-visible:ring-destructive"
                        : ""
                    }`}
                  />
                </div>
              </FormField>
            </div>
          </div>

          <div className="space-y-3">
            <div className="flex items-center gap-2">
              <Stethoscope className="h-4 w-4 text-primary" />

              <h3 className="text-sm font-semibold">Atendimento</h3>
            </div>

            <FormField label="Procedimento" required error={errors.procedure}>
              <div className="relative">
                <select
                  value={procedure}
                  onChange={(event) => {
                    setProcedure(event.target.value);

                    clearError("procedure");
                  }}
                  className={`flex h-10 w-full appearance-none rounded-md border border-input bg-background px-3 py-2 text-sm shadow-sm outline-none transition-colors focus:ring-2 focus:ring-ring ${
                    errors.procedure
                      ? "border-destructive focus:ring-destructive"
                      : ""
                  } ${
                    !procedure ? "text-muted-foreground" : "text-foreground"
                  }`}
                >
                  <option value="" disabled>
                    Selecione um procedimento
                  </option>

                  {procedures.map((item) => (
                    <option key={item} value={item}>
                      {item}
                    </option>
                  ))}
                </select>

                <div className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground">
                  <svg
                    width="14"
                    height="14"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                  >
                    <path d="m6 9 6 6 6-6" />
                  </svg>
                </div>
              </div>
            </FormField>
          </div>

          <div className="space-y-3">
            <div className="flex items-center gap-2">
              <Clock3 className="h-4 w-4 text-primary" />

              <h3 className="text-sm font-semibold">Horário do atendimento</h3>
            </div>

            <div className="grid grid-cols-3 gap-3">
              <FormField label="Data" required error={errors.date}>
                <Input
                  type="date"
                  value={date}
                  onChange={(event) => {
                    setDate(event.target.value);

                    clearError("date");
                  }}
                  className={`h-10 ${
                    errors.date
                      ? "border-destructive focus-visible:ring-destructive"
                      : ""
                  }`}
                />
              </FormField>

              <FormField label="Horário" required error={errors.startTime}>
                <Input
                  type="time"
                  value={startTime}
                  onChange={(event) => {
                    setStartTime(event.target.value);

                    clearError("startTime");
                  }}
                  className={`h-10 ${
                    errors.startTime
                      ? "border-destructive focus-visible:ring-destructive"
                      : ""
                  }`}
                />
              </FormField>

              <FormField label="Duração" required error={errors.durationValue}>
                <div
                  className={`flex h-10 items-center rounded-md border border-input bg-background transition-colors focus-within:ring-2 focus-within:ring-ring ${
                    errors.durationValue
                      ? "border-destructive focus-within:ring-destructive"
                      : ""
                  }`}
                >
                  <Input
                    type="number"
                    min="1"
                    step="any"
                    placeholder="60"
                    value={durationValue}
                    onChange={(event) => {
                      setDurationValue(event.target.value);

                      clearError("durationValue");
                    }}
                    className="h-full border-0 bg-transparent px-3 shadow-none focus-visible:ring-0"
                  />

                  <div className="h-5 w-px shrink-0 bg-border" />

                  <select
                    value={durationUnit}
                    onChange={(event) =>
                      setDurationUnit(event.target.value as DurationUnit)
                    }
                    aria-label="Unidade da duração"
                    className="h-full cursor-pointer bg-transparent px-2.5 text-xs font-medium text-muted-foreground outline-none"
                  >
                    <option value="minutes">min</option>

                    <option value="hours">h</option>
                  </select>
                </div>
              </FormField>
            </div>
          </div>

          <FormField
            label="Observações"
            description="Informações adicionais sobre o atendimento."
          >
            <div className="relative">
              <FileText className="pointer-events-none absolute left-3 top-3 h-4 w-4 text-muted-foreground" />

              <Textarea
                rows={3}
                placeholder="Ex: paciente solicitou atendimento no período da tarde..."
                value={notes}
                onChange={(event) => setNotes(event.target.value)}
                className="resize-none pl-9"
              />
            </div>
          </FormField>

          <DialogFooter className="gap-2 pt-3">
            <Button type="button" variant="outline" onClick={onClose}>
              Cancelar
            </Button>

            <Button type="submit" className="min-w-[130px] gap-2">
              <Plus className="h-4 w-4" />
              Agendar
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
