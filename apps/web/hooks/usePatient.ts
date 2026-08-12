import { useState, useEffect, useMemo, useCallback } from "react";

export interface Patient {
  id: string;
  name: string;
  phone: string;
  email?: string | null;
  birthDate?: string | null;
  cpf?: string | null;
  address?: string | null;
  createdAt?: string;
  updatedAt?: string;
}

export interface CreatePatientInput {
  name: string;
  phone: string;
  email?: string;
  birthDate?: string;
  cpf?: string;
  address?: string;
}

export interface UpdatePatientInput extends Partial<CreatePatientInput> {}

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3333/api";

const INITIAL_MOCK: Patient[] = [
  { id: "1", name: "Ana Silva", phone: "(11) 98765-4321", cpf: "123.456.789-00", email: "ana.silva@email.com" },
  { id: "2", name: "Beatriz Costa", phone: "(11) 91234-5678", cpf: "987.654.321-11", email: "bea.costa@email.com" },
  { id: "3", name: "Carla Souza", phone: "(11) 97777-8888", cpf: "456.789.123-22", email: "carla.souza@email.com" },
];

export function usePatients(itemsPerPage = 10) {
  const [patients, setPatients] = useState<Patient[]>(INITIAL_MOCK);
  const [loading, setLoading] = useState<boolean>(false);
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [searchTerm, setSearchTerm] = useState<string>("");
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [error, setError] = useState<string | null>(null);

  const normalizePatient = (item: any): Patient => ({
    id: String(item.id),
    name: item.name,
    phone: item.phone,
    email: item.email || null,
    birthDate: item.birthDate || null,
    cpf: item.cpf || null,
    address: item.address || null,
    createdAt: item.createdAt,
    updatedAt: item.updatedAt,
  });

  // Busca pacientes na API NestJS (fallback para Mock se offline)
  const fetchPatients = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const res = await fetch(`${API_URL}/patients`);

      if (res.ok) {
        const data = await res.json();
        if (Array.isArray(data)) {
          setPatients(data.map(normalizePatient));
        }
      }
    } catch (err: any) {
      console.warn("API de pacientes offline. Usando dados locais.");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchPatients();
  }, [fetchPatients]);

  // Resetar para a primeira página ao buscar
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
        const created = await res.json();
        setPatients((prev) => [normalizePatient(created), ...prev]);
        return true;
      }

      // Fallback local caso backend não esteja pronto
      const newPatient: Patient = { id: String(Date.now()), ...input };
      setPatients((prev) => [newPatient, ...prev]);
      return true;
    } catch (err: any) {
      const newPatient: Patient = { id: String(Date.now()), ...input };
      setPatients((prev) => [newPatient, ...prev]);
      return true;
    } finally {
      setIsSubmitting(false);
    }
  };

  // Editar Cliente
  const updatePatient = async (id: string, input: UpdatePatientInput): Promise<boolean> => {
    setIsSubmitting(true);
    try {
      const res = await fetch(`${API_URL}/patients/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(input),
      });

      if (res.ok) {
        const updated = await res.json();
        const normalized = normalizePatient(updated);
        setPatients((prev) => prev.map((p) => (p.id === id ? normalized : p)));
        return true;
      }

      setPatients((prev) => prev.map((p) => (p.id === id ? { ...p, ...input } : p)));
      return true;
    } catch (err: any) {
      setPatients((prev) => prev.map((p) => (p.id === id ? { ...p, ...input } : p)));
      return true;
    } finally {
      setIsSubmitting(false);
    }
  };

  // Excluir Cliente
  const deletePatient = async (id: string): Promise<boolean> => {
    try {
      await fetch(`${API_URL}/patients/${id}`, { method: "DELETE" });
      setPatients((prev) => prev.filter((p) => p.id !== id));
      return true;
    } catch (err: any) {
      setPatients((prev) => prev.filter((p) => p.id !== id));
      return true;
    }
  };

  // Filtro
  const filteredPatients = useMemo(() => {
    const term = searchTerm.toLowerCase();
    return patients.filter(
      (p) =>
        p.name.toLowerCase().includes(term) ||
        (p.email && p.email.toLowerCase().includes(term)) ||
        (p.cpf && p.cpf.includes(term)) ||
        p.phone.includes(term)
    );
  }, [patients, searchTerm]);

  // Paginação Client-Side
  const totalPages = Math.max(1, Math.ceil(filteredPatients.length / itemsPerPage));

  const paginatedPatients = useMemo(() => {
    const start = (currentPage - 1) * itemsPerPage;
    return filteredPatients.slice(start, start + itemsPerPage);
  }, [filteredPatients, currentPage, itemsPerPage]);

  return {
    patients: paginatedPatients,
    totalPatients: filteredPatients.length,
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