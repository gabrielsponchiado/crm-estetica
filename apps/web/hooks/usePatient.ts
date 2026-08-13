import { useState, useEffect, useCallback } from "react";
import {
  ApiPatient,
  Patient,
  CreatePatientInput,
  UpdatePatientInput,
  PaginatedPatientsResponse,
} from "@/types/patient";

// Re-exporta os tipos para quem importa deste hook (retrocompatibilidade)
export type { ApiPatient, Patient, CreatePatientInput, UpdatePatientInput, PaginatedPatientsResponse };

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3333/api";

export function usePatients(itemsPerPage = 10) {
  const [patients, setPatients] = useState<Patient[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [searchTerm, setSearchTerm] = useState<string>("");
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [totalPages, setTotalPages] = useState<number>(1);
  const [totalPatients, setTotalPatients] = useState<number>(0);
  const [error, setError] = useState<string | null>(null);

  // Normalização tipada sem usar `any`
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

  // Busca pacientes na API NestJS
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

      const res = await fetch(`${API_URL}/patients?${params.toString()}`);

      if (res.ok) {
        const json: PaginatedPatientsResponse | ApiPatient[] = await res.json();

        if ("data" in json && Array.isArray(json.data)) {
          setPatients(json.data.map(normalizePatient));
          setTotalPages(json.meta?.totalPages || 1);
          setTotalPatients(json.meta?.total || 0);
        } else if (Array.isArray(json)) {
          setPatients(json.map(normalizePatient));
          setTotalPatients(json.length);
          setTotalPages(1);
        }
      } else {
        setError("Erro ao carregar clientes.");
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
  const createPatient = async (input: CreatePatientInput): Promise<boolean> => {
    setIsSubmitting(true);
    try {
      const res = await fetch(`${API_URL}/patients`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(input),
      });

      if (res.ok) {
        await fetchPatients();
        return true;
      }
      return false;
    } catch (err: unknown) {
      const errorMessage =
        err instanceof Error ? err.message : "Erro ao criar cliente.";
      console.error("Erro ao criar cliente:", errorMessage);
      return false;
    } finally {
      setIsSubmitting(false);
    }
  };

  // Editar Cliente
  const updatePatient = async (
    id: string,
    input: UpdatePatientInput
  ): Promise<boolean> => {
    setIsSubmitting(true);
    try {
      const res = await fetch(`${API_URL}/patients/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(input),
      });

      if (res.ok) {
        await fetchPatients();
        return true;
      }
      return false;
    } catch (err: unknown) {
      const errorMessage =
        err instanceof Error ? err.message : "Erro ao atualizar cliente.";
      console.error("Erro ao atualizar cliente:", errorMessage);
      return false;
    } finally {
      setIsSubmitting(false);
    }
  };

  // Excluir Cliente
  const deletePatient = async (id: string): Promise<boolean> => {
    try {
      const res = await fetch(`${API_URL}/patients/${id}`, {
        method: "DELETE",
      });
      if (res.ok) {
        await fetchPatients();
        return true;
      }
      return false;
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