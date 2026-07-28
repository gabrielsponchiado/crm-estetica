'use client';

import { useState, useEffect } from 'react';

interface NewAppointmentModalProps {
  isOpen: boolean;
  onClose: () => void;
  defaultDate?: string;
  defaultTime?: string;
}

export function NewAppointmentModal({
  isOpen,
  onClose,
  defaultDate = '2026-07-28',
  defaultTime = '09:00',
}: NewAppointmentModalProps) {
  const [patientName, setPatientName] = useState('');
  const [phone, setPhone] = useState('');
  const [procedure, setProcedure] = useState('');
  const [date, setDate] = useState(defaultDate);
  const [time, setTime] = useState(defaultTime);
  const [duration, setDuration] = useState('60');
  const [notes, setNotes] = useState('');

  const resetForm = () => {
    setPatientName('');
    setPhone('');
    setProcedure('');
    setDate(defaultDate);
    setTime(defaultTime);
    setDuration('60');
    setNotes('');
  };

  useEffect(() => {
    if (isOpen) {
      resetForm();
    }
  }, [isOpen, defaultDate, defaultTime]);

  if (!isOpen) return null;

  const handleClose = () => {
    resetForm();
    onClose();
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log({ patientName, phone, procedure, date, time, duration, notes });
    handleClose();
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/40 backdrop-blur-xs flex items-center justify-center p-4">
      <div className="bg-white w-full max-w-lg rounded-2xl border border-slate-200 shadow-xl flex flex-col overflow-hidden animate-in fade-in zoom-in-95 duration-150">
        <div className="p-5 border-b border-slate-100 flex items-center justify-between">
          <div>
            <h2 className="text-lg font-bold text-slate-900">Novo Agendamento</h2>
            <p className="text-xs text-slate-500">Preencha os dados da consulta ou retorno.</p>
          </div>
          <button
            onClick={handleClose}
            className="w-8 h-8 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-500 flex items-center justify-center transition cursor-pointer"
          >
            ✕
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-5 flex flex-col gap-4 text-sm">
          <div className="flex flex-col gap-1.5">
            <label className="font-semibold text-slate-700 text-xs">Paciente</label>
            <input
              type="text"
              required
              placeholder="Nome completo do paciente"
              value={patientName}
              onChange={(e) => setPatientName(e.target.value)}
              className="w-full h-10 px-3 bg-slate-100 text-slate-900 placeholder-slate-400 rounded-xl outline-none focus:ring-2 focus:ring-blue-600 transition"
            />
          </div>

          <div className="flex flex-col gap-1.5">
            <label className="font-semibold text-slate-700 text-xs">WhatsApp / Telefone</label>
            <input
              type="tel"
              required
              placeholder="(11) 99999-9999"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              className="w-full h-10 px-3 bg-slate-100 text-slate-900 placeholder-slate-400 rounded-xl outline-none focus:ring-2 focus:ring-blue-600 transition"
            />
          </div>

          <div className="flex flex-col gap-1.5">
            <label className="font-semibold text-slate-700 text-xs">Procedimento</label>
            <select
              value={procedure}
              onChange={(e) => setProcedure(e.target.value)}
              required
              className="w-full h-10 px-3 bg-slate-100 text-slate-900 rounded-xl outline-none focus:ring-2 focus:ring-blue-600 transition"
            >
              <option value="">Selecione um procedimento</option>
              <option value="Toxina Botulínica (Botox)">Toxina Botulínica (Botox)</option>
              <option value="Preenchimento Labial">Preenchimento Labial</option>
              <option value="Limpeza de Pele Profunda">Limpeza de Pele Profunda</option>
              <option value="Harmonização Facial">Harmonização Facial</option>
            </select>
          </div>

          <div className="grid grid-cols-3 gap-3">
            <div className="flex flex-col gap-1.5">
              <label className="font-semibold text-slate-700 text-xs">Data</label>
              <input
                type="date"
                required
                value={date}
                onChange={(e) => setDate(e.target.value)}
                className="w-full h-10 px-2.5 bg-slate-100 text-slate-900 rounded-xl outline-none focus:ring-2 focus:ring-blue-600 text-xs"
              />
            </div>

            <div className="flex flex-col gap-1.5">
              <label className="font-semibold text-slate-700 text-xs">Horário</label>
              <input
                type="time"
                required
                value={time}
                onChange={(e) => setTime(e.target.value)}
                className="w-full h-10 px-2.5 bg-slate-100 text-slate-900 rounded-xl outline-none focus:ring-2 focus:ring-blue-600 text-xs"
              />
            </div>

            <div className="flex flex-col gap-1.5">
              <label className="font-semibold text-slate-700 text-xs">Duração</label>
              <select
                value={duration}
                onChange={(e) => setDuration(e.target.value)}
                className="w-full h-10 px-2 bg-slate-100 text-slate-900 rounded-xl outline-none focus:ring-2 focus:ring-blue-600 text-xs"
              >
                <option value="30">30 min</option>
                <option value="45">45 min</option>
                <option value="60">1h (60 min)</option>
                <option value="90">1h30 min</option>
              </select>
            </div>
          </div>

          <div className="flex flex-col gap-1.5">
            <label className="font-semibold text-slate-700 text-xs">Observações (Opcional)</label>
            <textarea
              rows={2}
              placeholder="Alergias, observações do paciente..."
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              className="w-full p-3 bg-slate-100 text-slate-900 placeholder-slate-400 rounded-xl outline-none focus:ring-2 focus:ring-blue-600 resize-none text-xs"
            />
          </div>

          {/* Rodapé */}
          <div className="pt-3 border-t border-slate-100 flex items-center justify-end gap-2 mt-2">
            <button
              type="button"
              onClick={handleClose}
              className="h-10 px-4 bg-slate-100 hover:bg-slate-200 text-slate-700 font-medium rounded-xl transition cursor-pointer"
            >
              Cancelar
            </button>
            <button
              type="submit"
              className="h-10 px-5 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-xl transition shadow-sm cursor-pointer"
            >
              Salvar Agendamento
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}