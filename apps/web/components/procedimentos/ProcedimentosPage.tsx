'use client';

import { useState } from 'react';
import { NewProcedureModal } from './NewProcedureModal';

interface Procedure {
  id: string;
  name: string;
  durationMinutes: number;
  price: number;
  description: string;
}

const initialProcedures: Procedure[] = [
  {
    id: '1',
    name: 'Toxina Botulínica (Botox)',
    durationMinutes: 60,
    price: 1200,
    description: 'Aplicação de botox para prevenção e tratamento de linhas de expressão.',
  },
  {
    id: '2',
    name: 'Preenchimento Labial',
    durationMinutes: 90,
    price: 1500,
    description: 'Preenchimento com ácido hialurônico para volume e contorno dos lábios.',
  },
  {
    id: '3',
    name: 'Limpeza de Pele Profunda',
    durationMinutes: 60,
    price: 250,
    description: 'Higienização, extração de cravos e hidratação profunda da pele.',
  },
];

export function ProcedimentosPage() {
  const [procedures, setProcedures] = useState<Procedure[]>(initialProcedures);
  const [searchTerm, setSearchTerm] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);

  const filteredProcedures = procedures.filter((p) =>
    p.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleAddProcedure = (newProc: { name: string; durationMinutes: number; price: number; description: string }) => {
    const item: Procedure = {
      id: String(Date.now()),
      ...newProc,
    };
    setProcedures((prev) => [item, ...prev]);
  };

  return (
    <div className="flex flex-col gap-6">
      <div className="flex items-center justify-between gap-4 shrink-0">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 tracking-tight">Procedimentos</h1>
          <p className="text-slate-500 text-sm">Gerencie o catálogo de serviços e preços da clínica.</p>
        </div>

        <button
          onClick={() => setIsModalOpen(true)}
          className="h-10 px-4 bg-blue-600 hover:bg-blue-700 active:scale-[0.98] text-white font-medium text-sm rounded-xl transition shadow-sm flex items-center gap-2 cursor-pointer"
        >
          <span>+</span> Novo Procedimento
        </button>
      </div>

      <div className="bg-white p-3 rounded-2xl border border-slate-200 shadow-sm flex items-center gap-3">
        <input
          type="text"
          placeholder="Buscar procedimento..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full max-w-md h-9 px-3 bg-slate-100 text-slate-800 placeholder-slate-400 rounded-xl text-sm outline-none focus:ring-2 focus:ring-blue-600"
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredProcedures.map((proc) => (
          <div
            key={proc.id}
            className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm flex flex-col justify-between hover:border-slate-300 transition"
          >
            <div className="flex flex-col gap-2">
              <div className="flex items-start justify-between gap-2">
                <h3 className="font-bold text-slate-900 text-base">{proc.name}</h3>
                <span className="text-xs font-bold text-emerald-700 bg-emerald-50 px-2.5 py-1 rounded-lg border border-emerald-200 shrink-0">
                  {proc.price.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}
                </span>
              </div>

              <p className="text-xs text-slate-500 line-clamp-2">
                {proc.description || 'Sem descrição cadastrada.'}
              </p>
            </div>

            <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500 font-medium">
              <span className="flex items-center gap-1.5">
                ⏱️ {proc.durationMinutes} minutos
              </span>
            </div>
          </div>
        ))}
      </div>

      <NewProcedureModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSave={handleAddProcedure}
      />
    </div>
  );
}