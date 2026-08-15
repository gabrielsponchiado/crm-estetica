"use client";

import Link from "next/link";

import {
  Users,
  Phone,
  Mail,
  FileText,
  MoreHorizontal,
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

import { Skeleton } from "@/components/ui/skeleton";

import { maskCpf, maskPhone } from "@/lib/masks";

import type { Patient } from "@/types/patient";

interface PatientsTableProps {
  patients: Patient[];
  loading: boolean;
  searchTerm: string;

  onEdit: (patient: Patient) => void;
  onDelete: (id: string) => void;
}

const ITEMS_PER_PAGE = 10;

export function PatientsTable({
  patients,
  loading,
  searchTerm,
  onEdit,
  onDelete,
}: PatientsTableProps) {
  return (
    <div className="min-h-0 flex-1 overflow-auto">
      <Table className="w-full">
        <TableHeader className="sticky top-0 z-10 bg-background">
          <TableRow className="border-b border-border/60 hover:bg-transparent">
            <TableHead className="h-10 w-[30%] px-5 text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">
              Cliente
            </TableHead>

            <TableHead className="h-10 w-[20%] text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">
              Telefone
            </TableHead>

            <TableHead className="h-10 w-[18%] text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">
              CPF
            </TableHead>

            <TableHead className="h-10 w-[27%] text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">
              E-mail
            </TableHead>

            <TableHead className="h-10 w-12 px-3" />
          </TableRow>
        </TableHeader>

        <TableBody>
          {loading ? (
            Array.from({ length: ITEMS_PER_PAGE }).map((_, index) => (
              <TableRow key={index} className="border-border/40">
                <TableCell className="px-5 py-3.5">
                  <div className="flex items-center gap-3">
                    <Skeleton className="h-8 w-8 rounded-full" />

                    <div className="space-y-1.5">
                      <Skeleton className="h-3.5 w-32" />
                      <Skeleton className="h-2.5 w-20" />
                    </div>
                  </div>
                </TableCell>

                <TableCell>
                  <Skeleton className="h-3 w-28" />
                </TableCell>

                <TableCell>
                  <Skeleton className="h-3 w-24" />
                </TableCell>

                <TableCell>
                  <Skeleton className="h-3 w-36" />
                </TableCell>

                <TableCell className="px-3">
                  <Skeleton className="ml-auto h-8 w-8 rounded-md" />
                </TableCell>
              </TableRow>
            ))
          ) : patients.length === 0 ? (
            <TableRow>
              <TableCell colSpan={5} className="h-[420px] text-center">
                <div className="mx-auto flex max-w-sm flex-col items-center">
                  <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-muted">
                    <Users className="h-5 w-5 text-muted-foreground" />
                  </div>

                  <h3 className="mt-4 text-sm font-semibold">
                    {searchTerm
                      ? "Nenhum cliente encontrado"
                      : "Nenhum cliente cadastrado"}
                  </h3>

                  <p className="mt-1.5 text-xs leading-5 text-muted-foreground">
                    {searchTerm
                      ? "Tente alterar os termos da busca e tente novamente."
                      : "Cadastre seu primeiro cliente para começar a gerenciar os atendimentos."}
                  </p>
                </div>
              </TableCell>
            </TableRow>
          ) : (
            patients.map((patient) => (
              <TableRow
                key={patient.id}
                className="group border-border/40 transition-colors hover:bg-muted/30"
              >

                <TableCell className="px-5 py-3.5">
                  <Link
                    href={`/clientes/${patient.id}`}
                    className="flex min-w-0 items-center gap-3"
                  >
                    <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-primary/10 text-[10px] font-semibold text-primary transition-colors group-hover:bg-primary/15">
                      {patient.name.trim().substring(0, 2).toUpperCase()}
                    </div>

                    <div className="min-w-0">
                      <p className="truncate text-sm font-medium transition-colors group-hover:text-primary">
                        {patient.name}
                      </p>

                      <p className="mt-0.5 text-[10px] text-muted-foreground">
                        Ver prontuário
                      </p>
                    </div>
                  </Link>
                </TableCell>

                <TableCell>
                  <div className="flex items-center gap-2 text-xs text-muted-foreground">
                    <Phone className="h-3.5 w-3.5 shrink-0 text-muted-foreground/70" />

                    <span>
                      {patient.phone
                        ? maskPhone(patient.phone)
                        : "Não informado"}
                    </span>
                  </div>
                </TableCell>

                <TableCell>
                  {patient.cpf ? (
                    <div className="flex items-center gap-2 text-xs text-muted-foreground">
                      <FileText className="h-3.5 w-3.5 shrink-0 text-muted-foreground/70" />

                      <span>{maskCpf(patient.cpf)}</span>
                    </div>
                  ) : (
                    <span className="inline-flex rounded-md bg-muted px-2 py-1 text-[10px] font-medium text-muted-foreground">
                      Não informado
                    </span>
                  )}
                </TableCell>

                <TableCell>
                  {patient.email ? (
                    <div className="flex min-w-0 items-center gap-2 text-xs text-muted-foreground">
                      <Mail className="h-3.5 w-3.5 shrink-0 text-muted-foreground/70" />

                      <span className="truncate" title={patient.email}>
                        {patient.email}
                      </span>
                    </div>
                  ) : (
                    <span className="inline-flex rounded-md bg-muted px-2 py-1 text-[10px] font-medium text-muted-foreground">
                      Não informado
                    </span>
                  )}
                </TableCell>

                {/* Ações */}

                <TableCell className="w-12 px-3 text-right">
                  <DropdownMenu>
                    <DropdownMenuTrigger className="inline-flex h-8 w-8 shrink-0 items-center justify-center rounded-lg text-muted-foreground opacity-0 transition-opacity hover:bg-muted hover:text-foreground group-hover:opacity-100 focus-visible:opacity-100 focus-visible:ring-2 focus-visible:ring-ring outline-none cursor-pointer">
                      <MoreHorizontal className="h-4 w-4" />

                      <span className="sr-only">Abrir ações</span>
                    </DropdownMenuTrigger>

                    <DropdownMenuContent align="end" className="w-36">
                      <DropdownMenuItem
                        onClick={() => onEdit(patient)}
                        className="cursor-pointer gap-2"
                      >
                        <Pencil className="h-3.5 w-3.5" />
                        Editar
                      </DropdownMenuItem>

                      <DropdownMenuItem
                        onClick={() => onDelete(patient.id)}
                        className="cursor-pointer gap-2 text-destructive focus:text-destructive"
                      >
                        <Trash2 className="h-3.5 w-3.5" />
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
  );
}
