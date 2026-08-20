"use client";

import { useEffect, useRef, useState } from "react";

import { usePatients } from "@/hooks/usePatient";
import { useProcedures } from "@/hooks/useProcedures";
import type { Appointment, CreateAppointmentInput } from "@/types/appointment";

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

import { CalendarDays, Check, Clock3, FileText, Plus, Search, Stethoscope, UserRound, X } from "lucide-react";

interface NewAppointmentModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (appointment: CreateAppointmentInput) => Promise<{ success: boolean; error?: string }>;
  initialDate?: string;
  appointment?: Appointment | null;
}

interface AppointmentFormErrors {
  patientId?: string;
  procedureId?: string;
  date?: string;
  startTime?: string;
  durationValue?: string;
}

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
  appointment,
}: NewAppointmentModalProps) {
  const isEditing = !!appointment;

  const { patients, loading: loadingPatients } = usePatients(500);
  const { procedures, loading: loadingProcedures } = useProcedures();

  // --- Patient autocomplete state ---
  const [patientId, setPatientId] = useState("");
  const [patientSearch, setPatientSearch] = useState("");
  const [showPatientDropdown, setShowPatientDropdown] = useState(false);
  const patientRef = useRef<HTMLDivElement>(null);

  // --- Other form state ---
  const [procedureId, setProcedureId] = useState("");
  const [date, setDate] = useState(initialDate || getTodayDate());
  const [startTime, setStartTime] = useState("09:00");
  const [durationValue, setDurationValue] = useState("60");
  const [notes, setNotes] = useState("");
  const [errors, setErrors] = useState<AppointmentFormErrors>({});
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [isSaving, setIsSaving] = useState(false);

  // Reset form when modal opens
  useEffect(() => {
    if (!isOpen) return;

    const ap = appointment;
    setPatientId(ap?.patientId || "");
    // Pre-fill search field with current patient name in edit mode
    const currentPatient = patients.find((p) => p.id === ap?.patientId);
    setPatientSearch(currentPatient?.name || "");
    setProcedureId(ap?.procedureId || "");
    setDate(ap?.date || initialDate || getTodayDate());
    setStartTime(ap?.startTime || "09:00");
    setDurationValue(String(ap?.durationMinutes || 60));
    setNotes(ap?.notes || "");
    setErrors({});
    setSubmitError(null);
  }, [isOpen, initialDate, appointment]); // eslint-disable-line react-hooks/exhaustive-deps

  // Close dropdown on outside click
  useEffect(() => {
    const handleOutside = (e: MouseEvent) => {
      if (patientRef.current && !patientRef.current.contains(e.target as Node)) {
        setShowPatientDropdown(false);
      }
    };
    document.addEventListener("mousedown", handleOutside);
    return () => document.removeEventListener("mousedown", handleOutside);
  }, []);

  // Filtered patient list based on search text
  const filteredPatients = patientSearch.trim().length >= 1
    ? patients.filter((p) =>
        p.name.toLowerCase().includes(patientSearch.toLowerCase()) ||
        (p.phone && p.phone.includes(patientSearch))
      )
    : [];

  const selectedPatientName = patients.find((p) => p.id === patientId)?.name;

  const handleSelectPatient = (id: string, name: string) => {
    setPatientId(id);
    setPatientSearch(name);
    setShowPatientDropdown(false);
    clearError("patientId");
  };

  const handleClearPatient = () => {
    setPatientId("");
    setPatientSearch("");
    setShowPatientDropdown(false);
  };

  const clearError = (field: keyof AppointmentFormErrors) => {
    if (!errors[field]) return;
    setErrors((previous) => ({ ...previous, [field]: undefined }));
  };

  const validateForm = () => {
    const newErrors: AppointmentFormErrors = {};

    if (!patientId) newErrors.patientId = "Selecione um paciente.";
    if (!procedureId) newErrors.procedureId = "Selecione um procedimento.";
    if (!date) newErrors.date = "Informe a data do atendimento.";
    if (!startTime) newErrors.startTime = "Informe o horário do atendimento.";

    const parsedDuration = Number(durationValue);
    if (!durationValue || Number.isNaN(parsedDuration) || parsedDuration <= 0) {
      newErrors.durationValue = "Informe uma duração válida.";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setSubmitError(null);

    if (!validateForm()) return;

    const payload: CreateAppointmentInput = {
      patientId,
      procedureId,
      date,
      startTime,
      durationMinutes: Math.round(Number(durationValue)),
      notes: notes.trim() || undefined,
    };

    setIsSaving(true);
    const result = await onSave(payload);
    setIsSaving(false);

    if (!result.success) {
      setSubmitError(result.error || "Não foi possível salvar o agendamento.");
      return;
    }

    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={(open) => { if (!open) onClose(); }}>
      <DialogContent className="sm:max-w-[560px]">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 text-xl font-bold">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary/10">
              <CalendarDays className="h-4 w-4 text-primary" />
            </div>
            {isEditing ? "Editar Agendamento" : "Novo Agendamento"}
          </DialogTitle>
          <DialogDescription>
            {isEditing ? "Atualize os dados do atendimento." : "Agende um novo atendimento para um paciente da clínica."}
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} noValidate className="space-y-5 py-2">
          {/* ── Paciente ── */}
          <div className="space-y-3">
            <div className="flex items-center gap-2">
              <UserRound className="h-4 w-4 text-primary" />
              <h3 className="text-sm font-semibold">Paciente</h3>
            </div>

            <FormField label="Paciente" required error={errors.patientId}>
              <div ref={patientRef} className="relative">
                {/* Search input */}
                <div className={`flex h-10 items-center rounded-md border bg-background px-3 shadow-sm transition-shadow focus-within:ring-2 ${
                  errors.patientId
                    ? "border-destructive focus-within:ring-destructive"
                    : "border-input focus-within:ring-ring"
                }`}>
                  <Search className="mr-2 h-4 w-4 shrink-0 text-muted-foreground" />
                  <input
                    type="text"
                    value={patientSearch}
                    onChange={(e) => {
                      setPatientSearch(e.target.value);
                      setShowPatientDropdown(true);
                      if (!e.target.value) setPatientId("");
                      clearError("patientId");
                    }}
                    onFocus={() => { if (patientSearch.trim().length >= 1) setShowPatientDropdown(true); }}
                    placeholder={loadingPatients ? "Carregando pacientes..." : "Digite o nome do paciente..."}
                    disabled={loadingPatients}
                    className="flex-1 bg-transparent text-sm outline-none placeholder:text-muted-foreground disabled:cursor-not-allowed"
                    autoComplete="off"
                  />
                  {/* Check mark when patient is selected */}
                  {patientId && (
                    <button
                      type="button"
                      onClick={handleClearPatient}
                      className="ml-1 flex h-5 w-5 items-center justify-center rounded-full text-muted-foreground hover:bg-muted hover:text-foreground"
                      title="Remover paciente"
                    >
                      <X className="h-3.5 w-3.5" />
                    </button>
                  )}
                </div>

                {/* Selected patient indicator */}
                {patientId && selectedPatientName && (
                  <div className="mt-1.5 flex items-center gap-1.5 text-xs text-emerald-600">
                    <Check className="h-3.5 w-3.5" />
                    <span className="font-medium">{selectedPatientName} selecionado</span>
                  </div>
                )}

                {/* Dropdown */}
                {showPatientDropdown && patientSearch.trim().length >= 1 && (
                  <div className="absolute left-0 right-0 top-[calc(100%+4px)] z-50 max-h-56 overflow-auto rounded-lg border border-border bg-background shadow-lg">
                    {filteredPatients.length === 0 ? (
                      <div className="flex flex-col items-center gap-1 py-6 text-center">
                        <UserRound className="h-5 w-5 text-muted-foreground/50" />
                        <p className="text-sm text-muted-foreground">
                          Nenhum paciente encontrado para{" "}
                          <span className="font-medium">"{patientSearch}"</span>
                        </p>
                      </div>
                    ) : (
                      filteredPatients.slice(0, 8).map((patient) => (
                        <button
                          key={patient.id}
                          type="button"
                          onMouseDown={(e) => {
                            // prevent blur from firing before click
                            e.preventDefault();
                            handleSelectPatient(patient.id, patient.name);
                          }}
                          className={`flex w-full items-center gap-3 px-3 py-2.5 text-left text-sm transition-colors hover:bg-muted/60 ${
                            patientId === patient.id ? "bg-primary/5" : ""
                          }`}
                        >
                          <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-primary/10 text-[10px] font-bold text-primary">
                            {patient.name.trim().substring(0, 2).toUpperCase()}
                          </div>
                          <div className="min-w-0 flex-1">
                            <p className="truncate font-medium text-foreground">{patient.name}</p>
                            {patient.phone && (
                              <p className="text-xs text-muted-foreground">{patient.phone}</p>
                            )}
                          </div>
                          {patientId === patient.id && (
                            <Check className="h-4 w-4 shrink-0 text-primary" />
                          )}
                        </button>
                      ))
                    )}
                  </div>
                )}
              </div>
            </FormField>
          </div>

          {/* ── Atendimento ── */}
          <div className="space-y-3">
            <div className="flex items-center gap-2">
              <Stethoscope className="h-4 w-4 text-primary" />
              <h3 className="text-sm font-semibold">Atendimento</h3>
            </div>

            <FormField label="Procedimento" required error={errors.procedureId}>
              <select
                value={procedureId}
                onChange={(event) => {
                  const value = event.target.value;
                  setProcedureId(value);
                  clearError("procedureId");

                  const procedure = procedures.find((item) => item.id === value);
                  if (procedure && !isEditing) {
                    setDurationValue(String(procedure.durationMinutes));
                  }
                }}
                disabled={loadingProcedures}
                className={`flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm shadow-sm outline-none focus:ring-2 focus:ring-ring ${
                  errors.procedureId ? "border-destructive focus:ring-destructive" : ""
                }`}
              >
                <option value="" disabled>
                  {loadingProcedures ? "Carregando procedimentos..." : "Selecione um procedimento"}
                </option>
                {procedures.map((procedure) => (
                  <option key={procedure.id} value={procedure.id}>
                    {procedure.name}
                  </option>
                ))}
              </select>
            </FormField>
          </div>

          {/* ── Horário ── */}
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
                  onChange={(event) => { setDate(event.target.value); clearError("date"); }}
                  className={`h-10 ${errors.date ? "border-destructive focus-visible:ring-destructive" : ""}`}
                />
              </FormField>

              <FormField label="Horário" required error={errors.startTime}>
                <Input
                  type="time"
                  value={startTime}
                  onChange={(event) => { setStartTime(event.target.value); clearError("startTime"); }}
                  className={`h-10 ${errors.startTime ? "border-destructive focus-visible:ring-destructive" : ""}`}
                />
              </FormField>

              <FormField label="Duração (min)" required error={errors.durationValue}>
                <Input
                  type="number"
                  min="1"
                  step="1"
                  placeholder="60"
                  value={durationValue}
                  onChange={(event) => { setDurationValue(event.target.value); clearError("durationValue"); }}
                  className={`h-10 ${errors.durationValue ? "border-destructive focus-visible:ring-destructive" : ""}`}
                />
              </FormField>
            </div>
          </div>

          {/* ── Observações ── */}
          <FormField label="Observações" description="Informações adicionais sobre o atendimento.">
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

          {submitError && (
            <p className="rounded-md bg-destructive/10 px-3 py-2 text-sm text-destructive">{submitError}</p>
          )}

          <DialogFooter className="gap-2 pt-3">
            <Button type="button" variant="outline" onClick={onClose} disabled={isSaving}>
              Cancelar
            </Button>
            <Button type="submit" className="min-w-[130px] gap-2" disabled={isSaving}>
              <Plus className="h-4 w-4" />
              {isSaving ? "Salvando..." : isEditing ? "Salvar" : "Agendar"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}