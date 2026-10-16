'use client';

import { useState, type FormEvent } from 'react';
import {
  Calendar as CalendarIcon,
  Clock,
  Pencil,
  Plus,
  Sparkles,
} from 'lucide-react';
import { ptBR } from 'date-fns/locale';

import { fetcher } from '@/lib/api';

import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';

import { Calendar } from '@/components/ui/calendar';

import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';

type Procedure = {
  id: string;
  name: string;
  price?: number | string;
};

type PatientProcedure = {
  id: string;
  patientId: string;
  procedureId: string;
  performedAt: string;
  nextReturnAt?: string | null;
  procedure?: Procedure;
};

type Patient = {
  id: string;
  procedures?: PatientProcedure[];
};

type PatientProceduresProps = {
  patient: Patient;
  procedureCatalog: Procedure[];
  onNewAppointment: () => void;
  onRefresh: () => Promise<void>;
};

function parseDateInput(value?: string | null) {
  if (!value) {
    return undefined;
  }

  const [year, month, day] = value.split('-').map(Number);

  if (!year || !month || !day) {
    return undefined;
  }

  return new Date(year, month - 1, day);
}

function formatDateInput(date?: Date) {
  if (!date) {
    return '';
  }

  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');

  return `${year}-${month}-${day}`;
}

function toISOStringFromDateInput(value: string) {
  return new Date(`${value}T12:00:00`).toISOString();
}

function formatDateDisplay(value?: string | null) {
  if (!value) {
    return 'Selecione uma data';
  }

  const date = parseDateInput(value);

  if (!date) {
    return 'Selecione uma data';
  }

  return date.toLocaleDateString('pt-BR');
}

export function PatientProcedures({
  patient,
  procedureCatalog,
  onNewAppointment,
  onRefresh,
}: PatientProceduresProps) {
  const [showForm, setShowForm] = useState(false);

  const [editingProcedure, setEditingProcedure] =
    useState<PatientProcedure | null>(null);

  const [procedureId, setProcedureId] = useState('');
  const [performedAt, setPerformedAt] = useState('');
  const [nextReturnAt, setNextReturnAt] = useState('');

  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');

  /*
   * O Select do projeto usa Base UI.
   * Por isso precisamos fornecer os items com value + label.
   *
   * value:
   *   ID enviado para a API.
   *
   * label:
   *   nome mostrado para o usuário.
   */
  const procedureItems = procedureCatalog.map((procedure) => ({
    value: procedure.id,
    label: procedure.name,
  }));

  function resetForm() {
    setProcedureId('');
    setPerformedAt('');
    setNextReturnAt('');
    setEditingProcedure(null);
    setError('');
  }

  function openCreateForm() {
    resetForm();
    setShowForm(true);
  }

  function openEditForm(procedure: PatientProcedure) {
    setEditingProcedure(procedure);

    setProcedureId(procedure.procedureId);

    setPerformedAt(
      formatDateInput(new Date(procedure.performedAt)),
    );

    setNextReturnAt(
      procedure.nextReturnAt
        ? formatDateInput(new Date(procedure.nextReturnAt))
        : '',
    );

    setError('');
    setShowForm(true);
  }

  function handleOpenChange(open: boolean) {
    if (saving) {
      return;
    }

    setShowForm(open);

    if (!open) {
      resetForm();
    }
  }

  async function handleSubmit(
    event: FormEvent<HTMLFormElement>,
  ) {
    event.preventDefault();

    setError('');

    if (!procedureId) {
      setError('Selecione um procedimento.');
      return;
    }

    if (!performedAt) {
      setError('Informe a data da realização.');
      return;
    }

    setSaving(true);

    try {
      const payload = {
        procedureId,
        performedAt: toISOStringFromDateInput(performedAt),
        nextReturnAt: nextReturnAt
          ? toISOStringFromDateInput(nextReturnAt)
          : null,
      };

      if (editingProcedure) {
        await fetcher(
          `/patients/${patient.id}/procedures/${editingProcedure.id}`,
          {
            method: 'PATCH',
            body: JSON.stringify(payload),
          },
        );
      } else {
        await fetcher(
          `/patients/${patient.id}/procedures`,
          {
            method: 'POST',
            body: JSON.stringify(payload),
          },
        );
      }

      await onRefresh();

      setShowForm(false);
      resetForm();
    } catch (err: unknown) {
      setError(
        err instanceof Error
          ? err.message
          : 'Não foi possível salvar o procedimento.',
      );
    } finally {
      setSaving(false);
    }
  }

  const procedures = patient.procedures ?? [];

  return (
    <>
      <div className="p-6">
        <div className="mb-6 flex items-center justify-between gap-4">
          <div>
            <h3 className="text-base font-semibold text-foreground">
              Procedimentos Realizados
            </h3>

            <p className="mt-0.5 text-sm text-muted-foreground">
              Histórico de sessões e tratamentos estéticos aplicados.
            </p>
          </div>

          <div className="flex items-center gap-2">
            <Button
              size="sm"
              variant="outline"
              className="gap-2"
              onClick={openCreateForm}
            >
              <Plus className="h-4 w-4" />
              Registrar procedimento
            </Button>

            <Button
              size="sm"
              className="gap-2"
              onClick={onNewAppointment}
            >
              <Plus className="h-4 w-4" />
              Agendar Procedimento
            </Button>
          </div>
        </div>

        {procedures.length > 0 ? (
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {procedures.map((pp) => (
              <div
                key={pp.id}
                className="rounded-xl border bg-background p-4"
              >
                <div className="flex items-start justify-between gap-3">
                  <p className="text-sm font-semibold text-foreground">
                    {pp.procedure?.name || 'Procedimento'}
                  </p>

                  <Button
                    type="button"
                    variant="ghost"
                    size="icon"
                    className="h-8 w-8 shrink-0"
                    onClick={() => openEditForm(pp)}
                  >
                    <Pencil className="h-4 w-4" />
                  </Button>
                </div>

                <div className="mt-3 space-y-1.5">
                  <p className="flex items-center gap-2 text-xs text-muted-foreground">
                    <Clock className="h-3.5 w-3.5 shrink-0" />

                    Realizado em:{' '}
                    {new Date(
                      pp.performedAt,
                    ).toLocaleDateString('pt-BR')}
                  </p>

                  {pp.nextReturnAt && (
                    <p className="flex items-center gap-2 text-xs font-medium text-orange-500">
                      <CalendarIcon className="h-3.5 w-3.5 shrink-0" />

                      Retorno:{' '}
                      {new Date(
                        pp.nextReturnAt,
                      ).toLocaleDateString('pt-BR')}
                    </p>
                  )}
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="rounded-xl border border-dashed bg-muted/20 py-16 text-center text-muted-foreground">
            <Sparkles className="mx-auto mb-3 h-10 w-10 opacity-40" />

            <p className="font-medium">
              Nenhum procedimento registrado
            </p>

            <p className="mt-1 text-xs opacity-70">
              Registre o primeiro procedimento realizado.
            </p>

            <Button
              size="sm"
              variant="outline"
              className="mt-4 gap-2"
              onClick={openCreateForm}
            >
              <Plus className="h-4 w-4" />
              Registrar procedimento
            </Button>
          </div>
        )}
      </div>

      <Dialog
        open={showForm}
        onOpenChange={handleOpenChange}
      >
        <DialogContent className="sm:max-w-[480px]">
          <DialogHeader>
            <DialogTitle>
              {editingProcedure
                ? 'Editar procedimento'
                : 'Registrar procedimento'}
            </DialogTitle>

            <DialogDescription>
              Informe os dados do procedimento realizado.
            </DialogDescription>
          </DialogHeader>

          <form
            onSubmit={handleSubmit}
            className="space-y-5 py-4"
          >
            {/* PROCEDIMENTO */}

            <div className="space-y-2">
              <Label>Procedimento</Label>

              <Select
                items={procedureItems}
                value={procedureId || null}
                onValueChange={(value) => {
                  if (!value) {
                    return;
                  }

                  setProcedureId(value);
                  setError('');
                }}
              >
                <SelectTrigger className="h-10 w-full">
                  <SelectValue placeholder="Selecione um procedimento" />
                </SelectTrigger>

                <SelectContent
                  side="bottom"
                  align="start"
                  sideOffset={6}
                  alignItemWithTrigger={false}
                  className="w-(--anchor-width)"
                >
                  {procedureItems.map((item) => (
                    <SelectItem
                      key={item.value}
                      value={item.value}
                    >
                      {item.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* DATA DA REALIZAÇÃO */}

            <div className="space-y-2">
              <Label>Data da realização</Label>

              <Popover>
                <PopoverTrigger
                  render={
                    <Button
                      type="button"
                      variant="outline"
                      className="h-10 w-full justify-between font-normal"
                    />
                  }
                >
                  <span
                    className={
                      performedAt
                        ? 'text-foreground'
                        : 'text-muted-foreground'
                    }
                  >
                    {performedAt
                      ? formatDateDisplay(performedAt)
                      : 'Selecione uma data'}
                  </span>

                  <CalendarIcon className="h-4 w-4 text-muted-foreground" />
                </PopoverTrigger>

                <PopoverContent
                  className="w-auto p-0"
                  align="start"
                  sideOffset={6}
                >
                  <Calendar
                    mode="single"
                    selected={parseDateInput(performedAt)}
                    onSelect={(date) => {
                      setPerformedAt(
                        formatDateInput(date),
                      );

                      setError('');
                    }}
                    locale={ptBR}
                    captionLayout="dropdown"
                    startMonth={new Date(1950, 0)}
                    endMonth={new Date(2100, 11)}
                  />
                </PopoverContent>
              </Popover>
            </div>

            {/* PRÓXIMO RETORNO */}

            <div className="space-y-2">
              <Label>Próximo retorno</Label>

              <Popover>
                <PopoverTrigger
                  render={
                    <Button
                      type="button"
                      variant="outline"
                      className="h-10 w-full justify-between font-normal"
                    />
                  }
                >
                  <span
                    className={
                      nextReturnAt
                        ? 'text-foreground'
                        : 'text-muted-foreground'
                    }
                  >
                    {nextReturnAt
                      ? formatDateDisplay(nextReturnAt)
                      : 'Selecione uma data'}
                  </span>

                  <CalendarIcon className="h-4 w-4 text-muted-foreground" />
                </PopoverTrigger>

                <PopoverContent
                  className="w-auto p-0"
                  align="start"
                  sideOffset={6}
                >
                  <Calendar
                    mode="single"
                    selected={parseDateInput(nextReturnAt)}
                    onSelect={(date) => {
                      setNextReturnAt(
                        formatDateInput(date),
                      );
                    }}
                    locale={ptBR}
                    captionLayout="dropdown"
                    startMonth={new Date(1950, 0)}
                    endMonth={new Date(2100, 11)}
                  />
                </PopoverContent>
              </Popover>
            </div>

            {error && (
              <div className="rounded-lg border border-destructive/20 bg-destructive/10 px-3 py-2 text-sm text-destructive">
                {error}
              </div>
            )}

            <DialogFooter className="border-t border-border pt-4">
              <Button
                type="button"
                variant="outline"
                onClick={() =>
                  handleOpenChange(false)
                }
                disabled={saving}
              >
                Cancelar
              </Button>

              <Button
                type="submit"
                disabled={saving}
              >
                {saving
                  ? 'Salvando...'
                  : editingProcedure
                    ? 'Salvar alterações'
                    : 'Registrar procedimento'}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </>
  );
}