'use client';

import { useState } from 'react';

interface Appointment {
  id: string;
  patientName: string;
  procedure: string;
  startTime: string;
  durationMinutes: number;
  status: 'SCHEDULED' | 'CONFIRMED' | 'IN_PROGRESS' | 'COMPLETED' | 'CANCELLED';
  phone: string;
}

const mockAppointments: Appointment[] = [
  {
    id: '1',
    patientName: 'Maria Silva',
    procedure: 'Toxina Botulínica (Botox)',
    startTime: '09:00',
    durationMinutes: 60,
    status: 'CONFIRMED',
    phone: '11999999999',
  },
  {
    id: '2',
    patientName: 'Ana Beatriz',
    procedure: 'Preenchimento Labial',
    startTime: '10:30',
    durationMinutes: 90,
    status: 'IN_PROGRESS',
    phone: '11988888888',
  },
  {
    id: '3',
    patientName: 'Carla Dias',
    procedure: 'Limpeza de Pele Profunda',
    startTime: '14:00',
    durationMinutes: 60,
    status: 'SCHEDULED',
    phone: '11977777777',
  },
];

const statusStyles = {
  SCHEDULED: 'bg-amber-50/80 border-amber-300 text-amber-800 hover:bg-amber-100',
  CONFIRMED: 'bg-emerald-50/80 border-emerald-300 text-emerald-800 hover:bg-emerald-100',
  IN_PROGRESS: 'bg-blue-50/80 border-blue-300 text-blue-800 hover:bg-blue-100',
  COMPLETED: 'bg-slate-100 border-slate-300 text-slate-700 opacity-75',
  CANCELLED: 'bg-red-50 border-red-300 text-red-700 line-through opacity-60',
};

const statusBadge = {
  SCHEDULED: 'Agendado',
  CONFIRMED: 'Confirmado',
  IN_PROGRESS: 'Em Atendimento',
  COMPLETED: 'Concluído',
  CANCELLED: 'Cancelado',
};

const timeSlots = ['08:00', '09:00', '10:00', '11:00', '13:00', '14:00', '15:00', '16:00', '17:00'];

const weekDays = [
  { name: 'Dom', date: '26/07' },
  { name: 'Seg', date: '27/07' },
  { name: 'Ter', date: '28/07', isToday: true },
  { name: 'Qua', date: '29/07' },
  { name: 'Qui', date: '30/07' },
  { name: 'Sex', date: '31/07' },
  { name: 'Sáb', date: '01/08' },
];

export default function AgendaPage() {
  const [viewMode, setViewMode] = useState<'day' | 'week' | 'month'>('month');
  const [selectedDate, setSelectedDate] = useState('2026-07-28');
  const [isNewAppointmentOpen, setIsNewAppointmentOpen] = useState(false);
  const [selectedAppointment, setSelectedAppointment] = useState<Appointment | null>(null);

  return (
    <div className="flex flex-col h-[calc(100vh-112px)] gap-4">
      <div className="flex items-center justify-between gap-4 shrink-0">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 tracking-tight">Agenda</h1>
          <p className="text-slate-500 text-sm">Gerencie os horários e atendimentos da clínica.</p>
        </div>

        <button
          onClick={() => setIsNewAppointmentOpen(true)}
          className="h-10 px-4 bg-blue-600 hover:bg-blue-700 active:scale-[0.98] text-white font-medium text-sm rounded-xl transition shadow-sm flex items-center gap-2"
        >
          <span>+</span> Novo Agendamento
        </button>
      </div>

      <div className="bg-white p-2.5 px-4 rounded-2xl border border-slate-200 shadow-sm flex flex-wrap items-center justify-between gap-4 shrink-0">
        {/* Seleção de Data & Toggle Integrado */}
        <div className="flex items-center gap-3">
          <input
            type="date"
            value={selectedDate}
            onChange={(e) => setSelectedDate(e.target.value)}
            className="h-9 px-3 bg-slate-100 text-slate-800 rounded-xl text-sm outline-none focus:ring-2 focus:ring-blue-600 border border-transparent font-medium"
          />

          <div className="h-5 w-px bg-slate-200 hidden sm:block" />

          {/* Toggle de Visão Integrado e Discreto */}
          <div className="bg-slate-100 p-1 rounded-xl flex gap-0.5 text-xs font-medium text-slate-600">
            <button
              onClick={() => setViewMode('day')}
              className={`px-3 py-1 rounded-lg transition-all ${
                viewMode === 'day' ? 'bg-white text-blue-600 shadow-xs font-semibold' : 'hover:text-slate-900'
              }`}
            >
              Dia
            </button>
            <button
              onClick={() => setViewMode('week')}
              className={`px-3 py-1 rounded-lg transition-all ${
                viewMode === 'week' ? 'bg-white text-blue-600 shadow-xs font-semibold' : 'hover:text-slate-900'
              }`}
            >
              Semana
            </button>
            <button
              onClick={() => setViewMode('month')}
              className={`px-3 py-1 rounded-lg transition-all ${
                viewMode === 'month' ? 'bg-white text-blue-600 shadow-xs font-semibold' : 'hover:text-slate-900'
              }`}
            >
              Mês
            </button>
          </div>
        </div>

        {/* Status */}
        <div className="hidden md:flex items-center gap-4 text-xs font-medium text-slate-600">
          <span className="flex items-center gap-1.5"><span className="w-2.5 h-2.5 rounded-full bg-amber-400"></span> Agendado</span>
          <span className="flex items-center gap-1.5"><span className="w-2.5 h-2.5 rounded-full bg-emerald-500"></span> Confirmado</span>
          <span className="flex items-center gap-1.5"><span className="w-2.5 h-2.5 rounded-full bg-blue-500"></span> Em Atendimento</span>
        </div>
      </div>

      {/* 3. Área do Calendário */}
      <div className="flex-1 min-h-0 bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden flex flex-col p-3">
        
        {/* DIA */}
        {viewMode === 'day' && (
          <div className="flex-1 grid grid-rows-9 divide-y divide-slate-100 h-full">
            {timeSlots.map((time) => {
              const appointment = mockAppointments.find((app) => app.startTime === time);

              return (
                <div key={time} className="flex items-center gap-3 px-2 group hover:bg-slate-50/60 transition">
                  <span className="w-14 text-xs font-semibold text-slate-400 text-center shrink-0">
                    {time}
                  </span>

                  <div className="flex-1 h-full py-1">
                    {appointment ? (
                      <div
                        onClick={() => setSelectedAppointment(appointment)}
                        className={`h-full px-4 py-1.5 rounded-xl border flex items-center justify-between transition cursor-pointer ${statusStyles[appointment.status]}`}
                      >
                        <div className="flex items-center gap-3">
                          <span className="font-bold text-sm">{appointment.patientName}</span>
                          <span className="text-xs opacity-80">• {appointment.procedure} ({appointment.durationMinutes} min)</span>
                          <span className="text-[10px] font-semibold px-2 py-0.5 rounded-md bg-white/90 border border-current">
                            {statusBadge[appointment.status]}
                          </span>
                        </div>

                        <div className="flex items-center gap-2" onClick={(e) => e.stopPropagation()}>
                          <a
                            href={`https://wa.me/55${appointment.phone}`}
                            target="_blank"
                            rel="noreferrer"
                            className="px-2.5 py-1 rounded-lg bg-white/90 hover:bg-white text-emerald-700 border border-emerald-200 text-xs font-semibold"
                          >
                            💬 Whats
                          </a>
                        </div>
                      </div>
                    ) : (
                      <button
                        onClick={() => setIsNewAppointmentOpen(true)}
                        className="w-full h-full rounded-xl border border-dashed border-transparent hover:border-slate-300 flex items-center px-4 text-xs text-slate-400 opacity-0 group-hover:opacity-100 transition"
                      >
                        + Agendar para às {time}
                      </button>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {/* SEMANA */}
        {viewMode === 'week' && (
          <div className="flex-1 flex flex-col h-full">
            <div className="grid grid-cols-7 gap-2 pb-2 border-b border-slate-100 text-center shrink-0">
              {weekDays.map((day) => (
                <div
                  key={day.name}
                  className={`py-1.5 rounded-xl flex flex-col items-center justify-center ${
                    day.isToday ? 'bg-blue-50 text-blue-700 font-bold' : 'text-slate-600 font-medium'
                  }`}
                >
                  <span className="text-xs">{day.name}</span>
                  <span className="text-[10px] opacity-75">{day.date}</span>
                </div>
              ))}
            </div>

            <div className="flex-1 grid grid-cols-7 gap-2 pt-2 min-h-0">
              {weekDays.map((day) => {
                const dayAppointments = day.isToday ? mockAppointments : [];

                return (
                  <div
                    key={day.name}
                    className={`rounded-xl border p-2 flex flex-col gap-2 transition ${
                      day.isToday ? 'bg-blue-50/20 border-blue-200' : 'bg-slate-50/30 border-slate-100'
                    }`}
                  >
                    {dayAppointments.length > 0 ? (
                      dayAppointments.map((app) => (
                        <div
                          key={app.id}
                          onClick={() => setSelectedAppointment(app)}
                          className={`p-2 rounded-lg border text-xs flex flex-col gap-1 transition cursor-pointer shadow-2xs ${statusStyles[app.status]}`}
                        >
                          <div className="flex items-center justify-between font-bold">
                            <span className="truncate">{app.patientName}</span>
                            <span className="text-[9px]">{app.startTime}</span>
                          </div>
                          <span className="text-[10px] opacity-80 truncate">{app.procedure}</span>
                        </div>
                      ))
                    ) : (
                      <button
                        onClick={() => setIsNewAppointmentOpen(true)}
                        className="flex-1 flex items-center justify-center text-[11px] text-slate-300 hover:text-slate-500 transition"
                      >
                        +
                      </button>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* MÊS */}
        {viewMode === 'month' && (
          <div className="flex-1 flex flex-col h-full">
            <div className="grid grid-cols-7 text-center text-xs font-bold text-slate-500 pb-2 border-b border-slate-100 shrink-0">
              <div>Dom</div><div>Seg</div><div>Ter</div><div>Qua</div><div>Qui</div><div>Sex</div><div>Sáb</div>
            </div>

            <div className="flex-1 grid grid-cols-7 grid-rows-5 gap-2 pt-2 min-h-0">
              {Array.from({ length: 31 }, (_, i) => {
                const dayNum = i + 1;
                const isToday = dayNum === 28;

                return (
                  <div
                    key={dayNum}
                    onClick={() => {
                      if (isToday) {
                        setViewMode('day'); // Ao clicar no dia com agendamentos, abre a visão do dia
                      } else {
                        setIsNewAppointmentOpen(true);
                      }
                    }}
                    className={`p-2 rounded-xl border flex flex-col justify-between transition cursor-pointer hover:border-blue-400 ${
                      isToday ? 'bg-blue-50/30 border-blue-300' : 'border-slate-100 bg-slate-50/20'
                    }`}
                  >
                    <span className={`text-xs font-semibold ${isToday ? 'text-blue-600 font-bold' : 'text-slate-700'}`}>
                      {dayNum}
                    </span>

                    {isToday && (
                      <div className="flex flex-col gap-1">
                        <span className="text-[10px] bg-emerald-100 text-emerald-800 px-1.5 py-0.5 rounded-md font-semibold truncate">
                          3 Atendimentos
                        </span>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        )}

      </div>
    </div>
  );
}