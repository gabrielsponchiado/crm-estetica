'use client';

import {
  Activity,
  Calendar,
  Clock,
  DollarSign,
  FileText,
  Image,
  Plus,
  Sparkles,
} from 'lucide-react';

import { Button } from '@/components/ui/button';

const STATUS_CONFIG: Record<
  string,
  { label: string; className: string }
> = {
  COMPLETED: {
    label: 'Finalizado',
    className:
      'bg-green-100 text-green-700 border-green-200',
  },
  CANCELED: {
    label: 'Cancelado',
    className:
      'bg-red-100 text-red-700 border-red-200',
  },
  CONFIRMED: {
    label: 'Confirmado',
    className:
      'bg-blue-100 text-blue-700 border-blue-200',
  },
  SCHEDULED: {
    label: 'Agendado',
    className:
      'bg-orange-100 text-orange-700 border-orange-200',
  },
  IN_PROGRESS: {
    label: 'Em andamento',
    className:
      'bg-purple-100 text-purple-700 border-purple-200',
  },
  NO_SHOW: {
    label: 'Não compareceu',
    className:
      'bg-gray-100 text-gray-600 border-gray-200',
  },
};

type PatientOverviewProps = {
  patient: any;
  onTabChange: (
    tab:
      | 'anamnesis'
      | 'procedures'
      | 'photos'
      | 'quotes'
      | 'appointments',
  ) => void;
  onNewAppointment: () => void;
};

export function PatientOverview({
  patient,
  onTabChange,
  onNewAppointment,
}: PatientOverviewProps) {
  const approvedQuotesTotal =
    patient.quotes
      ?.filter((q: any) => q.status === 'APPROVED')
      .reduce(
        (acc: number, curr: any) =>
          acc + Number(curr.totalValue),
        0,
      ) || 0;

  return (
    <div className="p-6 space-y-6">
      <div>
        <h3 className="text-base font-semibold text-foreground">
          Visão Geral
        </h3>

        <p className="text-sm text-muted-foreground mt-0.5">
          Resumo das atividades e informações importantes.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="p-5 border rounded-xl bg-background flex flex-col justify-between">
          <div>
            <div className="flex items-center gap-2 text-primary mb-3">
              <Clock className="w-4 h-4" />

              <h4 className="font-semibold text-sm text-foreground">
                Último / Próximo
              </h4>
            </div>

            {patient.appointments?.length > 0 ? (
              <div>
                <p className="font-medium text-sm text-foreground">
                  {patient.appointments[0].procedure?.name ||
                    'Consulta'}
                </p>

                <p className="text-xs text-muted-foreground mt-1 flex items-center gap-1.5">
                  <Calendar className="w-3.5 h-3.5" />

                  {new Date(
                    patient.appointments[0].scheduledAt,
                  ).toLocaleDateString('pt-BR')}{' '}
                  às{' '}
                  {new Date(
                    patient.appointments[0].scheduledAt,
                  ).toLocaleTimeString('pt-BR', {
                    hour: '2-digit',
                    minute: '2-digit',
                  })}
                </p>

                <span
                  className={`inline-block mt-3 text-[10px] uppercase tracking-wider px-2.5 py-1 rounded-full font-bold border ${
                    STATUS_CONFIG[
                      patient.appointments[0].status
                    ]?.className || ''
                  }`}
                >
                  {STATUS_CONFIG[
                    patient.appointments[0].status
                  ]?.label ||
                    patient.appointments[0].status}
                </span>
              </div>
            ) : (
              <p className="text-sm text-muted-foreground">
                Nenhum agendamento registrado.
              </p>
            )}
          </div>

          <Button
            variant="ghost"
            size="sm"
            className="mt-4 justify-start text-xs text-primary hover:text-primary/80 px-0"
            onClick={() => onTabChange('appointments')}
          >
            Ver agendamentos →
          </Button>
        </div>

        <div className="p-5 border rounded-xl bg-background flex flex-col justify-between">
          <div>
            <div className="flex items-center gap-2 text-primary mb-3">
              <Sparkles className="w-4 h-4" />

              <h4 className="font-semibold text-sm text-foreground">
                Procedimentos
              </h4>
            </div>

            <div className="flex items-baseline gap-2 mt-4">
              <span className="text-4xl font-bold text-foreground">
                {patient.procedures?.length || 0}
              </span>

              <span className="text-xs text-muted-foreground font-medium uppercase tracking-wide">
                Sessões
              </span>
            </div>

            {patient.procedures?.length > 0 && (
              <p className="text-xs text-muted-foreground mt-2 flex items-center gap-1">
                <Clock className="w-3.5 h-3.5" />

                Último em{' '}
                {new Date(
                  patient.procedures[0].performedAt,
                ).toLocaleDateString('pt-BR')}
              </p>
            )}
          </div>

          <Button
            variant="ghost"
            size="sm"
            className="mt-4 justify-start text-xs text-primary hover:text-primary/80 px-0"
            onClick={() => onTabChange('procedures')}
          >
            Ver histórico →
          </Button>
        </div>

        <div className="p-5 border rounded-xl bg-background flex flex-col justify-between">
          <div>
            <div className="flex items-center gap-2 text-primary mb-3">
              <DollarSign className="w-4 h-4" />

              <h4 className="font-semibold text-sm text-foreground">
                Total Investido
              </h4>
            </div>

            <p className="font-bold text-3xl text-foreground mt-4">
              R${' '}
              {approvedQuotesTotal.toLocaleString('pt-BR', {
                minimumFractionDigits: 2,
              })}
            </p>

            <p className="text-xs text-muted-foreground mt-1">
              Orçamentos aprovados
            </p>
          </div>

          <Button
            variant="ghost"
            size="sm"
            className="mt-4 justify-start text-xs text-primary hover:text-primary/80 px-0"
            onClick={() => onTabChange('quotes')}
          >
            Ver orçamentos →
          </Button>
        </div>
      </div>

      <div className="pt-5 border-t border-border">
        <h4 className="text-sm font-semibold text-foreground mb-3 flex items-center gap-2">
          <Activity className="w-4 h-4 text-primary" />
          Ações Rápidas
        </h4>

        <div className="flex flex-wrap gap-3">
          <Button
            variant="outline"
            size="sm"
            className="gap-2"
            onClick={() => onTabChange('anamnesis')}
          >
            <FileText className="w-4 h-4" />
            Atualizar Anamnese
          </Button>

          <Button
            variant="outline"
            size="sm"
            className="gap-2"
            onClick={onNewAppointment}
          >
            <Plus className="w-4 h-4" />
            Novo Agendamento
          </Button>

          <Button
            variant="outline"
            size="sm"
            className="gap-2"
            onClick={() => onTabChange('photos')}
          >
            <Image className="w-4 h-4" />
            Adicionar Fotos
          </Button>
        </div>
      </div>
    </div>
  );
}