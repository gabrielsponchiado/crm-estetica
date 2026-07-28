'use client';

interface Appointment {
  id: string;
  patientName: string;
  procedure: string;
  startTime: string;
  durationMinutes: number;
  status: 'SCHEDULED' | 'CONFIRMED' | 'IN_PROGRESS' | 'COMPLETED' | 'CANCELLED';
  phone: string;
}

interface AppointmentDetailsModalProps {
  appointment: Appointment | null;
  onClose: () => void;
}

export function AppointmentDetailsModal({
  appointment,
  onClose,
}: AppointmentDetailsModalProps) {
  if (!appointment) return null;

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/40 backdrop-blur-xs flex items-center justify-center p-4">
      <div className="bg-white w-full max-w-md rounded-2xl border border-slate-200 shadow-xl flex flex-col overflow-hidden animate-in fade-in zoom-in-95 duration-150">
        <div className="p-5 border-b border-slate-100 flex items-center justify-between">
          <div>
            <h2 className="text-lg font-bold text-slate-900">{appointment.patientName}</h2>
            <p className="text-xs text-slate-500">Detalhes do atendimento</p>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-500 flex items-center justify-center transition cursor-pointer"
          >
            ✕
          </button>
        </div>

        <div className="p-5 flex flex-col gap-4 text-xs">
          <div className="grid grid-cols-2 gap-3 bg-slate-50 p-3 rounded-xl border border-slate-100">
            <div>
              <span className="text-slate-400 font-medium block">Horário</span>
              <span className="text-slate-900 font-bold text-sm">{appointment.startTime} ({appointment.durationMinutes} min)</span>
            </div>
            <div>
              <span className="text-slate-400 font-medium block">Status</span>
              <span className="text-emerald-700 font-bold text-xs bg-emerald-100 px-2 py-0.5 rounded-md inline-block mt-0.5">
                {appointment.status}
              </span>
            </div>
          </div>

          <div>
            <span className="text-slate-400 font-medium block">Procedimento</span>
            <span className="text-slate-800 font-semibold text-sm">{appointment.procedure}</span>
          </div>

          <div className="pt-2 flex flex-col gap-2">
            <a
              href={`https://wa.me/55${appointment.phone}`}
              target="_blank"
              rel="noreferrer"
              className="w-full h-10 bg-emerald-500 hover:bg-emerald-600 text-white font-semibold rounded-xl flex items-center justify-center gap-2 transition"
            >
              💬 Enviar Lembrete no WhatsApp
            </a>

            <div className="grid grid-cols-2 gap-2 mt-1">
              <button className="h-9 bg-slate-100 hover:bg-slate-200 text-slate-700 font-medium rounded-xl transition cursor-pointer">
                Editar Consulta
              </button>
              <button className="h-9 bg-red-50 hover:bg-red-100 text-red-600 font-medium rounded-xl transition cursor-pointer">
                Cancelar Horário
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}