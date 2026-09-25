"use client";

import { useState, useEffect, useCallback } from "react";
import { fetcher } from "@/lib/api";

export interface DashboardSummary {
  appointmentsToday: {
    total: number;
    confirmados: number;
    agendados: number;
  };
  patientsStats: {
    total: number;
    newThisMonth: number;
  };
  birthdays: Array<{
    id: string;
    name: string;
    birthDate: string;
  }>;
  inactivePatients: Array<{
    id: string;
    name: string;
    appointments: Array<{ scheduledAt: string }>;
  }>;
}

export function useDashboard() {
  const [summary, setSummary] = useState<DashboardSummary | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchSummary = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await fetcher<DashboardSummary>("/dashboard/summary");
      setSummary(data);
    } catch (err: unknown) {
      console.error("Erro ao buscar dashboard:", err);
      setError("Não foi possível carregar os dados do dashboard.");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchSummary();
  }, [fetchSummary]);

  return { summary, loading, error, refetch: fetchSummary };
}
