'use client';

import { useState, useEffect } from 'react';
import type { CreateAppointmentInput } from '@/types/appointment';
import type { DurationUnit } from '@/types/procedure';
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
import { Label } from "@/components/ui/label";

interface NewAppointmentModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave?: (appointment: CreateAppointmentInput) => void;
}

export function NewAppointmentModal({ isOpen, onClose, onSave }: NewAppointmentModalProps) {
  const [patientName, setPatientName] = useState('');
  const [phone, setPhone] = useState('');
  const [procedure, setProcedure] = useState('');
  const [date, setDate] = useState('2026-07-28');
  const [startTime, setStartTime] = useState('09:00');
  const [durationValue, setDurationValue] = useState('60');
  const [durationUnit, setDurationUnit] = useState<DurationUnit>('minutes');
  const [notes, setNotes] = useState('');

  // Reset form when opened
  useEffect(() => {
    if (isOpen) {
      setPatientName('');
      setPhone('');
      setProcedure('');
      setDate('2026-07-28');
      setStartTime('09:00');
      setDurationValue('60');
      setNotes('');
    }
  }, [isOpen]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const rawValue = parseFloat(durationValue) || 0;
    const totalMinutes = durationUnit === 'hours' ? Math.round(rawValue * 60) : Math.round(rawValue);

    if (onSave) {
      onSave({
        patientName,
        phone,
        procedure,
        date,
        startTime,
        durationMinutes: totalMinutes,
        notes,
      });
    }
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="sm:max-w-[500px] p-0 overflow-hidden">
        <DialogHeader className="px-6 pt-6 pb-4 border-b border-slate-100">
          <DialogTitle className="text-xl font-bold">Novo Agendamento</DialogTitle>
          <DialogDescription>
            Marque uma nova consulta ou procedimento na agenda.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="flex flex-col">
          <div className="px-6 py-4 flex flex-col gap-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="flex flex-col gap-2">
                <Label htmlFor="patientName">Nome do Paciente</Label>
                <Input
                  id="patientName"
                  required
                  placeholder="Ex: Maria Silva"
                  value={patientName}
                  onChange={(e) => setPatientName(e.target.value)}
                />
              </div>

              <div className="flex flex-col gap-2">
                <Label htmlFor="phone">Telefone / WhatsApp</Label>
                <Input
                  id="phone"
                  type="tel"
                  required
                  placeholder="(11) 99999-9999"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                />
              </div>
            </div>

            <div className="flex flex-col gap-2">
              <Label htmlFor="procedure">Procedimento</Label>
              <select
                id="procedure"
                required
                value={procedure}
                onChange={(e) => setProcedure(e.target.value)}
                className="flex h-9 w-full items-center justify-between whitespace-nowrap rounded-md border border-input bg-transparent px-3 py-2 text-sm shadow-sm ring-offset-background placeholder:text-muted-foreground focus:outline-none focus:ring-1 focus:ring-ring disabled:cursor-not-allowed disabled:opacity-50 [&>span]:line-clamp-1"
              >
                <option value="" disabled>Selecione um procedimento</option>
                <option value="Toxina Botulínica (Botox)">Toxina Botulínica (Botox)</option>
                <option value="Preenchimento Labial">Preenchimento Labial</option>
                <option value="Limpeza de Pele Profunda">Limpeza de Pele Profunda</option>
                <option value="Bioestimulador de Colágeno">Bioestimulador de Colágeno</option>
              </select>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div className="flex flex-col gap-2">
                <Label htmlFor="date">Data</Label>
                <Input
                  id="date"
                  type="date"
                  required
                  value={date}
                  onChange={(e) => setDate(e.target.value)}
                />
              </div>

              <div className="flex flex-col gap-2">
                <Label htmlFor="startTime">Horário</Label>
                <Input
                  id="startTime"
                  type="time"
                  required
                  value={startTime}
                  onChange={(e) => setStartTime(e.target.value)}
                />
              </div>

              <div className="flex flex-col gap-2">
                <Label htmlFor="duration">Duração</Label>
                <div className="flex items-center rounded-md border border-input bg-transparent h-9 px-3 focus-within:ring-1 focus-within:ring-ring">
                  <input
                    id="duration"
                    type="number"
                    step="any"
                    min="1"
                    required
                    placeholder="60"
                    value={durationValue}
                    onChange={(e) => setDurationValue(e.target.value)}
                    className="w-full bg-transparent text-sm outline-none"
                  />
                  <div className="h-4 w-px bg-slate-300 mx-1 shrink-0" />
                  <select
                    value={durationUnit}
                    onChange={(e) => setDurationUnit(e.target.value as 'minutes' | 'hours')}
                    className="bg-transparent text-sm text-slate-500 font-medium outline-none cursor-pointer"
                  >
                    <option value="minutes">min</option>
                    <option value="hours">h</option>
                  </select>
                </div>
              </div>
            </div>

            <div className="flex flex-col gap-2">
              <Label htmlFor="notes">Observações (Opcional)</Label>
              <textarea
                id="notes"
                rows={2}
                placeholder="Alguma alergia ou recomendação específica..."
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                className="flex min-h-[60px] w-full rounded-md border border-input bg-transparent px-3 py-2 text-sm shadow-sm placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
              />
            </div>
          </div>

          <DialogFooter className="px-6 py-4 border-t border-slate-100 bg-slate-50/50">
            <Button type="button" variant="outline" onClick={onClose}>
              Cancelar
            </Button>
            <Button type="submit" className="shadow-sm">
              Agendar
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}