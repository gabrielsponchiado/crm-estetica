'use client';

import { useState } from 'react';

import {
  AlertCircle,
  Loader2,
  Plus,
} from 'lucide-react';

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

import { fetcher } from '@/lib/api';

type NewAppointmentDialogProps = {
  patientId: string;
  patientName: string;
  procedureCatalog: any[];
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onCreated: () => Promise<void>;
};

const EMPTY_FORM = {
  procedureId: '',
  date: '',
  duration: '60',
  notes: '',
};

export function NewAppointmentDialog({
  patientId,
  patientName,
  procedureCatalog,
  open,
  onOpenChange,
  onCreated,
}: NewAppointmentDialogProps) {
  const [form, setForm] = useState(
    EMPTY_FORM,
  );

  const [isCreating, setIsCreating] =
    useState(false);

  const [error, setError] = useState('');

  const handleOpenChange = (
    nextOpen: boolean,
  ) => {
    onOpenChange(nextOpen);

    if (!nextOpen) {
      setError('');
      setForm(EMPTY_FORM);
    }
  };

  const handleSubmit = async (
    event: React.FormEvent,
  ) => {
    event.preventDefault();

    setError('');

    if (!form.procedureId) {
      setError(
        'Selecione um procedimento.',
      );
      return;
    }

    if (!form.date) {
      setError(
        'Informe a data e hora.',
      );
      return;
    }

    setIsCreating(true);

    try {
      await fetcher('/agenda', {
        method: 'POST',
        body: JSON.stringify({
          patientId,
          procedureId: form.procedureId,
          date: new Date(
            form.date,
          ).toISOString(),
          duration:
            Number(form.duration) || 60,
          notes:
            form.notes || undefined,
        }),
      });

      await onCreated();

      setForm(EMPTY_FORM);

      handleOpenChange(false);
    } catch (err: any) {
      setError(
        err?.message ||
          'Erro ao criar agendamento.',
      );
    } finally {
      setIsCreating(false);
    }
  };

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
          onSubmit={handleSubmit}
          className="space-y-5 py-4"
        >
          <div className="space-y-2">
            <Label htmlFor="apt-procedure">
              Procedimento *
            </Label>

            <select
              id="apt-procedure"
              value={form.procedureId}
              onChange={(e) =>
                setForm((prev) => ({
                  ...prev,
                  procedureId:
                    e.target.value,
                }))
              }
              className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2"
              required
            >
              <option value="">
                Selecione um procedimento...
              </option>

              {procedureCatalog.map(
                (procedure: any) => (
                  <option
                    key={procedure.id}
                    value={procedure.id}
                  >
                    {procedure.name} — R${' '}
                    {Number(
                      procedure.price,
                    ).toLocaleString(
                      'pt-BR',
                      {
                        minimumFractionDigits: 2,
                      },
                    )}
                  </option>
                ),
              )}
            </select>

            {procedureCatalog.length ===
              0 && (
              <p className="text-xs text-muted-foreground">
                Nenhum procedimento cadastrado.
                Acesse Procedimentos para
                cadastrar.
              </p>
            )}
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="apt-date">
                Data e Hora *
              </Label>

              <Input
                id="apt-date"
                type="datetime-local"
                value={form.date}
                onChange={(e) =>
                  setForm((prev) => ({
                    ...prev,
                    date: e.target.value,
                  }))
                }
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="apt-duration">
                Duração (min)
              </Label>

              <Input
                id="apt-duration"
                type="number"
                min={15}
                max={480}
                value={form.duration}
                onChange={(e) =>
                  setForm((prev) => ({
                    ...prev,
                    duration:
                      e.target.value,
                  }))
                }
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="apt-notes">
              Observações
            </Label>

            <Textarea
              id="apt-notes"
              placeholder="Motivo da consulta, preparações necessárias..."
              value={form.notes}
              onChange={(e) =>
                setForm((prev) => ({
                  ...prev,
                  notes: e.target.value,
                }))
              }
              className="resize-none min-h-[80px] text-sm"
            />
          </div>

          {error && (
            <div className="flex items-center gap-2 text-sm text-destructive bg-destructive/10 border border-destructive/20 rounded-lg px-3 py-2">
              <AlertCircle className="w-4 h-4 shrink-0" />
              {error}
            </div>
          )}

          <DialogFooter className="pt-4 border-t border-border">
            <Button
              type="button"
              variant="outline"
              onClick={() =>
                handleOpenChange(false)
              }
            >
              Cancelar
            </Button>

            <Button
              type="submit"
              disabled={isCreating}
              className="gap-2"
            >
              {isCreating ? (
                <Loader2 className="w-4 h-4 animate-spin" />
              ) : (
                <Plus className="w-4 h-4" />
              )}

              Agendar
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}