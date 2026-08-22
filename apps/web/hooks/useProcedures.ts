import { useState, useEffect, useMemo, useCallback } from "react";
import {
  ApiProcedure,
  Procedure,
  CreateProcedureInput,
  UpdateProcedureInput,
  ProcedureSortOption,
  ProcedureStats,
} from "@/types/procedure";
import { fetcher } from "@/lib/api";

// Re-exporta os tipos para quem importa deste hook (retrocompatibilidade)
export type {
  Procedure,
  CreateProcedureInput,
  UpdateProcedureInput,
  ProcedureSortOption,
  ProcedureStats,
};

export function useProcedures() {
  const [procedures, setProcedures] = useState<Procedure[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [searchTerm, setSearchTerm] = useState<string>("");
  const [sortBy, setSortBy] = useState<ProcedureSortOption>("name");
  const [error, setError] = useState<string | null>(null);

  // Normaliza dados recebidos da API (price pode vir como string do Prisma Decimal)
  const normalizeProcedure = (item: ApiProcedure): Procedure => ({
    id: String(item.id),
    name: item.name,
    durationMinutes: Number(item.durationMinutes) || 0,
    price:
      typeof item.price === "string"
        ? parseFloat(item.price)
        : Number(item.price) || 0,
    description: item.description ?? "",
    recommendedMonths:
      item.recommendedMonths != null
        ? Number(item.recommendedMonths)
        : undefined,
    createdAt: item.createdAt,
    updatedAt: item.updatedAt,
  });

  // Busca procedimentos no backend NestJS
  const fetchProcedures = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await fetcher<ApiProcedure[]>("/procedures");
      if (Array.isArray(data)) {
        setProcedures(data.map(normalizeProcedure));
      } else {
        setProcedures([]);
      }
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : "Erro desconhecido";
      console.error("Erro ao buscar procedimentos da API:", message);
      setError("Falha ao conectar com a API de procedimentos.");
      setProcedures([]);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchProcedures();
  }, [fetchProcedures]);

  // Cria um novo procedimento
  const createProcedure = async (input: CreateProcedureInput): Promise<boolean> => {
    setIsSubmitting(true);
    try {
      const created = await fetcher<ApiProcedure>("/procedures", {
        method: "POST",
        body: JSON.stringify(input),
      });
      setProcedures((prev) => [normalizeProcedure(created), ...prev]);
      return true;
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : "Erro ao salvar procedimento.";
      console.error("Erro ao criar procedimento:", message);
      setError(message);
      return false;
    } finally {
      setIsSubmitting(false);
    }
  };

  // Atualiza um procedimento existente
  const updateProcedure = async (id: string, input: UpdateProcedureInput): Promise<boolean> => {
    setIsSubmitting(true);
    try {
      const updated = await fetcher<ApiProcedure>(`/procedures/${id}`, {
        method: "PATCH",
        body: JSON.stringify(input),
      });
      const normalized = normalizeProcedure(updated);
      setProcedures((prev) => prev.map((p) => (p.id === id ? normalized : p)));
      return true;
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : "Erro ao atualizar procedimento.";
      console.error("Erro ao atualizar procedimento:", message);
      setError(message);
      return false;
    } finally {
      setIsSubmitting(false);
    }
  };

  // Exclui um procedimento
  const deleteProcedure = async (id: string): Promise<boolean> => {
    try {
      await fetcher(`/procedures/${id}`, { method: "DELETE" });
      setProcedures((prev) => prev.filter((p) => p.id !== id));
      return true;
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : "Erro ao remover procedimento.";
      console.error("Erro ao excluir procedimento:", message);
      setError(message);
      return false;
    }
  };

  // Procedimentos filtrados e ordenados
  const filteredProcedures = useMemo(() => {
    const list = procedures.filter(
      (p) =>
        p.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (p.description &&
          p.description.toLowerCase().includes(searchTerm.toLowerCase()))
    );

    return list.sort((a, b) => {
      if (sortBy === "price-asc") return a.price - b.price;
      if (sortBy === "price-desc") return b.price - a.price;
      if (sortBy === "duration") return a.durationMinutes - b.durationMinutes;
      return a.name.localeCompare(b.name);
    });
  }, [procedures, searchTerm, sortBy]);

  // Estatísticas calculadas para a barra de métricas do SaaS
  const stats: ProcedureStats = useMemo(() => {
    const total = procedures.length;
    if (total === 0) {
      return { total: 0, averagePrice: 0, averageDuration: 0 };
    }
    const totalPrice = procedures.reduce((acc, p) => acc + p.price, 0);
    const totalDuration = procedures.reduce((acc, p) => acc + p.durationMinutes, 0);

    return {
      total,
      averagePrice: Math.round(totalPrice / total),
      averageDuration: Math.round(totalDuration / total),
    };
  }, [procedures]);

  return {
    procedures: filteredProcedures,
    allProcedures: procedures,
    loading,
    isSubmitting,
    error,
    searchTerm,
    setSearchTerm,
    sortBy,
    setSortBy,
    stats,
    refetch: fetchProcedures,
    createProcedure,
    updateProcedure,
    deleteProcedure,
  };
}
