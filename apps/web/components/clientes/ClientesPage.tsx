"use client";

import { useState } from "react";
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
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { usePatients, Patient, CreatePatientInput } from "@/hooks/usePatient";
import { NewPatientModal } from "@/components/clientes/NewPatientModal";

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

  const handleOpenCreateModal = () => {
    setSelectedPatient(null);
    setIsModalOpen(true);
  };

  const handleOpenEditModal = (patient: Patient) => {
    setSelectedPatient(patient);
    setIsModalOpen(true);
  };

  const handleSavePatient = async (data: CreatePatientInput) => {
    if (selectedPatient) {
      return await updatePatient(selectedPatient.id, data);
    } else {
      return await createPatient(data);
    }
  };

  const handleDelete = async (id: string) => {
    if (confirm("Tem certeza que deseja excluir este cliente?")) {
      await deletePatient(id);
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
        pages.push(1, "...", totalPages - 4, totalPages - 3, totalPages - 2, totalPages - 1, totalPages);
      } else {
        pages.push(1, "...", currentPage - 1, currentPage, currentPage + 1, "...", totalPages);
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

      {/* Tabela (Ajustável ao conteúdo, sem caixa branca sobramdo e com colunas cravadas) */}
      <div className="rounded-xl border bg-card overflow-hidden shadow-xs">
        <div className="overflow-x-auto">
          <Table className="w-full table-fixed">
            <TableHeader>
              <TableRow className="bg-muted/50">
                <TableHead className="w-[28%] font-semibold py-3.5">Nome</TableHead>
                <TableHead className="w-[22%] font-semibold py-3.5">Telefone / WhatsApp</TableHead>
                <TableHead className="w-[20%] font-semibold py-3.5">CPF</TableHead>
                <TableHead className="w-[25%] font-semibold py-3.5">E-mail</TableHead>
                <TableHead className="w-[5%] py-3.5"></TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {loading ? (
                <TableRow>
                  <TableCell colSpan={5} className="text-center py-12 text-muted-foreground">
                    Carregando clientes...
                  </TableCell>
                </TableRow>
              ) : patients.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={5} className="text-center py-12 text-muted-foreground">
                    Nenhum cliente encontrado.
                  </TableCell>
                </TableRow>
              ) : (
                patients.map((patient) => (
                  <TableRow key={patient.id} className="hover:bg-accent/50 transition-colors">
                    <TableCell className="font-medium text-foreground py-3.5 truncate">
                      {patient.name}
                    </TableCell>
                    <TableCell className="py-3.5 truncate">
                      <span className="flex items-center gap-1.5 text-xs font-medium truncate">
                        <Phone className="w-3.5 h-3.5 text-primary shrink-0" />
                        {patient.phone}
                      </span>
                    </TableCell>
                    <TableCell className="text-xs text-muted-foreground py-3.5 truncate">
                      <span className="flex items-center gap-1 truncate">
                        <FileText className="w-3.5 h-3.5 shrink-0" />
                        {patient.cpf || "-"}
                      </span>
                    </TableCell>
                    <TableCell className="text-xs text-muted-foreground py-3.5 truncate">
                      <span className="flex items-center gap-1 truncate">
                        <Mail className="w-3.5 h-3.5 shrink-0" />
                        {patient.email || "-"}
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
                            onClick={() => handleDelete(patient.id)}
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
              {patients.length > 0 ? (currentPage - 1) * ITEMS_PER_PAGE + 1 : 0}-
              {Math.min(currentPage * ITEMS_PER_PAGE, totalPatients)}
            </span>{" "}
            de <span className="font-medium text-foreground">{totalPatients}</span> clientes
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
                    <span key={idx} className="px-1.5 text-xs text-muted-foreground select-none">
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

      {/* Modal */}
      <NewPatientModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSave={handleSavePatient}
        initialData={selectedPatient}
        isSubmitting={isSubmitting}
      />
    </div>
  );
}