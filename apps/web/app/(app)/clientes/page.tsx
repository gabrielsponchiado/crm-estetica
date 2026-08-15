"use client";

import { useState } from "react";
import { Users, Plus, AlertTriangle } from "lucide-react";

import { Button } from "@/components/ui/button";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

import { toast } from "@/components/ui/toast";

import { usePatients } from "@/hooks/usePatient";
import type { Patient, CreatePatientInput } from "@/types/patient";

import { PatientModal } from "@/components/clientes/NewPatientModal";
import { PatientsToolbar } from "@/components/clientes/PatientsToolbar";
import { PatientsTable } from "@/components/clientes/PatientsTable";
import { PatientsPagination } from "@/components/clientes/PatientsPagination";

const ITEMS_PER_PAGE = 10;

export default function ClientesPage() {
  const {
    patients,
    totalPatients,
    loading,
    isSubmitting,
    searchTerm,
    setSearchTerm,
    currentPage,
    totalPages,
    setCurrentPage,
    createPatient,
    updatePatient,
    deletePatient,
  } = usePatients(ITEMS_PER_PAGE);

  const [isModalOpen, setIsModalOpen] = useState(false);

  const [selectedPatient, setSelectedPatient] = useState<Patient | null>(null);

  const [deletingId, setDeletingId] = useState<string | null>(null);

  const handleNewPatient = () => {
    setSelectedPatient(null);
    setIsModalOpen(true);
  };

  const handleEditPatient = (patient: Patient) => {
    setSelectedPatient(patient);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    if (isSubmitting) return;

    setIsModalOpen(false);
    setSelectedPatient(null);
  };

  const handleSavePatient = async (
    data: CreatePatientInput,
  ): Promise<{ success: boolean; error?: string }> => {
    let result: { success: boolean; error?: string } = {
      success: false,
    };

    if (selectedPatient) {
      result = await updatePatient(selectedPatient.id, data);

      if (result.success) {
        toast.add({
          title: "Cliente atualizado",
          description: "As informações foram atualizadas com sucesso.",
          type: "success",
        });
      } else {
        toast.add({
          title: "Erro ao atualizar",
          description: result.error || "Não foi possível atualizar o cliente.",
          type: "error",
        });
      }
    } else {
      result = await createPatient(data);

      if (result.success) {
        toast.add({
          title: "Cliente cadastrado",
          description: "O cliente foi cadastrado com sucesso.",
          type: "success",
        });
      } else {
        toast.add({
          title: "Erro ao cadastrar",
          description: result.error || "Não foi possível cadastrar o cliente.",
          type: "error",
        });
      }
    }

    return result;
  };

  const handleDeletePatient = (id: string) => {
    setDeletingId(id);
  };

  const handleConfirmDelete = async () => {
    if (!deletingId) return;

    const success = await deletePatient(deletingId);

    if (success) {
      toast.add({
        title: "Cliente excluído",
        description: "O cliente foi removido do sistema.",
        type: "success",
      });
    } else {
      toast.add({
        title: "Erro ao excluir",
        description: "Não foi possível excluir o cliente.",
        type: "error",
      });
    }

    setDeletingId(null);
  };

  return (
    <div className="flex h-full flex-col gap-5">
      <header className="flex shrink-0 items-end justify-between gap-6">
        <div className="flex items-center gap-3">
          <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-primary/10">
            <Users className="h-[18px] w-[18px] text-primary" />
          </div>

          <div>
            <h1 className="text-2xl font-semibold tracking-tight">Clientes</h1>

            <p className="text-sm text-muted-foreground">
              Gerencie os pacientes cadastrados na clínica.
            </p>
          </div>
        </div>

        <Button
          onClick={handleNewPatient}
          className="h-10 gap-2 rounded-lg px-4 shadow-sm"
        >
          <Plus className="h-4 w-4" />
          Novo cliente
        </Button>
      </header>

      <div className="flex min-h-0 flex-1 flex-col overflow-hidden rounded-xl border border-border/60 bg-background shadow-sm">
        <PatientsToolbar
          searchTerm={searchTerm}
          totalPatients={totalPatients}
          onSearchChange={setSearchTerm}
        />

        <PatientsTable
          patients={patients}
          loading={loading}
          searchTerm={searchTerm}
          onEdit={handleEditPatient}
          onDelete={handleDeletePatient}
        />

        <PatientsPagination
          currentPage={currentPage}
          totalPages={totalPages}
          totalPatients={totalPatients}
          itemsPerPage={ITEMS_PER_PAGE}
          loading={loading}
          onPageChange={setCurrentPage}
        />
      </div>

      <PatientModal
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        onSave={handleSavePatient}
        initialData={selectedPatient}
        isSubmitting={isSubmitting}
      />

      <Dialog
        open={Boolean(deletingId)}
        onOpenChange={(open) => {
          if (!open) {
            setDeletingId(null);
          }
        }}
      >
        <DialogContent className="sm:max-w-[400px]">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2 text-lg font-semibold">
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-destructive/10">
                <AlertTriangle className="h-4 w-4 text-destructive" />
              </div>
              Excluir cliente?
            </DialogTitle>

            <DialogDescription className="pt-1 text-sm leading-5">
              Esta ação removerá o cliente do sistema. Os dados não poderão ser
              recuperados depois da exclusão.
            </DialogDescription>
          </DialogHeader>

          <DialogFooter className="gap-2 pt-2">
            <Button variant="outline" onClick={() => setDeletingId(null)}>
              Cancelar
            </Button>

            <Button variant="destructive" onClick={handleConfirmDelete}>
              Excluir
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
