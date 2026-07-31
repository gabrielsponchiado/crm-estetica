'use client';

import { useState } from 'react';

interface NewAppointmentModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave?: (appointment: any) => void;
}

export function NewAppointmentModal({ isOpen, onClose, onSave }: NewAppointmentModalProps) {
  const [patientName, setPatientName] = useState('');
  const [phone, setPhone] = useState('');
  const [procedure, setProcedure] = useState('');
  const [date, setDate] = useState('2026-07-28');
  const [startTime, setStartTime] = useState('09:00');
  
  // Duração Flexível (Número + min/h)
  const [durationValue, setDurationValue] = useState('60');
  const [durationUnit, setDurationUnit] = useState<'minutes' | 'hours'>('minutes');
  
  const [notes, setNotes] = useState('');

  if (!isOpen) return null;

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
    <div className="fixed inset-0 z-50 bg-slate-900/40 backdrop-blur-xs flex items-center justify-center p-4">
      <div className="bg-white w-full max-w-lg rounded-2xl border border-slate-200 shadow-xl flex flex-col overflow-hidden animate-in fade-in zoom-in-95 duration-150">
        
        {/* Cabeçalho */}
        <div className="p-5 border-b border-slate-100 flex items-center justify-between">
          <div>
            <h2 className="text-lg font-bold text-slate-900">Novo Agendamento</h2>
            <p className="text-xs text-slate-500">Marque uma consulta ou procedimento na agenda.</p>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-500 flex items-center justify-center transition cursor-pointer"
          >
            ✕
          </button>
        </div>

        {/* Formulário */}
        <form onSubmit={handleSubmit} className="p-5 flex flex-col gap-4 text-sm">
          
          {/* Paciente e Telefone */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div className="flex flex-col gap-1.5">
              <label className="font-semibold text-slate-700 text-xs">Nome do Paciente</label>
              <input
                type="text"
                required
                placeholder="Ex: Maria Silva"
                value={patientName}
                onChange={(e) => setPatientName(e.target.value)}
                className="w-full h-10 px-3 bg-slate-100 text-slate-900 placeholder-slate-400 rounded-xl outline-none focus:ring-2 focus:ring-blue-600 transition text-xs"
              />
            </div>

            <div className="flex flex-col gap-1.5">
              <label className="font-semibold text-slate-700 text-xs">Telefone / WhatsApp</label>
              <input
                type="tel"
                required
                placeholder="(11) 99999-9999"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                className="w-full h-10 px-3 bg-slate-100 text-slate-900 placeholder-slate-400 rounded-xl outline-none focus:ring-2 focus:ring-blue-600 transition text-xs"
              />
            </div>
          </div>

          {/* Procedimento (Select Ajustado) */}
          <div className="flex flex-col gap-1.5">
            <label className="font-semibold text-slate-700 text-xs">Procedimento</label>
            <div className="relative">
              <select
                required
                value={procedure}
                onChange={(e) => setProcedure(e.target.value)}
                className="w-full h-10 pl-3 pr-8 bg-slate-100 text-slate-900 rounded-xl outline-none focus:ring-2 focus:ring-blue-600 text-xs appearance-none cursor-pointer"
              >
                <option value="" disabled>Selecione um procedimento</option>
                <option value="Toxina Botulínica (Botox)">Toxina Botulínica (Botox)</option>
                <option value="Preenchimento Labial">Preenchimento Labial</option>
                <option value="Limpeza de Pele Profunda">Limpeza de Pele Profunda</option>
                <option value="Bioestimulador de Colágeno">Bioestimulador de Colágeno</option>
              </select>
              {/* Ícone customizado no canto direito */}
              <div className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none text-slate-500 text-xs">
                ▼
              </div>
            </div>
          </div>

          {/* Data, Horário e Duração Flexível */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            
            {/* Data */}
            <div className="flex flex-col gap-1.5">
              <label className="font-semibold text-slate-700 text-xs">Data</label>
              <input
                type="date"
                required
                value={date}
                onChange={(e) => setDate(e.target.value)}
                className="w-full h-10 px-3 bg-slate-100 text-slate-900 rounded-xl outline-none focus:ring-2 focus:ring-blue-600 text-xs font-medium"
              />
            </div>

            {/* Horário */}
            <div className="flex flex-col gap-1.5">
              <label className="font-semibold text-slate-700 text-xs">Horário</label>
              <input
                type="time"
                required
                value={startTime}
                onChange={(e) => setStartTime(e.target.value)}
                className="w-full h-10 px-3 bg-slate-100 text-slate-900 rounded-xl outline-none focus:ring-2 focus:ring-blue-600 text-xs font-medium"
              />
            </div>

            {/* Duração Flexível Unificada */}
            <div className="flex flex-col gap-1.5">
              <label className="font-semibold text-slate-700 text-xs">Duração</label>
              <div className="flex items-center bg-slate-100 rounded-xl px-3 h-10 focus-within:ring-2 focus-within:ring-blue-600 transition">
                <input
                  type="number"
                  step="any"
                  min="1"
                  required
                  placeholder="60"
                  value={durationValue}
                  onChange={(e) => setDurationValue(e.target.value)}
                  className="w-full bg-transparent text-slate-900 outline-none text-xs font-medium"
                />
                
                <div className="h-4 w-px bg-slate-300 mx-1.5 shrink-0" />

                <select
                  value={durationUnit}
                  onChange={(e) => setDurationUnit(e.target.value as 'minutes' | 'hours')}
                  className="bg-transparent text-slate-600 font-semibold text-xs outline-none cursor-pointer hover:text-slate-900 transition shrink-0 pr-1"
                >
                  <option value="minutes">min</option>
                  <option value="hours">h</option>
                </select>
              </div>
            </div>

          </div>

          {/* Observações */}
          <div className="flex flex-col gap-1.5">
            <label className="font-semibold text-slate-700 text-xs">Observações (Opcional)</label>
            <textarea
              rows={2}
              placeholder="Alguma alergia ou recomendação específica..."
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              className="w-full p-3 bg-slate-100 text-slate-900 placeholder-slate-400 rounded-xl outline-none focus:ring-2 focus:ring-blue-600 resize-none text-xs"
            />
          </div>

          {/* Rodapé */}
          <div className="pt-3 border-t border-slate-100 flex items-center justify-end gap-2 mt-2">
            <button
              type="button"
              onClick={onClose}
              className="h-10 px-4 bg-slate-100 hover:bg-slate-200 text-slate-700 font-medium rounded-xl transition cursor-pointer"
            >
              Cancelar
            </button>
            <button
              type="submit"
              className="h-10 px-5 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-xl transition shadow-sm cursor-pointer"
            >
              Agendar
            </button>
          </div>

        </form>
      </div>
    </div>
  );
}