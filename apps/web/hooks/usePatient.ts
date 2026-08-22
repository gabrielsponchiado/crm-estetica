import { useState, useEffect, useCallback } from "react";
import {
  ApiPatient,
  Patient,
  CreatePatientInput,
  UpdatePatientInput,
  PaginatedPatientsResponse,
} from "@/types/patient";
import { fetcher } from "@/lib/api";

export type {
  ApiPatient,
  Patient,
  CreatePatientInput,
  UpdatePatientInput,
  PaginatedPatientsResponse,
};

export function usePatients(itemsPerPage = 10) {
  const [patients, setPatients] = useState<Patient[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [searchTerm, setSearchTerm] = useState<string>("");
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [totalPages, setTotalPages] = useState<number>(1);
  const [totalPatients, setTotalPatients] = useState<number>(0);
  const [error, setError] = useState<string | null>(null);

  const normalizePatient = (item: ApiPatient): Patient => ({
    id: String(item.id),
    name: item.name,
    phone: item.phone,
    email: item.email || null,
    birthDate: item.birthDate ? String(item.birthDate) : null,
    cpf: item.cpf || null,
    address: item.address || null,
    createdAt: item.createdAt,
    updatedAt: item.updatedAt,
  });

  const fetchPatients = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);

      const params = new URLSearchParams({
        page: String(currentPage),
        limit: String(itemsPerPage),
      });

      if (searchTerm.trim()) {
        params.append("search", searchTerm.trim());
      }

      const json = await fetcher<PaginatedPatientsResponse | ApiPatient[]>(
        `/patients?${params.toString()}`
      );

      if ("data" in json && Array.isArray(json.data)) {
        setPatients(json.data.map(normalizePatient));
        setTotalPages(json.meta?.totalPages || 1);
        setTotalPatients(json.meta?.total || 0);
      } else if (Array.isArray(json)) {
        setPatients(json.map(normalizePatient));
        setTotalPatients(json.length);
        setTotalPages(1);
      }
    } catch (err: unknown) {
      const errorMessage =
        err instanceof Error ? err.message : "Erro desconhecido ao carregar clientes.";
      console.error("Erro na requisição da API:", errorMessage);
      setError("Não foi possível conectar ao servidor.");
    } finally {
      setLoading(false);
    }
  }, [currentPage, itemsPerPage, searchTerm]);

  useEffect(() => {
    fetchPatients();
  }, [fetchPatients]);

  const handleSearchChange = (term: string) => {
    setSearchTerm(term);
    setCurrentPage(1);
  };

  // Criar Cliente
  const createPatient = async (
    input: CreatePatientInput,
  ): Promise<{ success: boolean; error?: string }> => {
    setIsSubmitting(true);
    try {
      await fetcher("/patients", {
        method: "POST",
        body: JSON.stringify(input),
      });
      await fetchPatients();
      return { success: true };
    } catch (err: unknown) {
      const errorMessage =
        err instanceof Error ? err.message : "Erro ao criar cliente.";
      console.error("Erro ao criar cliente:", errorMessage);
      return { success: false, error: errorMessage };
    } finally {
      setIsSubmitting(false);
    }
  };

  // Editar Cliente
  const updatePatient = async (
    id: string,
    input: UpdatePatientInput,
  ): Promise<{ success: boolean; error?: string }> => {
    setIsSubmitting(true);
    try {
      await fetcher(`/patients/${id}`, {
        method: "PATCH",
        body: JSON.stringify(input),
      });
      await fetchPatients();
      return { success: true };
    } catch (err: unknown) {
      const errorMessage =
        err instanceof Error ? err.message : "Erro ao atualizar cliente.";
      console.error("Erro ao atualizar cliente:", errorMessage);
      return { success: false, error: errorMessage };
    } finally {
      setIsSubmitting(false);
    }
  };

  // Excluir Cliente
  const deletePatient = async (id: string): Promise<boolean> => {
    try {
      await fetcher(`/patients/${id}`, { method: "DELETE" });
      await fetchPatients();
      return true;
    } catch (err: unknown) {
      const errorMessage =
        err instanceof Error ? err.message : "Erro ao deletar cliente.";
      console.error("Erro ao deletar cliente:", errorMessage);
      return false;
    }
  };

  return {
    patients,
    totalPatients,
    loading,
    isSubmitting,
    error,
    searchTerm,
    setSearchTerm: handleSearchChange,
    currentPage,
    totalPages,
    setCurrentPage,
    refetch: fetchPatients,
    createPatient,
    updatePatient,
    deletePatient,
  };
}
