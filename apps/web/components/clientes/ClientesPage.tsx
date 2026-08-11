"use client";

import { useState, useMemo } from "react";
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
} from "lucide-react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

const MOCK_PATIENTS = [
  {
    id: "1",
    name: "Usuário Teste",
    phone: "(11) 98765-4321",
    cpf: "123.456.789-00",
    email: "usuario@email.com",
  },
  {
    id: "2",
    name: "Usuário",
    phone: "(11) 91234-5678",
    cpf: "987.654.321-11",
    email: "user@email.com",
  },
  {
    id: "3",
    name: "Username",
    phone: "(11) 97777-8888",
    cpf: "456.789.123-22",
    email: "username@email.com",
  },
];

export default function ClientesPage() {
  const [searchTerm, setSearchTerm] = useState("");

  const filteredPatients = useMemo(() => {
    const term = searchTerm.toLowerCase();
    return MOCK_PATIENTS.filter(
      (p) =>
        p.name.toLowerCase().includes(term) ||
        p.email.toLowerCase().includes(term),
    );
  }, [searchTerm]);

  return (
    <div className="space-y-6">
      {/* Header com Título e Botão Novo */}
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

        <Button size="default" className="gap-2 shadow-sm font-semibold">
          <Plus className="w-4 h-4" /> Novo Cliente
        </Button>
      </div>

      {/* Barra de Busca */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 bg-card p-3 rounded-xl border shadow-xs">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <Input
            type="text"
            placeholder="Buscar por nome, e-mail ou CPF..."
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
        <Table>
          <TableHeader>
            <TableRow className="bg-muted/50">
              <TableHead className="font-semibold">Nome</TableHead>
              <TableHead className="font-semibold">Telefone</TableHead>
              <TableHead className="font-semibold">CPF</TableHead>
              <TableHead className="font-semibold">E-mail</TableHead>
              <TableHead className="w-[50px]"></TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredPatients.map((patient) => (
              <TableRow
                key={patient.id}
                className="hover:bg-accent/50 transition-colors"
              >
                <TableCell className="font-medium text-foreground">
                  {patient.name}
                </TableCell>
                <TableCell>
                  <span className="flex items-center gap-1.5 text-xs font-medium">
                    <Phone className="w-3.5 h-3.5 text-primary shrink-0" />
                    {patient.phone}
                  </span>
                </TableCell>
                <TableCell className="text-xs text-muted-foreground">
                  <span className="flex items-center gap-1">
                    <FileText className="w-3.5 h-3.5 shrink-0" />
                    {patient.cpf}
                  </span>
                </TableCell>
                <TableCell className="text-xs text-muted-foreground">
                  <span className="flex items-center gap-1">
                    <Mail className="w-3.5 h-3.5 shrink-0" />
                    {patient.email}
                  </span>
                </TableCell>
                <TableCell className="text-right">
                  <button className="text-muted-foreground hover:text-foreground p-1 rounded-md">
                    <MoreVertical className="w-4 h-4" />
                  </button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>

        {/* Rodapé de Paginação (Design Estático) */}
        <div className="flex items-center justify-between px-4 py-3 border-t bg-muted/20">
          <div className="text-xs text-muted-foreground">
            Exibindo <span className="font-medium text-foreground">1-3</span> de{" "}
            <span className="font-medium text-foreground">3</span> clientes
          </div>
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              className="h-8 px-3 text-xs gap-1"
              disabled
            >
              <ChevronLeft className="w-3.5 h-3.5" /> Anterior
            </Button>
            <Button
              variant="outline"
              size="sm"
              className="h-8 px-3 text-xs gap-1"
              disabled
            >
              Próximo <ChevronRight className="w-3.5 h-3.5" />
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
