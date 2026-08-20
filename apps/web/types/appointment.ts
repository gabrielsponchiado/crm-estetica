// ============================================================
// Tipos relacionados a Agendamentos (Appointment)
// ============================================================

export type AppointmentStatus =
  | "SCHEDULED"
  | "CONFIRMED"
  | "IN_PROGRESS"
  | "COMPLETED"
  | "CANCELED"
  | "NO_SHOW";

/** Paciente/Procedimento resumidos, como vêm aninhados no Appointment da API */
export interface ApiAppointmentPatient {
  id: string;
  name: string;
  phone: string;
}

export interface ApiAppointmentProcedure {
  id: string;
  name: string;
  durationMinutes: number;
}

/** Dado bruto recebido da API (GET /agenda) */
export interface ApiAppointment {
  id: string;
  patientId: string;
  procedureId: string | null;
  scheduledAt: string;
  durationMinutes: number;
  status: AppointmentStatus;
  notes: string | null;
  patient: ApiAppointmentPatient;
  procedure: ApiAppointmentProcedure | null;
}

/** Tipo normalizado usado nos componentes React */
export interface Appointment {
  id: string;
  patientId: string;
  patientName: string;
  phone: string;
  procedureId: string;
  procedure: string;
  date: string; // yyyy-MM-dd
  startTime: string; // HH:mm
  durationMinutes: number;
  notes?: string;
  status: AppointmentStatus;
}

/** Payload de criação enviado para a API (POST /agenda) */
export interface CreateAppointmentInput {
  patientId: string;
  procedureId: string;
  date: string; // yyyy-MM-dd
  startTime: string; // HH:mm
  durationMinutes: number;
  notes?: string;
}

/** Payload de atualização (PATCH /agenda/:id) */
export type UpdateAppointmentInput = Partial<CreateAppointmentInput> & {
  status?: AppointmentStatus;
};