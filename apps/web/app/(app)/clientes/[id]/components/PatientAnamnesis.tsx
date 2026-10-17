'use client';

import { useEffect, useState } from 'react';

import {
  Activity,
  AlertCircle,
  AlertTriangle,
  CheckCircle2,
  Edit2,
  FileText,
  Loader2,
  Pill,
  Save,
  ShieldAlert,
} from 'lucide-react';

import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { fetcher } from '@/lib/api';

type AnamnesisData = {
  alergias: string;
  medicacoes: string;
  condicoes: string;
  contraindicacoes: string;
  observacoes: string;
};

const EMPTY_ANAMNESIS: AnamnesisData = {
  alergias: '',
  medicacoes: '',
  condicoes: '',
  contraindicacoes: '',
  observacoes: '',
};

type PatientAnamnesisProps = {
  patient: any;
  patientId: string;
  onRefresh: () => Promise<void>;
};

export function PatientAnamnesis({
  patient,
  patientId,
  onRefresh,
}: PatientAnamnesisProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [form, setForm] = useState<AnamnesisData>(EMPTY_ANAMNESIS);
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    const data = patient?.anamnesis;

    if (data && typeof data === 'object') {
      setForm({
        alergias: data.alergias || '',
        medicacoes: data.medicacoes || '',
        condicoes: data.condicoes || '',
        contraindicacoes: data.contraindicacoes || '',
        observacoes: data.observacoes || '',
      });
    } else {
      setForm(EMPTY_ANAMNESIS);
    }
  }, [patient]);

  const hasContent = Object.values(form).some(
    (value) => value.trim() !== '',
  );

  const handleSave = async () => {
    setIsSaving(true);

    try {
      await fetcher(`/patients/${patientId}`, {
        method: 'PATCH',
        body: JSON.stringify({
          anamnesis: form,
        }),
      });

      await onRefresh();
      setIsEditing(false);
    } catch (error) {
      console.error('Erro ao salvar anamnese:', error);
    } finally {
      setIsSaving(false);
    }
  };

  const handleCancel = () => {
    const previous = patient?.anamnesis;

    if (previous && typeof previous === 'object') {
      setForm({
        alergias: previous.alergias || '',
        medicacoes: previous.medicacoes || '',
        condicoes: previous.condicoes || '',
        contraindicacoes: previous.contraindicacoes || '',
        observacoes: previous.observacoes || '',
      });
    } else {
      setForm(EMPTY_ANAMNESIS);
    }

    setIsEditing(false);
  };

  return (
    <div className="flex flex-col">
      {/* Conteúdo com padding interno seguro */}
      <div className="p-6 md:p-8 space-y-6">
        {/* Header do Bloco */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h3 className="text-lg font-bold tracking-tight text-foreground">
              Ficha de Anamnese
            </h3>
            <p className="text-xs text-muted-foreground mt-0.5">
              Histórico de saúde, alergias, medicações e contraindicações médicas.
            </p>
          </div>

          {!isEditing && (
            <Button
              variant="outline"
              size="sm"
              onClick={() => setIsEditing(true)}
            >
              <Edit2 />
              {hasContent ? 'Editar Ficha' : 'Preencher Ficha'}
            </Button>
          )}
        </div>

        {/* Banner Informativo no modo leitura */}
        {!isEditing && (form.alergias || form.contraindicacoes) && (
          <div className="p-3.5 rounded-xl bg-amber-500/10 border border-amber-500/20 text-amber-800 dark:text-amber-300 flex items-center gap-3 text-xs font-medium">
            <AlertTriangle className="w-4 h-4 shrink-0 text-amber-600 dark:text-amber-400" />
            <span>Atenção: Este paciente possui alertas de alergia ou contraindicações cadastradas.</span>
          </div>
        )}

        {isEditing ? (
          /* MODO DE EDIÇÃO */
          <div className="space-y-5">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <Label htmlFor="alergias" className="text-xs font-bold text-foreground uppercase tracking-wider flex items-center gap-1.5">
                  <AlertCircle className="w-3.5 h-3.5 text-rose-500" />
                  Alergias conhecidas
                </Label>
                <Textarea
                  id="alergias"
                  value={form.alergias}
                  onChange={(e) =>
                    setForm((prev) => ({ ...prev, alergias: e.target.value }))
                  }
                  placeholder="Ex: Penicilina, látex, níquel..."
                  className="min-h-[70px] resize-none text-xs rounded-xl focus-visible:ring-primary/20"
                />
              </div>

              <div className="space-y-1.5">
                <Label htmlFor="medicacoes" className="text-xs font-bold text-foreground uppercase tracking-wider flex items-center gap-1.5">
                  <Pill className="w-3.5 h-3.5 text-blue-500" />
                  Medicamentos em uso
                </Label>
                <Textarea
                  id="medicacoes"
                  value={form.medicacoes}
                  onChange={(e) =>
                    setForm((prev) => ({ ...prev, medicacoes: e.target.value }))
                  }
                  placeholder="Ex: Losartana 50mg, metformina 850mg..."
                  className="min-h-[70px] resize-none text-xs rounded-xl focus-visible:ring-primary/20"
                />
              </div>

              <div className="space-y-1.5">
                <Label htmlFor="condicoes" className="text-xs font-bold text-foreground uppercase tracking-wider flex items-center gap-1.5">
                  <Activity className="w-3.5 h-3.5 text-amber-500" />
                  Condições de saúde
                </Label>
                <Textarea
                  id="condicoes"
                  value={form.condicoes}
                  onChange={(e) =>
                    setForm((prev) => ({ ...prev, condicoes: e.target.value }))
                  }
                  placeholder="Ex: Diabetes tipo 2, hipertensão, hipotireoidismo..."
                  className="min-h-[70px] resize-none text-xs rounded-xl focus-visible:ring-primary/20"
                />
              </div>

              <div className="space-y-1.5">
                <Label htmlFor="contraindicacoes" className="text-xs font-bold text-foreground uppercase tracking-wider flex items-center gap-1.5">
                  <ShieldAlert className="w-3.5 h-3.5 text-purple-500" />
                  Contraindicações para procedimentos
                </Label>
                <Textarea
                  id="contraindicacoes"
                  value={form.contraindicacoes}
                  onChange={(e) =>
                    setForm((prev) => ({ ...prev, contraindicacoes: e.target.value }))
                  }
                  placeholder="Ex: Gravidez, marca-passo, epilepsia..."
                  className="min-h-[70px] resize-none text-xs rounded-xl focus-visible:ring-primary/20"
                />
              </div>

              <div className="space-y-1.5 md:col-span-2">
                <Label htmlFor="observacoes" className="text-xs font-bold text-foreground uppercase tracking-wider flex items-center gap-1.5">
                  <FileText className="w-3.5 h-3.5 text-slate-500" />
                  Observações gerais
                </Label>
                <Textarea
                  id="observacoes"
                  value={form.observacoes}
                  onChange={(e) =>
                    setForm((prev) => ({ ...prev, observacoes: e.target.value }))
                  }
                  placeholder="Informações adicionais relevantes..."
                  className="min-h-[70px] resize-none text-xs rounded-xl focus-visible:ring-primary/20"
                />
              </div>
            </div>
          </div>
        ) : hasContent ? (
          /* MODO LEITURA */
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {(
              [
                {
                  field: 'alergias',
                  label: 'Alergias',
                  icon: AlertCircle,
                  bgColor: 'bg-rose-500/10 text-rose-600',
                  borderColor: 'border-rose-500/20',
                },
                {
                  field: 'medicacoes',
                  label: 'Medicamentos em uso',
                  icon: Pill,
                  bgColor: 'bg-blue-500/10 text-blue-600',
                  borderColor: 'border-border/60',
                },
                {
                  field: 'condicoes',
                  label: 'Condições de saúde',
                  icon: Activity,
                  bgColor: 'bg-amber-500/10 text-amber-600',
                  borderColor: 'border-border/60',
                },
                {
                  field: 'contraindicacoes',
                  label: 'Contraindicações',
                  icon: ShieldAlert,
                  bgColor: 'bg-purple-500/10 text-purple-600',
                  borderColor: 'border-purple-500/20',
                },
                {
                  field: 'observacoes',
                  label: 'Observações gerais',
                  icon: CheckCircle2,
                  bgColor: 'bg-slate-500/10 text-slate-600',
                  borderColor: 'border-border/60',
                },
              ] as const
            ).map(({ field, label, icon: Icon, bgColor, borderColor }) => {
              const value = form[field];

              if (!value) return null;

              return (
                <div
                  key={field}
                  className={`p-4 rounded-2xl bg-card border ${borderColor} shadow-2xs flex flex-col gap-2 transition-all hover:border-border`}
                >
                  <div className="flex items-center gap-2">
                    <div className={`w-7 h-7 rounded-lg ${bgColor} flex items-center justify-center shrink-0`}>
                      <Icon className="w-3.5 h-3.5" />
                    </div>
                    <span className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
                      {label}
                    </span>
                  </div>

                  <p className="text-xs text-foreground font-medium whitespace-pre-wrap leading-relaxed pl-9">
                    {value}
                  </p>
                </div>
              );
            })}
          </div>
        ) : (
          /* ESTADO VAZIO */
          <div className="text-center py-16 px-4 border border-dashed border-border/80 rounded-2xl bg-muted/20 space-y-3">
            <div className="w-12 h-12 rounded-2xl bg-muted flex items-center justify-center mx-auto text-muted-foreground/60">
              <FileText className="w-6 h-6" />
            </div>
            <div className="space-y-1">
              <p className="text-sm font-semibold text-foreground">
                Ficha de anamnese não preenchida
              </p>
              <p className="text-xs text-muted-foreground">
                Clique em "Preencher Ficha" para registrar o histórico de saúde do cliente.
              </p>
            </div>
            <Button
              variant="outline"
              size="sm"
              onClick={() => setIsEditing(true)}
              className="mt-2"
            >
              Preencher Ficha Agora
            </Button>
          </div>
        )}
      </div>

      {/* Footer Fixo de Ações durante a edição com fundo contido no card */}
      {isEditing && (
        <div className="px-6 md:px-8 py-4 bg-muted/30 border-t border-border/60 flex items-center gap-2">
          <Button
            onClick={handleSave}
            disabled={isSaving}
            size="default"
          >
            {isSaving ? (
              <Loader2 className="animate-spin" />
            ) : (
              <Save />
            )}
            Salvar Anamnese
          </Button>

          <Button
            variant="outline"
            size="default"
            onClick={handleCancel}
            disabled={isSaving}
          >
            Cancelar
          </Button>
        </div>
      )}
    </div>
  );
}