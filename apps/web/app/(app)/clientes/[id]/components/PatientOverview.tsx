'use client';

import {
  Activity,
  ArrowRight,
  Calendar,
  Clock,
  DollarSign,
  FileText,
  Image as ImageIcon,
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
    className: 'bg-emerald-500/10 text-emerald-600 border-emerald-500/20',
  },
  CANCELED: {
    label: 'Cancelado',
    className: 'bg-rose-500/10 text-rose-600 border-rose-500/20',
  },
  CONFIRMED: {
    label: 'Confirmado',
    className: 'bg-blue-500/10 text-blue-600 border-blue-500/20',
  },
  SCHEDULED: {
    label: 'Agendado',
    className: 'bg-amber-500/10 text-amber-700 border-amber-500/20',
  },
  IN_PROGRESS: {
    label: 'Em andamento',
    className: 'bg-purple-500/10 text-purple-600 border-purple-500/20',
  },
  NO_SHOW: {
    label: 'Não compareceu',
    className: 'bg-slate-500/10 text-slate-600 border-slate-500/20',
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
        (acc: number, curr: any) => acc + Number(curr.totalValue),
        0,
      ) || 0;

  return (
    <div className="p-6 space-y-6">
      {/* Título da Seção */}
      <div>
        <h3 className="text-lg font-bold tracking-tight text-foreground">
          Visão Geral
        </h3>
        <p className="text-xs text-muted-foreground mt-0.5">
          Resumo das atividades e informações importantes do cliente.
        </p>
      </div>

      {/* Grid de Cards Resumo */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
        {/* Card 1: Último / Próximo Agendamento */}
        <div className="p-5 border border-border/60 rounded-2xl bg-card shadow-xs flex flex-col justify-between hover:border-border transition-colors group">
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                Último / Próximo
              </span>
              <div className="w-8 h-8 rounded-lg bg-primary/10 text-primary flex items-center justify-center">
                <Clock className="w-4 h-4" />
              </div>
            </div>

            {patient.appointments?.length > 0 ? (
              <div className="space-y-2 pt-1">
                <p className="font-semibold text-base text-foreground capitalize">
                  {patient.appointments[0].procedure?.name || 'Consulta'}
                </p>

                <p className="text-xs text-muted-foreground flex items-center gap-1.5 font-medium">
                  <Calendar className="w-3.5 h-3.5 text-muted-foreground/70" />
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

                <div className="pt-1">
                  <span
                    className={`inline-flex items-center gap-1.5 text-[11px] font-semibold px-2.5 py-0.5 rounded-full border ${
                      STATUS_CONFIG[patient.appointments[0].status]?.className || ''
                    }`}
                  >
                    <span className="w-1.5 h-1.5 rounded-full bg-current" />
                    {STATUS_CONFIG[patient.appointments[0].status]?.label ||
                      patient.appointments[0].status}
                  </span>
                </div>
              </div>
            ) : (
              <p className="text-xs text-muted-foreground pt-2">
                Nenhum agendamento registrado.
              </p>
            )}
          </div>

          <Button
            variant="ghost"
            size="sm"
            className="mt-5 justify-start text-xs font-semibold text-primary hover:text-primary hover:bg-primary/5 px-2 -ml-2 w-fit gap-1 group/btn cursor-pointer"
            onClick={() => onTabChange('appointments')}
          >
            Ver agendamentos
            <ArrowRight className="w-3.5 h-3.5 transition-transform group-hover/btn:translate-x-1" />
          </Button>
        </div>

        {/* Card 2: Procedimentos */}
        <div className="p-5 border border-border/60 rounded-2xl bg-card shadow-xs flex flex-col justify-between hover:border-border transition-colors group">
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                Procedimentos
              </span>
              <div className="w-8 h-8 rounded-lg bg-primary/10 text-primary flex items-center justify-center">
                <Sparkles className="w-4 h-4" />
              </div>
            </div>

            <div className="pt-1">
              <div className="flex items-baseline gap-2">
                <span className="text-3xl font-extrabold text-foreground tracking-tight">
                  {patient.procedures?.length || 0}
                </span>
                <span className="text-xs text-muted-foreground font-semibold uppercase tracking-wider">
                  Sessões
                </span>
              </div>

              {patient.procedures?.length > 0 ? (
                <p className="text-xs text-muted-foreground mt-2 flex items-center gap-1 font-medium">
                  <Clock className="w-3.5 h-3.5 text-muted-foreground/70" />
                  Último em{' '}
                  {new Date(
                    patient.procedures[0].performedAt,
                  ).toLocaleDateString('pt-BR')}
                </p>
              ) : (
                <p className="text-xs text-muted-foreground mt-2">
                  Nenhum procedimento realizado ainda.
                </p>
              )}
            </div>
          </div>

          <Button
            variant="ghost"
            size="sm"
            className="mt-5 justify-start text-xs font-semibold text-primary hover:text-primary hover:bg-primary/5 px-2 -ml-2 w-fit gap-1 group/btn cursor-pointer"
            onClick={() => onTabChange('procedures')}
          >
            Ver histórico
            <ArrowRight className="w-3.5 h-3.5 transition-transform group-hover/btn:translate-x-1" />
          </Button>
        </div>

        {/* Card 3: Total Investido */}
        <div className="p-5 border border-border/60 rounded-2xl bg-card shadow-xs flex flex-col justify-between hover:border-border transition-colors group">
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                Total Investido
              </span>
              <div className="w-8 h-8 rounded-lg bg-emerald-500/10 text-emerald-600 flex items-center justify-center">
                <DollarSign className="w-4 h-4" />
              </div>
            </div>

            <div className="pt-1">
              <p className="text-3xl font-extrabold text-foreground tracking-tight">
                R${' '}
                {approvedQuotesTotal.toLocaleString('pt-BR', {
                  minimumFractionDigits: 2,
                })}
              </p>
              <p className="text-xs text-muted-foreground mt-1 font-medium">
                Orçamentos aprovados
              </p>
            </div>
          </div>

          <Button
            variant="ghost"
            size="sm"
            className="mt-5 justify-start text-xs font-semibold text-primary hover:text-primary hover:bg-primary/5 px-2 -ml-2 w-fit gap-1 group/btn cursor-pointer"
            onClick={() => onTabChange('quotes')}
          >
            Ver orçamentos
            <ArrowRight className="w-3.5 h-3.5 transition-transform group-hover/btn:translate-x-1" />
          </Button>
        </div>
      </div>

      {/* Seção: Ações Rápidas */}
      <div className="pt-6 border-t border-border/60 space-y-3">
        <h4 className="text-xs font-bold uppercase tracking-wider text-muted-foreground flex items-center gap-2">
          <Activity className="w-4 h-4 text-primary" />
          Ações Rápidas
        </h4>

        <div className="flex flex-wrap gap-2.5">
          <Button
            variant="outline"
            size="sm"
            className="gap-2 shadow-2xs hover:bg-muted/80 cursor-pointer text-xs font-medium"
            onClick={() => onTabChange('anamnesis')}
          >
            <FileText className="w-3.5 h-3.5 text-muted-foreground" />
            Atualizar Anamnese
          </Button>

          <Button
            variant="outline"
            size="sm"
            className="gap-2 shadow-2xs hover:bg-muted/80 cursor-pointer text-xs font-medium"
            onClick={onNewAppointment}
          >
            <Plus className="w-3.5 h-3.5 text-muted-foreground" />
            Novo Agendamento
          </Button>

          <Button
            variant="outline"
            size="sm"
            className="gap-2 shadow-2xs hover:bg-muted/80 cursor-pointer text-xs font-medium"
            onClick={() => onTabChange('photos')}
          >
            <ImageIcon className="w-3.5 h-3.5 text-muted-foreground" />
            Adicionar Fotos
          </Button>
        </div>
      </div>
    </div>
  );
}