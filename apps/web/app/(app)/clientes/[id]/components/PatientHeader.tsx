'use client';

import {
  ArrowLeft,
  Calendar,
  FileText,
  Mail,
  Pencil,
  Phone,
  Plus,
} from 'lucide-react';

import { Button } from '@/components/ui/button';
import { maskCpf, maskPhone } from '@/lib/masks';

type PatientHeaderProps = {
  patient: any;
  onBack: () => void;
  onEdit: () => void;
  onNewAppointment: () => void;
};

export function PatientHeader({
  patient,
  onBack,
  onEdit,
  onNewAppointment,
}: PatientHeaderProps) {
  const infoItems = [
    {
      icon: Phone,
      label: 'Contato',
      value: patient.phone ? maskPhone(patient.phone) : 'Não informado',
    },
    {
      icon: Mail,
      label: 'E-mail',
      value: patient.email || 'Não informado',
      truncate: true,
    },
    {
      icon: FileText,
      label: 'CPF',
      value: patient.cpf ? maskCpf(patient.cpf) : 'Não informado',
    },
    {
      icon: Calendar,
      label: 'Nascimento',
      value: patient.birthDate
        ? new Date(patient.birthDate).toLocaleDateString('pt-BR', {
            timeZone: 'UTC',
          })
        : 'Não informada',
    },
  ];

  return (
    <div className="flex flex-col gap-5 mb-2">
      {/* Botão Voltar */}
      <button
        onClick={onBack}
        className="text-xs font-medium text-muted-foreground hover:text-foreground flex items-center gap-1.5 transition-colors cursor-pointer w-fit group"
      >
        <ArrowLeft className="w-3.5 h-3.5 transition-transform group-hover:-translate-x-0.5" />
        Voltar para Clientes
      </button>

      {/* Bloco Principal: Avatar, Nome e Ações */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-card p-5 rounded-2xl border border-border/60 shadow-xs">
        <div className="flex items-center gap-4">
          <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-primary/20 to-primary/5 text-primary flex items-center justify-center text-xl font-bold uppercase shrink-0 border border-primary/10 shadow-inner">
            {patient.name.charAt(0)}
          </div>

          <div className="space-y-1">
            <h1 className="text-2xl font-bold tracking-tight text-foreground">
              {patient.name}
            </h1>

            <div className="flex items-center gap-2 text-xs text-muted-foreground font-medium">
              <span className="bg-muted px-2 py-0.5 rounded-md text-foreground/80">
                Prontuário Eletrônico
              </span>
              {patient.createdAt && (
                <>
                  <span>•</span>
                  <span>Cliente desde {new Date(patient.createdAt).getFullYear()}</span>
                </>
              )}
            </div>
          </div>
        </div>

        {/* Botões de Ação */}
        <div className="flex items-center gap-2 self-end md:self-auto">
          <Button
            variant="outline"
            size="sm"
            className="gap-2 shadow-xs cursor-pointer"
            onClick={onEdit}
            title="Editar Perfil"
          >
            <Pencil className="w-3.5 h-3.5" />
            <span className="inline">Editar Perfil</span>
          </Button>

          <Button
            size="sm"
            className="gap-2 shadow-xs cursor-pointer"
            onClick={onNewAppointment}
          >
            <Plus className="w-4 h-4" />
            Novo Agendamento
          </Button>
        </div>
      </div>

      {/* Grid de Informações Compactas */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
        {infoItems.map(({ icon: Icon, label, value, truncate }) => (
          <div
            key={label}
            className="bg-card/50 hover:bg-card transition-colors p-3.5 rounded-xl border border-border/60 flex items-center gap-3"
          >
            <div className="w-9 h-9 rounded-lg bg-muted/80 text-muted-foreground flex items-center justify-center shrink-0">
              <Icon className="w-4 h-4" />
            </div>

            <div className="flex flex-col min-w-0">
              <span className="text-[10px] font-semibold text-muted-foreground uppercase tracking-wider">
                {label}
              </span>
              <span
                className={`text-xs font-medium text-foreground ${
                  truncate ? 'truncate' : ''
                }`}
              >
                {value}
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}