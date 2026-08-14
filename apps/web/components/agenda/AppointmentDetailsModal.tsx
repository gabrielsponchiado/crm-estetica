'use client';

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

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
  
  const statusLabels = {
    SCHEDULED: "Agendado",
    CONFIRMED: "Confirmado",
    IN_PROGRESS: "Em Atendimento",
    COMPLETED: "Concluído",
    CANCELLED: "Cancelado",
  };

  const statusColors = {
    SCHEDULED: "bg-amber-100 text-amber-800",
    CONFIRMED: "bg-emerald-100 text-emerald-800",
    IN_PROGRESS: "bg-rose-100 text-rose-800",
    COMPLETED: "bg-slate-100 text-slate-800",
    CANCELLED: "bg-red-100 text-red-800",
  };

  // Trata o telefone para remover parênteses, traços e espaços antes de enviar
  const handleOpenWhatsApp = () => {
    if (!appointment?.phone) return;
    const cleanPhone = appointment.phone.replace(/\D/g, '');
    window.open(`https://wa.me/55${cleanPhone}`, '_blank');
  };

  return (
    <Dialog open={!!appointment} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="sm:max-w-[425px] p-0 overflow-hidden">
        {appointment && (
          <>
            <DialogHeader className="px-6 pt-6 pb-4 border-b border-slate-100">
              <DialogTitle className="text-xl font-bold">{appointment.patientName}</DialogTitle>
              <DialogDescription>
                Detalhes do atendimento
              </DialogDescription>
            </DialogHeader>

            <div className="px-6 py-4 flex flex-col gap-5 text-sm">
              <div className="grid grid-cols-2 gap-4 bg-slate-50 p-4 rounded-xl border border-slate-100">
                <div className="flex flex-col gap-1">
                  <span className="text-slate-500 font-medium text-xs">Horário</span>
                  <span className="text-slate-900 font-bold">{appointment.startTime} ({appointment.durationMinutes} min)</span>
                </div>
                <div className="flex flex-col gap-1 items-start">
                  <span className="text-slate-500 font-medium text-xs">Status</span>
                  <Badge variant="secondary" className={`${statusColors[appointment.status]} font-bold`}>
                    {statusLabels[appointment.status]}
                  </Badge>
                </div>
              </div>

              <div className="flex flex-col gap-1">
                <span className="text-slate-500 font-medium text-xs">Procedimento</span>
                <span className="text-slate-900 font-semibold">{appointment.procedure}</span>
              </div>

              <div className="pt-2 flex flex-col gap-3">
                <Button 
                  onClick={handleOpenWhatsApp}
                  className="w-full bg-emerald-500 hover:bg-emerald-600 text-white shadow-sm font-semibold cursor-pointer"
                >
                  💬 Enviar Lembrete no WhatsApp
                </Button>

                <div className="grid grid-cols-2 gap-3">
                  <Button variant="outline" className="font-medium cursor-pointer">
                    Editar Consulta
                  </Button>
                  <Button variant="destructive" className="bg-red-50 text-red-600 hover:bg-red-100 hover:text-red-700 font-medium shadow-none cursor-pointer">
                    Cancelar Horário
                  </Button>
                </div>
              </div>
            </div>
          </>
        )}
      </DialogContent>
    </Dialog>
  );
}