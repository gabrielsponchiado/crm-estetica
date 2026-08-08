import { useState, useEffect, useMemo, useCallback } from 'react';

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

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3333/api';

const DEFAULT_FALLBACK_PROCEDURES: Procedure[] = [
  {
    id: 'demo-1',
    name: 'Toxina Botulínica (Botox)',
    durationMinutes: 60,
    price: 1200,
    description: 'Aplicação de toxina botulínica em terço superior da face (testa, glabela e pés de galinha) para prevenção de rugas dinâmicas.',
    recommendedMonths: 6,
  },
  {
    id: 'demo-2',
    name: 'Preenchimento Labial com Ácido Hialurônico',
    durationMinutes: 90,
    price: 1500,
    description: 'Restauração de volume, contorno e hidratação dos lábios com técnica personalizada e acabamento natural.',
    recommendedMonths: 12,
  },
  {
    id: 'demo-3',
    name: 'Bioestimulador de Colágeno (Sculptra / Radiesse)',
    durationMinutes: 60,
    price: 2400,
    description: 'Estímulo profundo da produção de colágeno natural da pele para firmeza, melhora do contorno e combate a flacidez.',
    recommendedMonths: 12,
  },
  {
    id: 'demo-4',
    name: 'Limpeza de Pele Fotônica Profunda',
    durationMinutes: 75,
    price: 280,
    description: 'Higienização, emoliência com vapor de ozônio, extração manual, alta frequência e LED terapia regenerativa.',
    recommendedMonths: 1,
  },
  {
    id: 'demo-5',
    name: 'Peeling Químico Renovador',
    durationMinutes: 45,
    price: 450,
    description: 'Aplicação de ácidos específicos para renovação celular, clareamento de manchas (melasma) e uniformização da textura da pele.',
    recommendedMonths: 3,
  },
];

export function useProcedures() {
  const [procedures, setProcedures] = useState<Procedure[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [sortBy, setSortBy] = useState<'name' | 'price-asc' | 'price-desc' | 'duration'>('name');
  const [error, setError] = useState<string | null>(null);

  // Normaliza dados recebidos da API (garante que price seja número)
  const normalizeProcedure = (item: any): Procedure => ({
    id: String(item.id),
    name: item.name,
    durationMinutes: Number(item.durationMinutes) || 0,
    price: typeof item.price === 'string' ? parseFloat(item.price) : Number(item.price) || 0,
    description: item.description || '',
    recommendedMonths: item.recommendedMonths ? Number(item.recommendedMonths) : undefined,
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
      if (Array.isArray(data) && data.length > 0) {
        setProcedures(data.map(normalizeProcedure));
      } else {
        // Se o banco estiver vazio, usa os procedimentos de demonstração
        setProcedures(DEFAULT_FALLBACK_PROCEDURES);
      }
    } catch (err: any) {
      console.warn('API de procedimentos indisponível, utilizando dados locais:', err.message);
      setError('Servidor indisponível. Exibindo dados locais.');
      setProcedures((prev) => (prev.length > 0 ? prev : DEFAULT_FALLBACK_PROCEDURES));
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
      const res = await fetch(`${API_URL}/procedures`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(input),
      });

      if (res.ok) {
        const created = await res.json();
        setProcedures((prev) => [normalizeProcedure(created), ...prev]);
        return true;
      }
    } catch (err) {
      console.warn('Erro ao conectar com API para criar procedimento. Salvando localmente.', err);
    } finally {
      setIsSubmitting(false);
    }

    // Fallback local se a API não estiver respondendo
    const newLocal: Procedure = {
      id: `local-${Date.now()}`,
      ...input,
    };
    setProcedures((prev) => [newLocal, ...prev]);
    return true;
  };

  // Atualiza um procedimento existente
  const updateProcedure = async (id: string, input: UpdateProcedureInput): Promise<boolean> => {
    setIsSubmitting(true);
    try {
      const res = await fetch(`${API_URL}/procedures/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(input),
      });

      if (res.ok) {
        const updated = await res.json();
        const normalized = normalizeProcedure(updated);
        setProcedures((prev) => prev.map((p) => (p.id === id ? normalized : p)));
        return true;
      }
    } catch (err) {
      console.warn('Erro ao conectar com API para atualizar procedimento. Atualizando localmente.', err);
    } finally {
      setIsSubmitting(false);
    }

    // Fallback local
    setProcedures((prev) =>
      prev.map((p) => (p.id === id ? { ...p, ...input } : p))
    );
    return true;
  };

  // Exclui um procedimento
  const deleteProcedure = async (id: string): Promise<boolean> => {
    try {
      await fetch(`${API_URL}/procedures/${id}`, {
        method: 'DELETE',
      });
    } catch (err) {
      console.warn('Erro ao conectar com API para remover procedimento. Removendo localmente.', err);
    }

    // Atualiza estado local em qualquer caso
    setProcedures((prev) => prev.filter((p) => p.id !== id));
    return true;
  };

  // Procedimentos filtrados e ordenados
  const filteredProcedures = useMemo(() => {
    let list = procedures.filter((p) =>
      p.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (p.description && p.description.toLowerCase().includes(searchTerm.toLowerCase()))
    );

    return list.sort((a, b) => {
      if (sortBy === 'price-asc') return a.price - b.price;
      if (sortBy === 'price-desc') return b.price - a.price;
      if (sortBy === 'duration') return a.durationMinutes - b.durationMinutes;
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