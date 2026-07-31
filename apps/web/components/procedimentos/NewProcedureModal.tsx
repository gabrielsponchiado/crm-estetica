'use client';

import { useState, useEffect } from 'react';

interface NewProcedureModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave?: (procedure: { name: string; durationMinutes: number; price: number; description: string }) => void;
}

export function NewProcedureModal({ isOpen, onClose, onSave }: NewProcedureModalProps) {
  const [name, setName] = useState('');
  const [durationValue, setDurationValue] = useState('60');
  const [durationUnit, setDurationUnit] = useState<'minutes' | 'hours'>('minutes');
  const [price, setPrice] = useState('');
  const [description, setDescription] = useState('');

  const resetForm = () => {
    setName('');
    setDurationValue('60');
    setDurationUnit('minutes');
    setPrice('');
    setDescription('');
  };

  useEffect(() => {
    if (isOpen) resetForm();
  }, [isOpen]);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const rawValue = parseFloat(durationValue) || 0;
    const totalMinutes = durationUnit === 'hours' ? Math.round(rawValue * 60) : Math.round(rawValue);

    if (onSave) {
      onSave({
        name,
        durationMinutes: totalMinutes,
        price: Number(price.replace(',', '.')),
        description,
      });
    }
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/40 backdrop-blur-xs flex items-center justify-center p-4">
      <div className="bg-white w-full max-w-md rounded-2xl border border-slate-200 shadow-xl flex flex-col overflow-hidden animate-in fade-in zoom-in-95 duration-150">
        <div className="p-5 border-b border-slate-100 flex items-center justify-between">
          <div>
            <h2 className="text-lg font-bold text-slate-900">Novo Procedimento</h2>
            <p className="text-xs text-slate-500">Cadastre um serviço oferecido pela clínica.</p>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-500 flex items-center justify-center transition cursor-pointer"
          >
            ✕
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-5 flex flex-col gap-4 text-sm">
          <div className="flex flex-col gap-1.5">
            <label className="font-semibold text-slate-700 text-xs">Nome do Procedimento</label>
            <input
              type="text"
              required
              placeholder="Ex: Preenchimento Labial"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full h-10 px-3 bg-slate-100 text-slate-900 placeholder-slate-400 rounded-xl outline-none focus:ring-2 focus:ring-blue-600 transition"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div className="flex flex-col gap-1.5">
              <label className="font-semibold text-slate-700 text-xs">Duração Padrão</label>
              
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
                  className="bg-transparent text-slate-600 font-semibold text-xs outline-none cursor-pointer hover:text-slate-900 transition shrink-0"
                >
                  <option value="minutes">min</option>
                  <option value="hours">h</option>
                </select>
              </div>
            </div>

            <div className="flex flex-col gap-1.5">
              <label className="font-semibold text-slate-700 text-xs">Preço (R$)</label>
              <input
                type="number"
                step="0.01"
                required
                placeholder="800.00"
                value={price}
                onChange={(e) => setPrice(e.target.value)}
                className="w-full h-10 px-3 bg-slate-100 text-slate-900 placeholder-slate-400 rounded-xl outline-none focus:ring-2 focus:ring-blue-600 transition text-xs"
              />
            </div>
          </div>

          <div className="flex flex-col gap-1.5">
            <label className="font-semibold text-slate-700 text-xs">Descrição / Recomendações (Opcional)</label>
            <textarea
              rows={3}
              placeholder="Detalhes sobre o procedimento ou cuidados..."
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="w-full p-3 bg-slate-100 text-slate-900 placeholder-slate-400 rounded-xl outline-none focus:ring-2 focus:ring-blue-600 resize-none text-xs"
            />
          </div>

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
              Salvar Procedimento
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}