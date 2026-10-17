'use client';

import { useState, type FormEvent } from 'react';
import {
  AlertCircle,
  Calendar as CalendarIcon,
  Plus,
} from 'lucide-react';
import { ptBR } from 'date-fns/locale';

import { fetcher } from '@/lib/api';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';

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

type NewAppointmentDialogProps = {
  patientId: string;
  patientName: string;
  procedureCatalog: Procedure[];
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onCreated: () => Promise<void>;
};

type AppointmentForm = {
  procedureId: string;
  date: string;
  time: string;
  duration: string;
  notes: string;
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

function formatDateDisplay(value?: string) {
  if (!value) {
    return 'Selecione uma data';
  }

  const date = parseDateInput(value);

  if (!date) {
    return 'Selecione uma data';
  }

  return date.toLocaleDateString('pt-BR');
}

export function NewAppointmentDialog({
  patientId,
  patientName,
  procedureCatalog,
  open,
  onOpenChange,
  onCreated,
}: NewAppointmentDialogProps) {
  const [aptForm, setAptForm] =
    useState<AppointmentForm>({
      procedureId: '',
      date: '',
      time: '',
      duration: '60',
      notes: '',
    });

  const [isCreatingApt, setIsCreatingApt] =
    useState(false);

  const [aptError, setAptError] =
    useState('');

  /*
   * Mesmo padrão usado pelo modal de agenda
   * que já funciona no projeto.
   *
   * value = ID enviado para a API
   * label = nome exibido no Select
   */
  const procedureItems = procedureCatalog.map(
    (procedure) => ({
      value: procedure.id,
      label: procedure.name,
    }),
  );

  function resetForm() {
    setAptForm({
      procedureId: '',
      date: '',
      time: '',
      duration: '60',
      notes: '',
    });

    setAptError('');
  }

  function handleOpenChange(nextOpen: boolean) {
    if (isCreatingApt) {
      return;
    }

    onOpenChange(nextOpen);

    if (!nextOpen) {
      resetForm();
    }
  }

  async function handleCreateAppointment(
    event: FormEvent<HTMLFormElement>,
  ) {
    event.preventDefault();

    setAptError('');

    if (!aptForm.procedureId) {
      setAptError('Selecione um procedimento.');
      return;
    }

    if (!aptForm.date) {
      setAptError('Informe a data.');
      return;
    }

    if (!aptForm.time) {
      setAptError('Informe o horário.');
      return;
    }

    const duration = Number(aptForm.duration);

    if (
      !Number.isInteger(duration) ||
      duration < 1 ||
      duration > 1440
    ) {
      setAptError(
        'A duração deve estar entre 1 e 1440 minutos.',
      );
      return;
    }

    setIsCreatingApt(true);

    try {
      const localDateTime = `${aptForm.date}T${aptForm.time}`;

      await fetcher('/agenda', {
        method: 'POST',
        body: JSON.stringify({
          patientId,
          procedureId: aptForm.procedureId,
          date: new Date(
            localDateTime,
          ).toISOString(),
          duration,
          notes: aptForm.notes.trim() || undefined,
        }),
      });

      resetForm();
      onOpenChange(false);

      await onCreated();
    } catch (err: unknown) {
      setAptError(
        err instanceof Error
          ? err.message
          : 'Erro ao criar agendamento.',
      );
    } finally {
      setIsCreatingApt(false);
    }
  }

  return (
    <Dialog
      open={open}
      onOpenChange={handleOpenChange}
    >
      <DialogContent className="sm:max-w-[480px]">
        <DialogHeader>
          <DialogTitle>
            Novo Agendamento
          </DialogTitle>

          <DialogDescription>
            Agende uma consulta ou sessão para{' '}
            {patientName.split(' ')[0]}.
          </DialogDescription>
        </DialogHeader>

        <form
          onSubmit={handleCreateAppointment}
          className="space-y-5 py-4"
        >
          {/* PROCEDIMENTO */}

          <div className="space-y-2">
            <Label>Procedimento *</Label>

            <Select
              items={procedureItems}
              value={aptForm.procedureId || null}
              onValueChange={(value) => {
                if (!value) {
                  return;
                }

                setAptForm((previous) => ({
                  ...previous,
                  procedureId: value,
                }));

                setAptError('');
              }}
            >
              <SelectTrigger className="h-10 w-full">
                <SelectValue placeholder="Selecione um procedimento..." />
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

            {procedureCatalog.length === 0 && (
              <p className="text-xs text-muted-foreground">
                Nenhum procedimento cadastrado.
              </p>
            )}
          </div>

          {/* DATA + HORÁRIO */}

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>Data *</Label>

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
                      aptForm.date
                        ? 'text-foreground'
                        : 'text-muted-foreground'
                    }
                  >
                    {aptForm.date
                      ? formatDateDisplay(
                          aptForm.date,
                        )
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
                    selected={parseDateInput(
                      aptForm.date,
                    )}
                    onSelect={(date) => {
                      setAptForm((previous) => ({
                        ...previous,
                        date: formatDateInput(date),
                      }));

                      setAptError('');
                    }}
                    locale={ptBR}
                    captionLayout="dropdown"
                    startMonth={new Date(1950, 0)}
                    endMonth={new Date(2100, 11)}
                  />
                </PopoverContent>
              </Popover>
            </div>

            <div className="space-y-2">
              <Label htmlFor="apt-time">
                Horário *
              </Label>

              <Input
                id="apt-time"
                type="time"
                value={aptForm.time}
                onChange={(event) => {
                  setAptForm((previous) => ({
                    ...previous,
                    time: event.target.value,
                  }));

                  setAptError('');
                }}
                required
              />
            </div>
          </div>

          {/* DURAÇÃO */}

          <div className="space-y-2">
            <Label htmlFor="apt-duration">
              Duração (min)
            </Label>

            <Input
              id="apt-duration"
              type="number"
              min={1}
              max={1440}
              value={aptForm.duration}
              onChange={(event) => {
                setAptForm((previous) => ({
                  ...previous,
                  duration: event.target.value,
                }));

                setAptError('');
              }}
            />
          </div>

          {/* OBSERVAÇÕES */}

          <div className="space-y-2">
            <Label htmlFor="apt-notes">
              Observações
            </Label>

            <Textarea
              id="apt-notes"
              placeholder="Motivo da consulta, preparações necessárias..."
              value={aptForm.notes}
              onChange={(event) => {
                setAptForm((previous) => ({
                  ...previous,
                  notes: event.target.value,
                }));
              }}
              className="min-h-[80px] resize-none text-sm"
            />
          </div>

          {aptError && (
            <div className="flex items-center gap-2 rounded-lg border border-destructive/20 bg-destructive/10 px-3 py-2 text-sm text-destructive">
              <AlertCircle className="h-4 w-4 shrink-0" />

              {aptError}
            </div>
          )}

          <DialogFooter className="border-t border-border pt-4">
            <Button
              type="button"
              variant="outline"
              onClick={() =>
                handleOpenChange(false)
              }
              disabled={isCreatingApt}
            >
              Cancelar
            </Button>

            <Button
              type="submit"
              disabled={isCreatingApt}
              className="gap-2"
            >
              {isCreatingApt ? (
                'Agendando...'
              ) : (
                <>
                  <Plus className="h-4 w-4" />
                  Agendar
                </>
              )}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}