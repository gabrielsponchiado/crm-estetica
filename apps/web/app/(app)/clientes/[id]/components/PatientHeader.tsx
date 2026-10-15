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
  const infoCards = [
    {
      icon: Phone,
      label: 'Contato',
      value: patient.phone
        ? maskPhone(patient.phone)
        : 'Não informado',
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
      value: patient.cpf
        ? maskCpf(patient.cpf)
        : 'Não informado',
    },
    {
      icon: Calendar,
      label: 'Nascimento',
      value: patient.birthDate
        ? new Date(patient.birthDate).toLocaleDateString(
            'pt-BR',
            { timeZone: 'UTC' },
          )
        : 'Não informada',
    },
  ];

  return (
    <div className="flex flex-col gap-6 mb-2">
      <button
        onClick={onBack}
        className="text-sm font-medium text-muted-foreground hover:text-foreground flex items-center gap-2 transition-colors cursor-pointer w-fit"
      >
        <ArrowLeft className="w-4 h-4" />
        Voltar para Clientes
      </button>

      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div className="flex items-center gap-4">
          <div className="w-16 h-16 rounded-full bg-primary/10 text-primary flex items-center justify-center text-xl font-bold uppercase shrink-0">
            {patient.name.charAt(0)}
          </div>

          <div>
            <h1 className="text-3xl font-bold tracking-tight text-foreground">
              {patient.name}
            </h1>

            <p className="text-sm text-muted-foreground mt-1 flex items-center gap-2">
              <span>Prontuário Eletrônico</span>

              {patient.createdAt && (
                <>
                  <span>•</span>

                  <span>
                    Cliente desde{' '}
                    {new Date(patient.createdAt).getFullYear()}
                  </span>
                </>
              )}
            </p>
          </div>
        </div>

        <div className="flex flex-wrap gap-2">
          <Button
            variant="outline"
            className="gap-2 shadow-sm hidden sm:flex"
            onClick={onEdit}
          >
            <Pencil className="w-4 h-4" />
            Editar Perfil
          </Button>

          <Button
            className="gap-2 shadow-sm"
            onClick={onNewAppointment}
          >
            <Plus className="w-4 h-4" />
            Novo Agendamento
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {infoCards.map(
          ({ icon: Icon, label, value, truncate }) => (
            <div
              key={label}
              className="bg-card p-4 rounded-xl border border-border shadow-xs flex flex-col gap-1"
            >
              <div className="flex items-center gap-2 text-muted-foreground mb-1">
                <Icon className="w-4 h-4" />

                <span className="text-xs font-medium uppercase tracking-wider">
                  {label}
                </span>
              </div>

              <span
                className={`text-sm font-semibold text-foreground ${
                  truncate ? 'truncate' : ''
                }`}
              >
                {value}
              </span>
            </div>
          ),
        )}
      </div>
    </div>
  );
}