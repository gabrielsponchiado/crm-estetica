// ============================================================
// Tipos relacionados a Agendamentos (Appointment)
// ============================================================

/** Payload de criação de agendamento enviado para a API */
export interface CreateAppointmentInput {
  patientName: string;
  phone: string;
  procedure: string;
  date: string;
  startTime: string;
  durationMinutes: number;
  notes?: string;
}
