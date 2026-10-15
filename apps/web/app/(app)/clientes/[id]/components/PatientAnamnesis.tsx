'use client';

import { useEffect, useState } from 'react';

import {
  Activity,
  AlertCircle,
  CheckCircle,
  Edit2,
  FileText,
  Loader2,
  Save,
  XCircle,
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
  const [form, setForm] =
    useState<AnamnesisData>(EMPTY_ANAMNESIS);
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    const data = patient?.anamnesis;

    if (data && typeof data === 'object') {
      setForm({
        alergias: data.alergias || '',
        medicacoes: data.medicacoes || '',
        condicoes: data.condicoes || '',
        contraindicacoes:
          data.contraindicacoes || '',
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
      console.error(
        'Erro ao salvar anamnese:',
        error,
      );
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
        contraindicacoes:
          previous.contraindicacoes || '',
        observacoes: previous.observacoes || '',
      });
    } else {
      setForm(EMPTY_ANAMNESIS);
    }

    setIsEditing(false);
  };

  return (
    <div className="p-6">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h3 className="text-base font-semibold text-foreground">
            Ficha de Anamnese
          </h3>

          <p className="text-sm text-muted-foreground mt-0.5">
            Histórico de saúde, alergias, medicações e
            contraindicações.
          </p>
        </div>

        {!isEditing && (
          <Button
            variant="outline"
            size="sm"
            className="gap-2"
            onClick={() => setIsEditing(true)}
          >
            <Edit2 className="w-4 h-4" />

            {hasContent
              ? 'Editar Ficha'
              : 'Preencher Ficha'}
          </Button>
        )}
      </div>

      {isEditing ? (
        <div className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            <div className="space-y-1.5">
              <Label
                htmlFor="alergias"
                className="text-sm font-medium"
              >
                Alergias conhecidas
              </Label>

              <Textarea
                id="alergias"
                value={form.alergias}
                onChange={(e) =>
                  setForm((prev) => ({
                    ...prev,
                    alergias: e.target.value,
                  }))
                }
                placeholder="Ex: penicilina, látex, níquel..."
                className="min-h-[80px] resize-none text-sm"
              />
            </div>

            <div className="space-y-1.5">
              <Label
                htmlFor="medicacoes"
                className="text-sm font-medium"
              >
                Medicamentos em uso
              </Label>

              <Textarea
                id="medicacoes"
                value={form.medicacoes}
                onChange={(e) =>
                  setForm((prev) => ({
                    ...prev,
                    medicacoes: e.target.value,
                  }))
                }
                placeholder="Ex: losartana 50mg, metformina 850mg..."
                className="min-h-[80px] resize-none text-sm"
              />
            </div>

            <div className="space-y-1.5">
              <Label
                htmlFor="condicoes"
                className="text-sm font-medium"
              >
                Condições de saúde
              </Label>

              <Textarea
                id="condicoes"
                value={form.condicoes}
                onChange={(e) =>
                  setForm((prev) => ({
                    ...prev,
                    condicoes: e.target.value,
                  }))
                }
                placeholder="Ex: diabetes tipo 2, hipertensão, hipotireoidismo..."
                className="min-h-[80px] resize-none text-sm"
              />
            </div>

            <div className="space-y-1.5">
              <Label
                htmlFor="contraindicacoes"
                className="text-sm font-medium"
              >
                Contraindicações para procedimentos
              </Label>

              <Textarea
                id="contraindicacoes"
                value={form.contraindicacoes}
                onChange={(e) =>
                  setForm((prev) => ({
                    ...prev,
                    contraindicacoes: e.target.value,
                  }))
                }
                placeholder="Ex: gravidez, marca-passo, epilepsia..."
                className="min-h-[80px] resize-none text-sm"
              />
            </div>

            <div className="space-y-1.5 md:col-span-2">
              <Label
                htmlFor="observacoes"
                className="text-sm font-medium"
              >
                Observações gerais
              </Label>

              <Textarea
                id="observacoes"
                value={form.observacoes}
                onChange={(e) =>
                  setForm((prev) => ({
                    ...prev,
                    observacoes: e.target.value,
                  }))
                }
                placeholder="Informações adicionais relevantes..."
                className="min-h-[80px] resize-none text-sm"
              />
            </div>
          </div>

          <div className="flex gap-3 pt-4 border-t border-border">
            <Button
              onClick={handleSave}
              disabled={isSaving}
              className="gap-2"
            >
              {isSaving ? (
                <Loader2 className="w-4 h-4 animate-spin" />
              ) : (
                <Save className="w-4 h-4" />
              )}

              Salvar Anamnese
            </Button>

            <Button
              variant="outline"
              onClick={handleCancel}
              disabled={isSaving}
            >
              Cancelar
            </Button>
          </div>
        </div>
      ) : hasContent ? (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {(
            [
              {
                field: 'alergias',
                label: 'Alergias',
                icon: AlertCircle,
                color: 'text-red-500',
              },
              {
                field: 'medicacoes',
                label: 'Medicamentos em uso',
                icon: FileText,
                color: 'text-blue-500',
              },
              {
                field: 'condicoes',
                label: 'Condições de saúde',
                icon: Activity,
                color: 'text-orange-500',
              },
              {
                field: 'contraindicacoes',
                label: 'Contraindicações',
                icon: XCircle,
                color: 'text-yellow-600',
              },
              {
                field: 'observacoes',
                label: 'Observações gerais',
                icon: CheckCircle,
                color: 'text-muted-foreground',
              },
            ] as {
              field: keyof AnamnesisData;
              label: string;
              icon: any;
              color: string;
            }[]
          ).map(
            ({
              field,
              label,
              icon: Icon,
              color,
            }) => {
              const value = form[field];

              if (!value) return null;

              return (
                <div
                  key={field}
                  className="p-4 border rounded-xl bg-background"
                >
                  <div
                    className={`flex items-center gap-2 mb-2 ${color}`}
                  >
                    <Icon className="w-4 h-4" />

                    <span className="text-xs font-semibold uppercase tracking-wider text-foreground">
                      {label}
                    </span>
                  </div>

                  <p className="text-sm text-foreground whitespace-pre-wrap leading-relaxed">
                    {value}
                  </p>
                </div>
              );
            },
          )}
        </div>
      ) : (
        <div className="text-center py-16 text-muted-foreground border border-dashed rounded-xl bg-muted/20">
          <FileText className="w-10 h-10 mx-auto mb-3 opacity-40" />

          <p className="font-medium">
            Ficha de anamnese não preenchida
          </p>

          <p className="text-xs mt-1 opacity-70">
            Clique em "Preencher Ficha" para iniciar
          </p>
        </div>
      )}
    </div>
  );
}