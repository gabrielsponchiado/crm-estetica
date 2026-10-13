"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";

import { usePatients } from "@/hooks/usePatient";
import { useProcedures } from "@/hooks/useProcedures";

import type {
  Appointment,
  CreateAppointmentInput,
} from "@/types/appointment";

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

import { Calendar } from "@/components/ui/calendar";

import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

import { toast } from "@/components/ui/toast";

import {
  CalendarDays,
  Check,
  Clock3,
  FileText,
  Plus,
  Search,
  Stethoscope,
  UserRound,
  X,
} from "lucide-react";

interface NewAppointmentModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (
    appointment: CreateAppointmentInput,
  ) => Promise<{ success: boolean; error?: string }>;
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

function parseLocalDate(value: string) {
  const [year, month, day] = value.split("-").map(Number);

  if (!year || !month || !day) {
    return undefined;
  }

  return new Date(year, month - 1, day);
}

function toDateInputValue(date: Date) {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");

  return `${year}-${month}-${day}`;
}

function generateTimeOptions() {
  const options: string[] = [];

  for (let hour = 0; hour < 24; hour += 1) {
    for (let minute = 0; minute < 60; minute += 15) {
      options.push(
        `${String(hour).padStart(2, "0")}:${String(minute).padStart(2, "0")}`,
      );
    }
  }

  return options;
}

const TIME_OPTIONS = generateTimeOptions();

export function NewAppointmentModal({
  isOpen,
  onClose,
  onSave,
  initialDate,
  appointment,
}: NewAppointmentModalProps) {
  const isEditing = !!appointment;

  const {
    patients: patientsFromHook,
    loading: loadingPatients,
  } = usePatients(500);

  const {
    procedures: proceduresFromHook,
    loading: loadingProcedures,
  } = useProcedures();

  /*
   * Proteção para garantir que o modal nunca tente
   * executar .map() em undefined.
   */
  const patients = Array.isArray(patientsFromHook)
    ? patientsFromHook
    : [];

  const procedures = Array.isArray(proceduresFromHook)
    ? proceduresFromHook
    : [];

  const procedureItems = useMemo(
    () =>
      procedures.map((procedure) => ({
        value: procedure.id,
        label: procedure.name,
      })),
    [procedures],
  );

  const timeItems = useMemo(
    () =>
      TIME_OPTIONS.map((time) => ({
        value: time,
        label: time,
      })),
    [],
  );

  // ------------------------------------------------------------
  // Paciente
  // ------------------------------------------------------------

  const [patientId, setPatientId] = useState("");
  const [patientSearch, setPatientSearch] = useState("");
  const [showPatientDropdown, setShowPatientDropdown] =
    useState(false);

  const patientRef = useRef<HTMLDivElement>(null);

  // ------------------------------------------------------------
  // Formulário
  // ------------------------------------------------------------

  const [procedureId, setProcedureId] = useState("");

  const [date, setDate] = useState(
    initialDate || getTodayDate(),
  );

  const [startTime, setStartTime] = useState("09:00");

  const [durationValue, setDurationValue] =
    useState("60");

  const [notes, setNotes] = useState("");

  const [errors, setErrors] =
    useState<AppointmentFormErrors>({});

  const [isSaving, setIsSaving] = useState(false);

  const [isCalendarOpen, setIsCalendarOpen] =
    useState(false);

  // ------------------------------------------------------------
  // Data selecionada para o Calendar
  // ------------------------------------------------------------

  const selectedDate = useMemo(
    () => parseLocalDate(date),
    [date],
  );

  // ------------------------------------------------------------
  // Reset quando abre o modal
  // ------------------------------------------------------------

  useEffect(() => {
    if (!isOpen) {
      return;
    }

    const ap = appointment;

    setPatientId(ap?.patientId || "");

    const currentPatient = patients.find(
      (patient) => patient.id === ap?.patientId,
    );

    setPatientSearch(currentPatient?.name || "");

    setProcedureId(ap?.procedureId || "");

    setDate(
      ap?.date ||
        initialDate ||
        getTodayDate(),
    );

    setStartTime(
      ap?.startTime || "09:00",
    );

    setDurationValue(
      String(ap?.durationMinutes || 60),
    );

    setNotes(ap?.notes || "");

    setErrors({});
    setShowPatientDropdown(false);
    setIsCalendarOpen(false);
  }, [
    isOpen,
    initialDate,
    appointment,
    patients,
  ]);

  // ------------------------------------------------------------
  // Fecha dropdown do paciente ao clicar fora
  // ------------------------------------------------------------

  useEffect(() => {
    const handleOutside = (event: MouseEvent) => {
      if (
        patientRef.current &&
        !patientRef.current.contains(
          event.target as Node,
        )
      ) {
        setShowPatientDropdown(false);
      }
    };

    document.addEventListener(
      "mousedown",
      handleOutside,
    );

    return () => {
      document.removeEventListener(
        "mousedown",
        handleOutside,
      );
    };
  }, []);

  // ------------------------------------------------------------
  // Pacientes filtrados
  // ------------------------------------------------------------

  const filteredPatients =
    patientSearch.trim().length >= 1
      ? patients.filter(
          (patient) =>
            patient.name
              .toLowerCase()
              .includes(
                patientSearch.toLowerCase(),
              ) ||
            (patient.phone &&
              patient.phone.includes(
                patientSearch,
              )),
        )
      : [];

  const selectedPatientName = patients.find(
    (patient) => patient.id === patientId,
  )?.name;

  // ------------------------------------------------------------
  // Helpers
  // ------------------------------------------------------------

  const clearError = (
    field: keyof AppointmentFormErrors,
  ) => {
    if (!errors[field]) {
      return;
    }

    setErrors((previous) => ({
      ...previous,
      [field]: undefined,
    }));
  };

  // ------------------------------------------------------------
  // Seleção da data
  // ------------------------------------------------------------

  const handleSelectDate = (
    selected: Date | undefined,
  ) => {
    if (!selected) {
      return;
    }

    setDate(toDateInputValue(selected));
    clearError("date");
    setIsCalendarOpen(false);
  };

  // ------------------------------------------------------------
  // Paciente
  // ------------------------------------------------------------

  const handleSelectPatient = (
    id: string,
    name: string,
  ) => {
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

  // ------------------------------------------------------------
  // Validação
  // ------------------------------------------------------------

  const validateForm = () => {
    const newErrors: AppointmentFormErrors = {};

    if (!patientId) {
      newErrors.patientId =
        "Selecione um paciente.";
    }

    if (!procedureId) {
      newErrors.procedureId =
        "Selecione um procedimento.";
    }

    if (!date) {
      newErrors.date =
        "Informe a data do atendimento.";
    }

    if (!startTime) {
      newErrors.startTime =
        "Informe o horário do atendimento.";
    }

    const parsedDuration =
      Number(durationValue);

    if (
      !durationValue ||
      Number.isNaN(parsedDuration) ||
      !Number.isInteger(parsedDuration) ||
      parsedDuration < 1 ||
      parsedDuration > 1440
    ) {
      newErrors.durationValue =
        "Informe uma duração entre 1 e 1440 minutos.";
    }

    setErrors(newErrors);

    return (
      Object.keys(newErrors).length === 0
    );
  };

  // ------------------------------------------------------------
  // Submit
  // ------------------------------------------------------------

  const handleSubmit = async (
    event: React.FormEvent<HTMLFormElement>,
  ) => {
    event.preventDefault();

    if (!validateForm()) {
      return;
    }

    const payload: CreateAppointmentInput = {
      patientId,
      procedureId,
      date,
      startTime,
      durationMinutes: Math.round(
        Number(durationValue),
      ),
      notes: notes.trim() || undefined,
    };

    setIsSaving(true);

    const result = await onSave(payload);

    setIsSaving(false);

    if (!result.success) {
      toast.add({
        title: isEditing
          ? "Não foi possível atualizar o agendamento."
          : "Não foi possível criar o agendamento.",
        description:
          result.error ||
          "Ocorreu um erro ao salvar o agendamento.",
        type: "error",
      });

      return;
    }

    onClose();
  };

  // ------------------------------------------------------------
  // Render
  // ------------------------------------------------------------

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

            {isEditing
              ? "Editar Agendamento"
              : "Novo Agendamento"}
          </DialogTitle>

          <DialogDescription>
            {isEditing
              ? "Atualize os dados do atendimento."
              : "Agende um novo atendimento para um paciente da clínica."}
          </DialogDescription>
        </DialogHeader>

        <form
          onSubmit={handleSubmit}
          noValidate
          className="space-y-5 py-2"
        >
          {/* ================================================== */}
          {/* PACIENTE */}
          {/* ================================================== */}

          <div className="space-y-3">
            <div className="flex items-center gap-2">
              <UserRound className="h-4 w-4 text-primary" />

              <h3 className="text-sm font-semibold">
                Paciente
              </h3>
            </div>

            <FormField
              label="Paciente"
              required
              error={errors.patientId}
            >
              <div
                ref={patientRef}
                className="relative"
              >
                <div
                  className={`flex h-10 items-center rounded-md border bg-background px-3 shadow-sm transition-shadow focus-within:ring-2 ${
                    errors.patientId
                      ? "border-destructive focus-within:ring-destructive"
                      : "border-input focus-within:ring-ring"
                  }`}
                >
                  <Search className="mr-2 h-4 w-4 shrink-0 text-muted-foreground" />

                  <input
                    type="text"
                    value={patientSearch}
                    onChange={(event) => {
                      setPatientSearch(
                        event.target.value,
                      );

                      setShowPatientDropdown(true);

                      if (
                        !event.target.value
                      ) {
                        setPatientId("");
                      }

                      clearError("patientId");
                    }}
                    onFocus={() => {
                      if (
                        patientSearch
                          .trim()
                          .length >= 1
                      ) {
                        setShowPatientDropdown(
                          true,
                        );
                      }
                    }}
                    placeholder={
                      loadingPatients
                        ? "Carregando pacientes..."
                        : "Digite o nome do paciente..."
                    }
                    disabled={loadingPatients}
                    className="flex-1 bg-transparent text-sm outline-none placeholder:text-muted-foreground disabled:cursor-not-allowed"
                    autoComplete="off"
                  />

                  {patientId && (
                    <button
                      type="button"
                      onClick={
                        handleClearPatient
                      }
                      className="ml-1 flex h-5 w-5 items-center justify-center rounded-full text-muted-foreground hover:bg-muted hover:text-foreground"
                      title="Remover paciente"
                    >
                      <X className="h-3.5 w-3.5" />
                    </button>
                  )}
                </div>

                {patientId &&
                  selectedPatientName && (
                    <div className="mt-1.5 flex items-center gap-1.5 text-xs text-emerald-600">
                      <Check className="h-3.5 w-3.5" />

                      <span className="font-medium">
                        {selectedPatientName}{" "}
                        selecionado
                      </span>
                    </div>
                  )}

                {showPatientDropdown &&
                  patientSearch.trim().length >=
                    1 && (
                    <div className="absolute left-0 right-0 top-[calc(100%+4px)] z-50 max-h-56 overflow-auto rounded-lg border border-border bg-background shadow-lg">
                      {filteredPatients.length ===
                      0 ? (
                        <div className="flex flex-col items-center gap-1 py-6 text-center">
                          <UserRound className="h-5 w-5 text-muted-foreground/50" />

                          <p className="text-sm text-muted-foreground">
                            Nenhum paciente encontrado
                            para{" "}
                            <span className="font-medium">
                              "{patientSearch}"
                            </span>
                          </p>
                        </div>
                      ) : (
                        filteredPatients
                          .slice(0, 8)
                          .map((patient) => (
                            <button
                              key={patient.id}
                              type="button"
                              onMouseDown={(
                                event,
                              ) => {
                                event.preventDefault();

                                handleSelectPatient(
                                  patient.id,
                                  patient.name,
                                );
                              }}
                              className={`flex w-full items-center gap-3 px-3 py-2.5 text-left text-sm transition-colors hover:bg-muted/60 ${
                                patientId ===
                                patient.id
                                  ? "bg-primary/5"
                                  : ""
                              }`}
                            >
                              <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-primary/10 text-[10px] font-bold text-primary">
                                {patient.name
                                  .trim()
                                  .substring(
                                    0,
                                    2,
                                  )
                                  .toUpperCase()}
                              </div>

                              <div className="min-w-0 flex-1">
                                <p className="truncate font-medium text-foreground">
                                  {patient.name}
                                </p>

                                {patient.phone && (
                                  <p className="text-xs text-muted-foreground">
                                    {patient.phone}
                                  </p>
                                )}
                              </div>

                              {patientId ===
                                patient.id && (
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

          {/* ================================================== */}
          {/* ATENDIMENTO */}
          {/* ================================================== */}

          <div className="space-y-3">
            <div className="flex items-center gap-2">
              <Stethoscope className="h-4 w-4 text-primary" />

              <h3 className="text-sm font-semibold">
                Atendimento
              </h3>
            </div>

            <FormField
              label="Procedimento"
              required
              error={errors.procedureId}
            >
              <Select
                items={procedureItems}
                value={procedureId || null}
                onValueChange={(value) => {
                  if (!value) {
                    return;
                  }

                  setProcedureId(value);

                  clearError("procedureId");

                  const procedure =
                    procedures.find(
                      (item) =>
                        item.id === value,
                    );

                  if (
                    procedure &&
                    !isEditing
                  ) {
                    setDurationValue(
                      String(
                        procedure.durationMinutes,
                      ),
                    );
                  }
                }}
                disabled={loadingProcedures}
              >
                <SelectTrigger
                  className={`h-10 w-full min-w-0 px-3 text-sm ${
                    errors.procedureId
                      ? "border-destructive focus:ring-destructive"
                      : ""
                  }`}
                >
                  <SelectValue
                    placeholder={
                      loadingProcedures
                        ? "Carregando procedimentos..."
                        : "Selecione um procedimento"
                    }
                  />
                </SelectTrigger>

                <SelectContent
                  side="bottom"
                  align="start"
                  sideOffset={6}
                  alignItemWithTrigger={false}
                  className="w-(--anchor-width)"
                >
                  {procedureItems.map(
                    (item) => (
                      <SelectItem
                        key={item.value}
                        value={item.value}
                        className="py-2"
                      >
                        {item.label}
                      </SelectItem>
                    ),
                  )}
                </SelectContent>
              </Select>
            </FormField>
          </div>

          {/* ================================================== */}
          {/* HORÁRIO */}
          {/* ================================================== */}

          <div className="space-y-3">
            <div className="flex items-center gap-2">
              <Clock3 className="h-4 w-4 text-primary" />

              <h3 className="text-sm font-semibold">
                Horário do atendimento
              </h3>
            </div>

            <div className="grid w-full grid-cols-3 gap-3">
              {/* ------------------------------------------------ */}
              {/* DATA — SHADCN CALENDAR */}
              {/* ------------------------------------------------ */}

              <FormField
                label="Data"
                required
                error={errors.date}
              >
                <Popover
                  open={isCalendarOpen}
                  onOpenChange={setIsCalendarOpen}
                >
                  <PopoverTrigger
                    render={
                      <Button
                        type="button"
                        variant="outline"
                        className={`h-10 w-full min-w-0 justify-start px-3 text-left font-normal ${
                          errors.date
                            ? "border-destructive focus-visible:ring-destructive"
                            : ""
                        }`}
                      />
                    }
                  >
                    <CalendarDays className="mr-2 h-4 w-4 shrink-0 text-muted-foreground" />

                    <span className="truncate">
                      {selectedDate
                        ? format(
                            selectedDate,
                            "dd/MM/yyyy",
                            {
                              locale: ptBR,
                            },
                          )
                        : "Selecione a data"}
                    </span>
                  </PopoverTrigger>

                  <PopoverContent
                    className="w-auto p-0"
                    align="start"
                    sideOffset={6}
                  >
                    <Calendar
                      mode="single"
                      selected={selectedDate}
                      onSelect={handleSelectDate}
                      locale={ptBR}
                      captionLayout="label"
                    />
                  </PopoverContent>
                </Popover>
              </FormField>

              {/* ------------------------------------------------ */}
              {/* HORÁRIO */}
              {/* ------------------------------------------------ */}

              <FormField
                label="Horário"
                required
                error={errors.startTime}
              >
                <Select
                  items={timeItems}
                  value={startTime || null}
                  onValueChange={(value) => {
                    if (!value) {
                      return;
                    }

                    setStartTime(value);
                    clearError("startTime");
                  }}
                >
                  <SelectTrigger
                    className={`h-10 w-full min-w-0 px-3 text-sm ${
                      errors.startTime
                        ? "border-destructive focus:ring-destructive"
                        : ""
                    }`}
                  >
                    <div className="flex min-w-0 w-full flex-1 items-center gap-2 overflow-hidden">
                      <Clock3 className="h-4 w-4 shrink-0 text-muted-foreground" />

                      <SelectValue placeholder="09:00" />
                    </div>
                  </SelectTrigger>

                  <SelectContent
                    side="bottom"
                    align="start"
                    sideOffset={6}
                    alignItemWithTrigger={false}
                    className="max-h-64 w-(--anchor-width)"
                  >
                    {timeItems.map(
                      (item) => (
                        <SelectItem
                          key={item.value}
                          value={item.value}
                          className="py-2"
                        >
                          {item.label}
                        </SelectItem>
                      ),
                    )}
                  </SelectContent>
                </Select>
              </FormField>

              {/* ------------------------------------------------ */}
              {/* DURAÇÃO */}
              {/* ------------------------------------------------ */}

              <FormField
                label="Duração (min)"
                required
                error={errors.durationValue}
              >
                <Input
                  type="number"
                  min="1"
                  max="1440"
                  step="1"
                  placeholder="60"
                  value={durationValue}
                  onChange={(event) => {
                    setDurationValue(
                      event.target.value,
                    );

                    clearError(
                      "durationValue",
                    );
                  }}
                  className={`h-10 w-full min-w-0 ${
                    errors.durationValue
                      ? "border-destructive focus-visible:ring-destructive"
                      : ""
                  }`}
                />
              </FormField>
            </div>
          </div>

          {/* ================================================== */}
          {/* OBSERVAÇÕES */}
          {/* ================================================== */}

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
                onChange={(event) =>
                  setNotes(event.target.value)
                }
                className="resize-none pl-9"
              />
            </div>
          </FormField>

          {/* ================================================== */}
          {/* BOTÕES */}
          {/* ================================================== */}

          <DialogFooter className="gap-2 pt-3">
            <Button
              type="button"
              variant="outline"
              onClick={onClose}
              disabled={isSaving}
            >
              Cancelar
            </Button>

            <Button
              type="submit"
              className="min-w-[130px] gap-2"
              disabled={isSaving}
            >
              <Plus className="h-4 w-4" />

              {isSaving
                ? "Salvando..."
                : isEditing
                  ? "Salvar"
                  : "Agendar"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}