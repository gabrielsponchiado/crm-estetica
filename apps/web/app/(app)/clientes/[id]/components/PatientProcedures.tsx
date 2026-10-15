'use client';

import {
  Calendar,
  Clock,
  Plus,
  Sparkles,
} from 'lucide-react';

import { Button } from '@/components/ui/button';

type PatientProceduresProps = {
  patient: any;
  onNewAppointment: () => void;
};

export function PatientProcedures({
  patient,
  onNewAppointment,
}: PatientProceduresProps) {
  return (
    <div className="p-6">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h3 className="text-base font-semibold text-foreground">
            Procedimentos Realizados
          </h3>

          <p className="text-sm text-muted-foreground mt-0.5">
            Histórico de sessões e tratamentos estéticos aplicados.
          </p>
        </div>

        <Button
          size="sm"
          className="gap-2"
          onClick={onNewAppointment}
        >
          <Plus className="w-4 h-4" />
          Agendar Procedimento
        </Button>
      </div>

      {patient.procedures?.length > 0 ? (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {patient.procedures.map((pp: any) => (
            <div
              key={pp.id}
              className="p-4 border rounded-xl bg-background"
            >
              <p className="font-semibold text-sm text-foreground">
                {pp.procedure?.name || 'Procedimento'}
              </p>

              <div className="mt-3 space-y-1.5">
                <p className="text-xs text-muted-foreground flex items-center gap-2">
                  <Clock className="w-3.5 h-3.5 shrink-0" />

                  Realizado em:{' '}
                  {new Date(
                    pp.performedAt,
                  ).toLocaleDateString('pt-BR')}
                </p>

                {pp.nextReturnAt && (
                  <p className="text-xs text-orange-500 font-medium flex items-center gap-2">
                    <Calendar className="w-3.5 h-3.5 shrink-0" />

                    Retorno:{' '}
                    {new Date(
                      pp.nextReturnAt,
                    ).toLocaleDateString('pt-BR')}
                  </p>
                )}
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="text-center py-16 text-muted-foreground border border-dashed rounded-xl bg-muted/20">
          <Sparkles className="w-10 h-10 mx-auto mb-3 opacity-40" />

          <p className="font-medium">
            Nenhum procedimento registrado
          </p>

          <p className="text-xs mt-1 opacity-70">
            Agende um procedimento para iniciar o histórico
          </p>
        </div>
      )}
    </div>
  );
}