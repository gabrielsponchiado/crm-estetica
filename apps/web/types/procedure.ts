// ============================================================
// Tipos relacionados a Procedimentos (Procedure)
// ============================================================

/** Unidades de tempo para duração de procedimentos */
export type DurationUnit = "minutes" | "hours";

/** Dado bruto recebido da API (price pode vir como string do Prisma Decimal) */
export interface ApiProcedure {
  id: string | number;
  name: string;
  durationMinutes: number;
  price: number | string;
  description?: string | null;
  recommendedMonths?: number | null;
  createdAt?: string;
  updatedAt?: string;
}

/** Tipo normalizado usado nos componentes React */
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

/** Payload de criação enviado para a API */
export interface CreateProcedureInput {
  name: string;
  durationMinutes: number;
  price: number;
  description?: string;
  recommendedMonths?: number;
}

/** Payload de atualização (todos os campos opcionais) */
export type UpdateProcedureInput = Partial<CreateProcedureInput>;

/** Opções de ordenação disponíveis na listagem */
export type ProcedureSortOption =
  | "name"
  | "price-asc"
  | "price-desc"
  | "duration";

/** Estatísticas calculadas do catálogo */
export interface ProcedureStats {
  total: number;
  averagePrice: number;
  averageDuration: number;
}

/** Erros de formulário do modal de procedimento */
export interface ProcedureFormErrors {
  name?: string;
  durationValue?: string;
  price?: string;
}
