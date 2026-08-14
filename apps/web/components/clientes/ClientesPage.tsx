"use client";

import { useState } from "react";
import { maskCpf, maskPhone } from "@/lib/masks";
import Link from "next/link";
import {
  Users,
  Phone,
  Mail,
  FileText,
  MoreVertical,
  Search,
  X,
  Plus,
  ChevronLeft,
  ChevronRight,
  Pencil,
  Trash2,
  AlertTriangle,
} from "lucide-react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import { Skeleton } from "@/components/ui/skeleton";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { usePatients } from "@/hooks/usePatient";
import type { Patient, CreatePatientInput } from "@/types/patient";
import { NewPatientModal } from "@/components/clientes/NewPatientModal";
import { toast } from "@/components/ui/toast";

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

  const handleOpenCreateModal = () => {
    setSelectedPatient(null);
    setIsModalOpen(true);
  };

  const handleOpenEditModal = (patient: Patient) => {
    setSelectedPatient(patient);
    setIsModalOpen(true);
  };

  const handleSavePatient = async (data: CreatePatientInput) => {
    let success = false;
    if (selectedPatient) {
      success = await updatePatient(selectedPatient.id, data);
      if (success) {
        toast.add({
          title: "Cliente atualizado",
          description: "As informações foram salvas com sucesso.",
          type: "success",
        });
      } else {
        toast.add({
          title: "Erro",
          description: "Falha ao atualizar o cliente.",
          type: "error",
        });
      }
    } else {
      success = await createPatient(data);
      if (success) {
        toast.add({
          title: "Cliente cadastrado",
          description: "O novo cliente foi adicionado com sucesso.",
          type: "success",
        });
      } else {
        toast.add({
          title: "Erro",
          description: "Falha ao cadastrar o cliente.",
          type: "error",
        });
      }
    }
    return success;
  };

  const handleConfirmDelete = async () => {
    if (deletingId) {
      const success = await deletePatient(deletingId);
      if (success) {
        toast.add({
          title: "Cliente excluído",
          description: "O cliente foi removido com sucesso.",
          type: "success",
        });
      } else {
        toast.add({
          title: "Erro",
          description: "Não foi possível excluir o cliente.",
          type: "error",
        });
      }
      setDeletingId(null);
    }
  };

  // Função para gerar os números de página dinamicamente (com reticências "...")
  const getPaginationPages = () => {
    const pages: (number | string)[] = [];
    if (totalPages <= 7) {
      for (let i = 1; i <= totalPages; i++) pages.push(i);
    } else {
      if (currentPage <= 4) {
        pages.push(1, 2, 3, 4, 5, "...", totalPages);
      } else if (currentPage >= totalPages - 3) {
        pages.push(
          1,
          "...",
          totalPages - 4,
          totalPages - 3,
          totalPages - 2,
          totalPages - 1,
          totalPages,
        );
      } else {
        pages.push(
          1,
          "...",
          currentPage - 1,
          currentPage,
          currentPage + 1,
          "...",
          totalPages,
        );
      }
    }
    return pages;
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2 border-b">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-foreground flex items-center gap-2">
            <Users className="w-6 h-6 text-primary animate-pulse" />
            Clientes
          </h1>
          <p className="text-sm text-muted-foreground">
            Cadastre e veja todos os clientes.
          </p>
        </div>

        <Button
          onClick={handleOpenCreateModal}
          size="default"
          className="gap-2 shadow-sm font-semibold cursor-pointer"
        >
          <Plus className="w-4 h-4" /> Novo Cliente
        </Button>
      </div>

      {/* Busca */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 bg-card p-3 rounded-xl border shadow-xs">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <Input
            type="text"
            placeholder="Buscar cliente por nome, telefone, e-mail ou CPF..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-9 pr-8"
          />
          {searchTerm && (
            <button
              onClick={() => setSearchTerm("")}
              className="absolute right-2.5 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
            >
              <X className="w-4 h-4" />
            </button>
          )}
        </div>
      </div>

      {/* Tabela */}
      <div className="rounded-xl border bg-card overflow-hidden shadow-xs">
        <div className="overflow-x-auto">
          <Table className="w-full table-fixed">
            <TableHeader>
              <TableRow className="bg-slate-50/50 border-b border-slate-100">
                <TableHead className="w-[28%] font-semibold text-[11px] tracking-wider uppercase text-slate-500 py-3">
                  Nome
                </TableHead>
                <TableHead className="w-[22%] font-semibold text-[11px] tracking-wider uppercase text-slate-500 py-3">
                  Telefone / WhatsApp
                </TableHead>
                <TableHead className="w-[20%] font-semibold text-[11px] tracking-wider uppercase text-slate-500 py-3">
                  CPF
                </TableHead>
                <TableHead className="w-[25%] font-semibold text-[11px] tracking-wider uppercase text-slate-500 py-3">
                  E-mail
                </TableHead>
                <TableHead className="w-[5%] py-3"></TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {loading ? (
                Array.from({ length: ITEMS_PER_PAGE }).map((_, idx) => (
                  <TableRow key={idx}>
                    <TableCell className="py-3.5">
                      <Skeleton className="h-4 w-3/4" />
                    </TableCell>
                    <TableCell className="py-3.5">
                      <Skeleton className="h-4 w-1/2" />
                    </TableCell>
                    <TableCell className="py-3.5">
                      <Skeleton className="h-4 w-1/2" />
                    </TableCell>
                    <TableCell className="py-3.5">
                      <Skeleton className="h-4 w-2/3" />
                    </TableCell>
                    <TableCell className="py-3.5">
                      <Skeleton className="h-4 w-8 ml-auto" />
                    </TableCell>
                  </TableRow>
                ))
              ) : patients.length === 0 ? (
                <TableRow>
                  <TableCell
                    colSpan={5}
                    className="text-center py-12 text-muted-foreground"
                  >
                    Nenhum cliente encontrado.
                  </TableCell>
                </TableRow>
              ) : (
                patients.map((patient) => (
                  <TableRow
                    key={patient.id}
                    className="hover:bg-accent/50 transition-colors"
                  >
                    <TableCell className="font-medium text-foreground py-2.5 truncate">
                      <Link
                        href={`/clientes/${patient.id}`}
                        className="flex items-center gap-3 hover:text-rose-600 transition-colors cursor-pointer group"
                      >
                        <div className="w-7 h-7 rounded-full bg-rose-50 text-rose-600 border border-rose-100 flex items-center justify-center font-bold text-xs shrink-0 group-hover:bg-rose-100 transition-colors">
                          {patient.name.substring(0, 2).toUpperCase()}
                        </div>
                        <span className="truncate group-hover:underline">{patient.name}</span>
                      </Link>
                    </TableCell>
                    <TableCell className="py-3.5 truncate">
                      <span className="flex items-center gap-1.5 text-xs font-medium truncate">
                        <Phone className="w-3.5 h-3.5 text-primary shrink-0" />
                        {maskPhone(patient.phone)}
                      </span>
                    </TableCell>
                    <TableCell className="text-xs text-muted-foreground py-3.5 truncate">
                      <span className="flex items-center gap-1 truncate">
                        <FileText className="w-3.5 h-3.5 shrink-0" />
                        {patient.cpf ? (
                          maskCpf(patient.cpf)
                        ) : (
                          <span className="text-[10px] px-2 py-0.5 rounded-full bg-slate-100 text-slate-500 font-medium">Não informado</span>
                        )}
                      </span>
                    </TableCell>
                    <TableCell className="text-xs text-muted-foreground py-3.5 truncate">
                      <span className="flex items-center gap-1 truncate">
                        <Mail className="w-3.5 h-3.5 shrink-0" />
                        {patient.email ? (
                           patient.email
                        ) : (
                          <span className="text-[10px] px-2 py-0.5 rounded-full bg-slate-100 text-slate-500 font-medium">Não informado</span>
                        )}
                      </span>
                    </TableCell>
                    <TableCell className="text-right py-3.5">
                      <DropdownMenu>
                        <DropdownMenuTrigger className="text-muted-foreground hover:text-foreground p-1.5 rounded-md cursor-pointer focus:outline-none">
                          <MoreVertical className="w-4 h-4" />
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end" className="w-36">
                          <DropdownMenuItem
                            onClick={() => handleOpenEditModal(patient)}
                            className="cursor-pointer gap-2"
                          >
                            <Pencil className="w-4 h-4 text-muted-foreground" />
                            Editar
                          </DropdownMenuItem>
                          <DropdownMenuItem
                            onClick={() => setDeletingId(patient.id)}
                            className="cursor-pointer gap-2 text-destructive focus:text-destructive"
                          >
                            <Trash2 className="w-4 h-4" />
                            Excluir
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </div>

        {/* Rodapé com Paginação Numérica Completa */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 px-4 py-3 border-t bg-muted/20">
          <div className="text-xs text-muted-foreground">
            Exibindo{" "}
            <span className="font-medium text-foreground">
              {patients.length > 0 ? (currentPage - 1) * ITEMS_PER_PAGE + 1 : 0}
              -{Math.min(currentPage * ITEMS_PER_PAGE, totalPatients)}
            </span>{" "}
            de{" "}
            <span className="font-medium text-foreground">{totalPatients}</span>{" "}
            clientes
          </div>

          <div className="flex items-center gap-1">
            <Button
              variant="outline"
              size="sm"
              className="h-8 px-2.5 text-xs gap-1 cursor-pointer"
              disabled={currentPage <= 1}
              onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
            >
              <ChevronLeft className="w-3.5 h-3.5" /> Anterior
            </Button>

            {/* Renderização dinâmica dos botões numéricos */}
            <div className="flex items-center gap-1 mx-1">
              {getPaginationPages().map((page, idx) => {
                if (typeof page === "string") {
                  return (
                    <span
                      key={idx}
                      className="px-1.5 text-xs text-muted-foreground select-none"
                    >
                      {page}
                    </span>
                  );
                }

                const isActive = page === currentPage;
                return (
                  <Button
                    key={idx}
                    variant={isActive ? "default" : "outline"}
                    size="sm"
                    className={`h-8 w-8 text-xs p-0 cursor-pointer ${
                      isActive ? "font-bold" : "text-muted-foreground"
                    }`}
                    onClick={() => setCurrentPage(page)}
                  >
                    {page}
                  </Button>
                );
              })}
            </div>

            <Button
              variant="outline"
              size="sm"
              className="h-8 px-2.5 text-xs gap-1 cursor-pointer"
              disabled={currentPage >= totalPages}
              onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
            >
              Próximo <ChevronRight className="w-3.5 h-3.5" />
            </Button>
          </div>
        </div>
      </div>

      {/* Modal de Criação/Edição */}
      <NewPatientModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSave={handleSavePatient}
        initialData={selectedPatient}
        isSubmitting={isSubmitting}
      />

      {/* Modal de Confirmação de Exclusão */}
      <Dialog
        open={Boolean(deletingId)}
        onOpenChange={(open) => !open && setDeletingId(null)}
      >
        <DialogContent className="sm:max-w-[400px]">
          <DialogHeader>
            <DialogTitle className="text-lg font-bold flex items-center gap-2 text-destructive">
              <AlertTriangle className="w-5 h-5" /> Excluir Cliente?
            </DialogTitle>
            <DialogDescription className="text-sm">
              Esta ação removerá este cliente do sistema. Esta ação não poderá
              ser desfeita.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter className="gap-2 pt-2">
            <Button variant="outline" onClick={() => setDeletingId(null)}>
              Cancelar
            </Button>
            <Button variant="destructive" onClick={handleConfirmDelete}>
              Excluir Definitivamente
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
