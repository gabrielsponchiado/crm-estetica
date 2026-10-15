'use client';

import { useEffect, useState } from 'react';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';

import {
  maskCpf,
  maskPhone,
  unmaskCpf,
  unmaskPhone,
} from '@/lib/masks';

import { fetcher } from '@/lib/api';

type EditPatientDialogProps = {
  patient: any;
  patientId: string;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSaved: () => Promise<void>;
};

export function EditPatientDialog({
  patient,
  patientId,
  open,
  onOpenChange,
  onSaved,
}: EditPatientDialogProps) {
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    email: '',
    cpf: '',
    birthDate: '',
  });

  useEffect(() => {
    if (!patient) return;

    setFormData({
      name: patient.name || '',
      phone: patient.phone || '',
      email: patient.email || '',
      cpf: patient.cpf || '',
      birthDate: patient.birthDate
        ? (new Date(patient.birthDate)
            .toISOString()
            .split('T')[0] ?? '')
        : '',
    });
  }, [patient, open]);

  const handleSubmit = async (
    event: React.FormEvent,
  ) => {
    event.preventDefault();

    try {
      await fetcher(`/patients/${patientId}`, {
        method: 'PATCH',
        body: JSON.stringify({
          ...formData,
          phone: unmaskPhone(formData.phone),
          cpf: unmaskCpf(formData.cpf),
          birthDate: formData.birthDate
            ? new Date(
                formData.birthDate,
              ).toISOString()
            : undefined,
        }),
      });

      await onSaved();
      onOpenChange(false);
    } catch (error) {
      console.error(
        'Erro ao atualizar paciente',
        error,
      );

      onOpenChange(false);
    }
  };

  return (
    <Dialog
      open={open}
      onOpenChange={onOpenChange}
    >
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>
            Editar Perfil
          </DialogTitle>

          <DialogDescription>
            Atualize as informações cadastrais de{' '}
            {patient.name.split(' ')[0]}.
          </DialogDescription>
        </DialogHeader>

        <form
          onSubmit={handleSubmit}
          className="space-y-5 py-4"
        >
          <div className="space-y-2">
            <Label htmlFor="edit-name">
              Nome Completo
            </Label>

            <Input
              id="edit-name"
              value={formData.name}
              onChange={(e) =>
                setFormData({
                  ...formData,
                  name: e.target.value,
                })
              }
              required
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="edit-cpf">
                CPF
              </Label>

              <Input
                id="edit-cpf"
                value={maskCpf(formData.cpf)}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    cpf: e.target.value,
                  })
                }
                placeholder="000.000.000-00"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="edit-birthDate">
                Nascimento
              </Label>

              <Input
                id="edit-birthDate"
                type="date"
                value={formData.birthDate}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    birthDate: e.target.value,
                  })
                }
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="edit-phone">
                Celular
              </Label>

              <Input
                id="edit-phone"
                value={maskPhone(formData.phone)}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    phone: e.target.value,
                  })
                }
                placeholder="(00) 00000-0000"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="edit-email">
                E-mail
              </Label>

              <Input
                id="edit-email"
                type="email"
                value={formData.email}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    email: e.target.value,
                  })
                }
                placeholder="email@exemplo.com"
              />
            </div>
          </div>

          <DialogFooter className="pt-4 border-t border-border">
            <Button
              type="button"
              variant="outline"
              onClick={() =>
                onOpenChange(false)
              }
            >
              Cancelar
            </Button>

            <Button type="submit">
              Salvar Alterações
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}