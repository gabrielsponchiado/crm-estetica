// ============================================================
// Tipos relacionados a Pacientes (Patient)
// ============================================================

/** Dado bruto recebido da API (antes de normalização) */
export interface ApiPatient {
  id: string | number;
  name: string;
  phone: string;
  email?: string | null;
  birthDate?: string | Date | null;
  cpf?: string | null;
  address?: string | null;
  createdAt?: string;
  updatedAt?: string;
}

/** Tipo normalizado usado nos componentes React */
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

/** Payload de criação enviado para a API */
export interface CreatePatientInput {
  name: string;
  phone: string;
  email?: string;
  birthDate?: string;
  cpf?: string;
  address?: string;
}

/** Payload de atualização (todos os campos opcionais) */
export type UpdatePatientInput = Partial<CreatePatientInput>;

/** Resposta paginada da API de pacientes */
export interface PaginatedPatientsResponse {
  data: ApiPatient[];
  meta: {
    total: number;
    page: number;
    limit: number;
    totalPages: number;
    hasNextPage: boolean;
    hasPreviousPage: boolean;
  };
}

/** Erros de formulário do modal de paciente */
export interface PatientFormErrors {
  name?: string;
  phone?: string;
  cpf?: string;
}
