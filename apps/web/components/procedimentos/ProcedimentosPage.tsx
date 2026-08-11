"use client";

import { useState } from "react";
import { ProcedureModal } from "./NewProcedureModal";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
  CardFooter,
} from "@/components/ui/card";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import {
  Plus,
  Search,
  Clock,
  MoreVertical,
  Sparkles,
  Trash2,
  Calendar,
  DollarSign,
  TrendingUp,
  Edit3,
  Copy,
  Layers,
  ArrowUpDown,
  X,
  AlertTriangle,
} from "lucide-react";
import {
  useProcedures,
  Procedure,
  CreateProcedureInput,
} from "@/hooks/useProcedures";

export function ProcedimentosPage() {
  const {
    procedures,
    loading,
    isSubmitting,
    searchTerm,
    setSearchTerm,
    sortBy,
    setSortBy,
    stats,
    createProcedure,
    updateProcedure,
    deleteProcedure,
  } = useProcedures();

  // Estados dos Modais
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedProcedure, setSelectedProcedure] = useState<Procedure | null>(
    null,
  );
  const [deletingId, setDeletingId] = useState<string | null>(null);

  // Formatação de duração
  const formatDuration = (minutes: number) => {
    if (minutes >= 60) {
      const hours = Math.floor(minutes / 60);
      const remainingMinutes = minutes % 60;
      return remainingMinutes > 0
        ? `${hours}h ${remainingMinutes}min`
        : `${hours}h`;
    }
    return `${minutes} min`;
  };

  // Handlers de Ações
  const handleOpenCreateModal = () => {
    setSelectedProcedure(null);
    setIsModalOpen(true);
  };

  const handleOpenEditModal = (procedure: Procedure) => {
    setSelectedProcedure(procedure);
    setIsModalOpen(true);
  };

  const handleDuplicate = (procedure: Procedure) => {
    createProcedure({
      name: `${procedure.name} (Cópia)`,
      durationMinutes: procedure.durationMinutes,
      price: procedure.price,
      description: procedure.description,
      recommendedMonths: procedure.recommendedMonths,
    });
  };

  const handleSaveModal = async (data: CreateProcedureInput) => {
    if (selectedProcedure) {
      return await updateProcedure(selectedProcedure.id, data);
    }

    return await createProcedure(data);
  };

  const handleConfirmDelete = async () => {
    if (deletingId) {
      await deleteProcedure(deletingId);
      setDeletingId(null);
    }
  };

  return (
    <div className="flex flex-col gap-6">
      {/* Header Principal */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2 border-b">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-foreground flex items-center gap-2">
            <Sparkles className="w-6 h-6 text-primary animate-pulse" />
            Catálogo de Procedimentos
          </h1>
          <p className="text-sm text-muted-foreground">
            Gerencie todos os tratamentos estéticos, durações, preços e
            frequências de retorno.
          </p>
        </div>

        <Button
          onClick={handleOpenCreateModal}
          size="default"
          className="gap-2 shadow-sm font-semibold"
        >
          <Plus className="w-4 h-4" /> Novo Procedimento
        </Button>
      </div>

      {/* Cards de Métricas SaaS */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <Card className="p-6 bg-card/60 backdrop-blur-xs flex flex-col items-center justify-center text-center gap-2">
          <div className="p-3 rounded-full bg-primary/10 text-primary shrink-0 mb-1">
            <Layers className="w-5 h-5" />
          </div>
          <p className="text-xs text-muted-foreground font-medium">
            Total de Procedimentos
          </p>
          <h3 className="text-2xl font-bold text-foreground tracking-tight">
            {loading ? "..." : stats.total}
          </h3>
        </Card>

        <Card className="p-6 bg-card/60 backdrop-blur-xs flex flex-col items-center justify-center text-center gap-2">
          <div className="p-3 rounded-full bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 shrink-0 mb-1">
            <DollarSign className="w-5 h-5" />
          </div>
          <p className="text-xs text-muted-foreground font-medium">
            Preço Médio por Serviço
          </p>
          <h3 className="text-2xl font-bold text-foreground tracking-tight">
            {loading
              ? "..."
              : stats.averagePrice.toLocaleString("pt-BR", {
                  style: "currency",
                  currency: "BRL",
                })}
          </h3>
        </Card>

        <Card className="p-6 bg-card/60 backdrop-blur-xs flex flex-col items-center justify-center text-center gap-2">
          <div className="p-3 rounded-full bg-blue-500/10 text-blue-600 dark:text-blue-400 shrink-0 mb-1">
            <TrendingUp className="w-5 h-5" />
          </div>
          <p className="text-xs text-muted-foreground font-medium">
            Duração Média em Clínica
          </p>
          <h3 className="text-2xl font-bold text-foreground tracking-tight">
            {loading ? "..." : formatDuration(stats.averageDuration)}
          </h3>
        </Card>
      </div>

      {/* Control Bar: Busca & Filtros */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 bg-card p-3 rounded-xl border shadow-xs">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <Input
            type="text"
            placeholder="Buscar procedimento por nome ou descrição..."
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

        <div className="flex items-center gap-2 shrink-0">
          <ArrowUpDown className="w-4 h-4 text-muted-foreground" />
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value as any)}
            className="h-9 px-3 rounded-md border border-input bg-background text-xs font-medium focus:outline-none focus:ring-2 focus:ring-ring cursor-pointer"
          >
            <option value="name">Ordenar por: Nome (A-Z)</option>
            <option value="price-asc">Preço: Menor ao Maior</option>
            <option value="price-desc">Preço: Maior ao Menor</option>
            <option value="duration">Duração: Mais rápido ao mais longo</option>
          </select>
        </div>
      </div>

      {/* Lista / Grid de Procedimentos */}
      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {[1, 2, 3, 4, 5, 6].map((idx) => (
            <Card key={idx} className="p-5 space-y-4">
              <Skeleton className="h-6 w-3/4 rounded-md" />
              <Skeleton className="h-4 w-full rounded-md" />
              <Skeleton className="h-4 w-2/3 rounded-md" />
              <div className="pt-4 border-t flex justify-between">
                <Skeleton className="h-5 w-20 rounded-md" />
                <Skeleton className="h-6 w-24 rounded-full" />
              </div>
            </Card>
          ))}
        </div>
      ) : procedures.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {procedures.map((proc) => (
            <Card
              key={proc.id}
              className="group flex flex-col justify-between hover:border-primary/40 hover:shadow-md transition-all duration-200"
            >
              <CardHeader className="pb-3">
                <div className="flex items-start justify-between gap-2">
                  <CardTitle className="text-base font-semibold text-foreground line-clamp-1 group-hover:text-primary transition-colors">
                    {proc.name}
                  </CardTitle>

                  <DropdownMenu>
                    <DropdownMenuTrigger className="h-8 w-8 flex items-center justify-center rounded-md -mr-1.5 text-muted-foreground hover:text-foreground hover:bg-accent cursor-pointer transition">
                      <MoreVertical className="w-4 h-4" />
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end" className="w-40">
                      <DropdownMenuItem
                        onClick={() => handleOpenEditModal(proc)}
                        className="cursor-pointer"
                      >
                        <Edit3 className="w-4 h-4 mr-2 text-muted-foreground" />{" "}
                        Editar
                      </DropdownMenuItem>
                      <DropdownMenuItem
                        onClick={() => handleDuplicate(proc)}
                        className="cursor-pointer"
                      >
                        <Copy className="w-4 h-4 mr-2 text-muted-foreground" />{" "}
                        Duplicar
                      </DropdownMenuItem>
                      <DropdownMenuSeparator />
                      <DropdownMenuItem
                        onClick={() => setDeletingId(proc.id)}
                        className="text-destructive focus:text-destructive cursor-pointer"
                      >
                        <Trash2 className="w-4 h-4 mr-2" /> Excluir
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>

                <CardDescription className="line-clamp-2 text-xs leading-relaxed">
                  {proc.description || "Nenhuma descrição informada."}
                </CardDescription>
              </CardHeader>

              <CardContent className="py-0">
                <div className="flex items-center justify-between text-xs text-muted-foreground gap-2 pt-3 border-t">
                  <span className="flex items-center gap-1 font-medium text-foreground/80">
                    <Clock className="w-3.5 h-3.5 text-primary" />
                    {formatDuration(proc.durationMinutes)}
                  </span>

                  {proc.recommendedMonths && (
                    <Badge
                      variant="outline"
                      className="text-[11px] gap-1 font-normal py-0.5"
                    >
                      <Calendar className="w-3 h-3 text-muted-foreground" />
                      Retorno: {proc.recommendedMonths}m
                    </Badge>
                  )}
                </div>
              </CardContent>

              <CardFooter className="pt-4 flex items-center justify-between">
                <span className="text-xs text-muted-foreground font-medium">
                  Valor do serviço
                </span>
                <Badge
                  variant="secondary"
                  className="text-sm font-bold text-emerald-700 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/50 border border-emerald-200 dark:border-emerald-800/80 px-2.5 py-1"
                >
                  {proc.price.toLocaleString("pt-BR", {
                    style: "currency",
                    currency: "BRL",
                  })}
                </Badge>
              </CardFooter>
            </Card>
          ))}
        </div>
      ) : (
        <Card className="p-12 text-center flex flex-col items-center justify-center gap-3 border-dashed">
          <div className="p-3 rounded-full bg-muted text-muted-foreground">
            <Sparkles className="w-6 h-6" />
          </div>
          <div className="space-y-1">
            <h3 className="text-base font-semibold text-foreground">
              Nenhum procedimento encontrado
            </h3>
            <p className="text-xs text-muted-foreground max-w-sm">
              {searchTerm
                ? `Nenhum procedimento corresponde ao termo "${searchTerm}".`
                : "Você ainda não cadastrou nenhum procedimento no catálogo da clínica."}
            </p>
          </div>
          {searchTerm ? (
            <Button
              variant="outline"
              size="sm"
              onClick={() => setSearchTerm("")}
            >
              Limpar busca
            </Button>
          ) : (
            <Button
              size="sm"
              onClick={handleOpenCreateModal}
              className="gap-1.5 mt-2"
            >
              <Plus className="w-4 h-4" /> Cadastrar Primeiro Procedimento
            </Button>
          )}
        </Card>
      )}

      {/* Modal de Criação / Edição */}
      <ProcedureModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSave={handleSaveModal}
        initialData={selectedProcedure}
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
              <AlertTriangle className="w-5 h-5" /> Excluir Procedimento?
            </DialogTitle>
            <DialogDescription className="text-sm">
              Esta ação removerá este procedimento do catálogo da clínica. Esta
              ação não poderá ser desfeita.
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
