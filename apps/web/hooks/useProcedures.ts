import { useState, useEffect, useMemo, useCallback } from "react";

export interface Procedure {
  id: string;
  name: string;
  durationMinutes: number;
  price: number;
  description?: string;
  recommendedMonths?: number;
  createdAt?: string;
  updatedAt?: string;
}

export interface CreateProcedureInput {
  name: string;
  durationMinutes: number;
  price: number;
  description?: string;
  recommendedMonths?: number;
}

export interface UpdateProcedureInput extends Partial<CreateProcedureInput> {}

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3333/api";

export function useProcedures() {
  const [procedures, setProcedures] = useState<Procedure[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [searchTerm, setSearchTerm] = useState<string>("");
  const [sortBy, setSortBy] = useState<
    "name" | "price-asc" | "price-desc" | "duration"
  >("name");
  const [error, setError] = useState<string | null>(null);

  // Normaliza dados recebidos da API (garante que price seja número)
  const normalizeProcedure = (item: any): Procedure => ({
    id: String(item.id),
    name: item.name,
    durationMinutes: Number(item.durationMinutes) || 0,
    price:
      typeof item.price === "string"
        ? parseFloat(item.price)
        : Number(item.price) || 0,
    description: item.description || "",
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
      const res = await fetch(`${API_URL}/procedures`);

      if (!res.ok) {
        throw new Error(`Servidor retornou status ${res.status}`);
      }

      const data = await res.json();
      if (Array.isArray(data)) {
        setProcedures(data.map(normalizeProcedure));
      } else {
        setProcedures([]);
      }
    } catch (err: any) {
      console.error("Erro ao buscar procedimentos da API:", err.message);
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
  const createProcedure = async (
    input: CreateProcedureInput,
  ): Promise<boolean> => {
    setIsSubmitting(true);
    try {
      const res = await fetch(`${API_URL}/procedures`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(input),
      });

      if (res.ok) {
        const created = await res.json();
        setProcedures((prev) => [normalizeProcedure(created), ...prev]);
        return true;
      }
      throw new Error("Falha ao criar procedimento no servidor");
    } catch (err: any) {
      console.error("Erro ao criar procedimento:", err.message);
      setError(err.message || "Erro ao salvar procedimento.");
      return false;
    } finally {
      setIsSubmitting(false);
    }
  };

  // Atualiza um procedimento existente
  const updateProcedure = async (
    id: string,
    input: UpdateProcedureInput,
  ): Promise<boolean> => {
    setIsSubmitting(true);
    try {
      const res = await fetch(`${API_URL}/procedures/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(input),
      });

      if (res.ok) {
        const updated = await res.json();
        const normalized = normalizeProcedure(updated);
        setProcedures((prev) =>
          prev.map((p) => (p.id === id ? normalized : p)),
        );
        return true;
      }
      throw new Error("Falha ao atualizar procedimento no servidor");
    } catch (err: any) {
      console.error("Erro ao atualizar procedimento:", err.message);
      setError(err.message || "Erro ao atualizar procedimento.");
      return false;
    } finally {
      setIsSubmitting(false);
    }
  };

  // Exclui um procedimento
  const deleteProcedure = async (id: string): Promise<boolean> => {
    try {
      const res = await fetch(`${API_URL}/procedures/${id}`, {
        method: "DELETE",
      });
      if (res.ok) {
        setProcedures((prev) => prev.filter((p) => p.id !== id));
        return true;
      }
      throw new Error("Falha ao excluir procedimento no servidor");
    } catch (err: any) {
      console.error("Erro ao excluir procedimento:", err.message);
      setError(err.message || "Erro ao remover procedimento.");
      return false;
    }
  };

  // Procedimentos filtrados e ordenados
  const filteredProcedures = useMemo(() => {
    let list = procedures.filter(
      (p) =>
        p.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (p.description &&
          p.description.toLowerCase().includes(searchTerm.toLowerCase())),
    );

    return list.sort((a, b) => {
      if (sortBy === "price-asc") return a.price - b.price;
      if (sortBy === "price-desc") return b.price - a.price;
      if (sortBy === "duration") return a.durationMinutes - b.durationMinutes;
      return a.name.localeCompare(b.name);
    });
  }, [procedures, searchTerm, sortBy]);

  // Estatísticas calculadas para a barra de métricas do SaaS
  const stats = useMemo(() => {
    const total = procedures.length;
    if (total === 0) {
      return { total: 0, averagePrice: 0, averageDuration: 0 };
    }
    const totalPrice = procedures.reduce((acc, p) => acc + p.price, 0);
    const totalDuration = procedures.reduce(
      (acc, p) => acc + p.durationMinutes,
      0,
    );

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
