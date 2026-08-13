"use client";

import { useState, useEffect } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { FormField } from "@/components/ui/form-field";
import { UserPlus, Edit3, Loader2, MapPin } from "lucide-react";
import { maskCpf, maskPhone, maskCep } from "@/lib/masks";
import { isValidCpf, isValidPhone } from "@/lib/validations/patient";
import type { Patient, CreatePatientInput, PatientFormErrors } from "@/types/patient";

interface PatientModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (data: CreatePatientInput) => Promise<boolean | void> | void;
  initialData?: Patient | null;
  isSubmitting?: boolean;
}

export function PatientModal({
  isOpen,
  onClose,
  onSave,
  initialData,
  isSubmitting = false,
}: PatientModalProps) {
  // Dados Pessoais
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");
  const [cpf, setCpf] = useState("");
  const [birthDate, setBirthDate] = useState("");

  // Endereço Detalhado
  const [zipCode, setZipCode] = useState("");
  const [street, setStreet] = useState("");
  const [number, setNumber] = useState("");
  const [neighborhood, setNeighborhood] = useState("");
  const [city, setCity] = useState("");
  const [state, setState] = useState("");

  const [errors, setErrors] = useState<PatientFormErrors>({});

  const isEditing = Boolean(initialData);

  useEffect(() => {
    if (isOpen) {
      setErrors({});
      if (initialData) {
        setName(initialData.name ?? "");
        setPhone(maskPhone(initialData.phone ?? ""));
        setEmail(initialData.email ?? "");
        setCpf(maskCpf(initialData.cpf ?? ""));
        setBirthDate(
          initialData.birthDate
            ? String(initialData.birthDate).slice(0, 10)
            : ""
        );
        setStreet(initialData.address ?? "");
        setZipCode("");
        setNumber("");
        setNeighborhood("");
        setCity("");
        setState("");
      } else {
        setName("");
        setPhone("");
        setEmail("");
        setCpf("");
        setBirthDate("");
        setZipCode("");
        setStreet("");
        setNumber("");
        setNeighborhood("");
        setCity("");
        setState("");
      }
    }
  }, [isOpen, initialData]);

  const validateForm = (): boolean => {
    const newErrors: PatientFormErrors = {};

    if (!name.trim()) {
      newErrors.name = "Por favor, informe o nome do cliente.";
    }

    if (!phone.trim()) {
      newErrors.phone = "Por favor, informe o telefone/WhatsApp.";
    } else if (!isValidPhone(phone)) {
      newErrors.phone = "Telefone inválido. Use (00) 00000-0000.";
    }

    if (cpf.trim() && !isValidCpf(cpf)) {
      newErrors.cpf = "CPF inválido.";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handlePhoneChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const masked = maskPhone(e.target.value);
    setPhone(masked);
    if (errors.phone) setErrors((prev) => ({ ...prev, phone: undefined }));
  };

  const handleCpfChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const masked = maskCpf(e.target.value);
    setCpf(masked);
    if (errors.cpf) setErrors((prev) => ({ ...prev, cpf: undefined }));
  };

  const handleZipCodeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setZipCode(maskCep(e.target.value));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateForm()) return;

    // Formata o endereço completo juntando os campos preenchidos
    const addressParts = [
      street.trim(),
      number.trim() ? `nº ${number.trim()}` : "",
      neighborhood.trim(),
      city.trim() && state.trim() ? `${city.trim()} - ${state.trim()}` : city.trim() || state.trim(),
      zipCode.trim() ? `CEP: ${zipCode.trim()}` : "",
    ].filter(Boolean);

    const fullAddress = addressParts.join(", ");

    // Remove máscaras antes de enviar para a API
    const rawPhone = phone.replace(/\D/g, "");
    const rawCpf = cpf.replace(/\D/g, "") || undefined;

    const payload: CreatePatientInput = {
      name: name.trim(),
      phone: rawPhone,
      email: email.trim() || undefined,
      cpf: rawCpf ? cpf.trim() : undefined, // envia com máscara para exibição, ou sem — escolha sua convenção
      birthDate: birthDate || undefined,
      address: fullAddress || undefined,
    };

    const success = await onSave(payload);
    if (success) {
      onClose();
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="sm:max-w-[560px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-xl font-bold flex items-center gap-2 text-foreground">
            {isEditing ? (
              <>
                <Edit3 className="w-5 h-5 text-primary" /> Editar Cliente
              </>
            ) : (
              <>
                <UserPlus className="w-5 h-5 text-primary" /> Cadastrar Novo Cliente
              </>
            )}
          </DialogTitle>
          <DialogDescription>
            Preencha as informações pessoais e de endereço do cliente.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} noValidate className="space-y-4 py-2">
          {/* Seção: Dados Pessoais */}
          <div className="space-y-3">
            <FormField label="Nome Completo" required error={errors.name}>
              <Input
                placeholder="Ex: Ana Maria Silva"
                value={name}
                onChange={(e) => {
                  setName(e.target.value);
                  if (errors.name) setErrors((prev) => ({ ...prev, name: undefined }));
                }}
                className={`h-10 ${errors.name ? "border-destructive focus-visible:ring-destructive" : ""}`}
              />
            </FormField>

            <div className="grid grid-cols-2 gap-3 items-start">
              <FormField label="Telefone / WhatsApp" required error={errors.phone}>
                <Input
                  placeholder="(11) 99999-9999"
                  value={phone}
                  onChange={handlePhoneChange}
                  inputMode="numeric"
                  className={`h-10 ${errors.phone ? "border-destructive focus-visible:ring-destructive" : ""}`}
                />
              </FormField>

              <FormField label="CPF" error={errors.cpf}>
                <Input
                  placeholder="000.000.000-00"
                  value={cpf}
                  onChange={handleCpfChange}
                  inputMode="numeric"
                  className={`h-10 ${errors.cpf ? "border-destructive focus-visible:ring-destructive" : ""}`}
                />
              </FormField>
            </div>

            <div className="grid grid-cols-2 gap-3 items-start">
              <FormField label="E-mail">
                <Input
                  type="email"
                  placeholder="cliente@email.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="h-10"
                />
              </FormField>

              <FormField label="Data de Nascimento">
                <Input
                  type="date"
                  value={birthDate}
                  onChange={(e) => setBirthDate(e.target.value)}
                  className="h-10"
                />
              </FormField>
            </div>
          </div>

          <hr className="my-2 border-border" />

          {/* Seção: Endereço */}
          <div className="space-y-3">
            <h3 className="text-xs font-semibold tracking-wider text-muted-foreground uppercase flex items-center gap-1.5">
              <MapPin className="w-3.5 h-3.5 text-primary" /> Endereço (Opcional)
            </h3>

            <div className="grid grid-cols-3 gap-3">
              <FormField label="CEP">
                <Input
                  placeholder="00000-000"
                  value={zipCode}
                  onChange={handleZipCodeChange}
                  inputMode="numeric"
                  className="h-10"
                />
              </FormField>

              <div className="col-span-2">
                <FormField label="Rua / Logradouro">
                  <Input
                    placeholder="Ex: Av. Paulista"
                    value={street}
                    onChange={(e) => setStreet(e.target.value)}
                    className="h-10"
                  />
                </FormField>
              </div>
            </div>

            <div className="grid grid-cols-3 gap-3">
              <FormField label="Número">
                <Input
                  placeholder="123"
                  value={number}
                  onChange={(e) => setNumber(e.target.value)}
                  className="h-10"
                />
              </FormField>

              <div className="col-span-2">
                <FormField label="Bairro">
                  <Input
                    placeholder="Bela Vista"
                    value={neighborhood}
                    onChange={(e) => setNeighborhood(e.target.value)}
                    className="h-10"
                  />
                </FormField>
              </div>
            </div>

            <div className="grid grid-cols-3 gap-3">
              <div className="col-span-2">
                <FormField label="Cidade">
                  <Input
                    placeholder="São Paulo"
                    value={city}
                    onChange={(e) => setCity(e.target.value)}
                    className="h-10"
                  />
                </FormField>
              </div>

              <FormField label="UF">
                <Input
                  placeholder="SP"
                  maxLength={2}
                  value={state}
                  onChange={(e) => setState(e.target.value.toUpperCase())}
                  className="h-10 uppercase"
                />
              </FormField>
            </div>
          </div>

          <DialogFooter className="pt-3 gap-2">
            <Button
              type="button"
              variant="outline"
              onClick={onClose}
              disabled={isSubmitting}
            >
              Cancelar
            </Button>
            <Button
              type="submit"
              disabled={isSubmitting}
              className="min-w-[140px]"
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" /> Salvando...
                </>
              ) : isEditing ? (
                "Salvar Alterações"
              ) : (
                "Cadastrar Cliente"
              )}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}

export { PatientModal as NewPatientModal };