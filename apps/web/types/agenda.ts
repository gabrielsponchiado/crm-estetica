export type AppointmentStatus =
  | "SCHEDULED"
  | "CONFIRMED"
  | "IN_PROGRESS"
  | "COMPLETED"
  | "CANCELED"
  | "NO_SHOW";

export interface AppointmentPatient {
  id: string;
  name: string;
  phone: string;
  email?: string | null;
}

export interface AppointmentProcedure {
  id: string;
  name: string;
  description?: string | null;
  price: string | number;
  durationMinutes: number;
}

export interface Appointment {
  id: string;
  patientId: string;
  userId?: string | null;
  procedureId?: string | null;
  scheduledAt: string;
  durationMinutes: number;
  status: AppointmentStatus;
  notes?: string | null;
  createdAt: string;
  updatedAt: string;
  patient: AppointmentPatient;
  procedure?: AppointmentProcedure | null;
}

export interface CreateAppointmentDTO {
  patientId: string;
  procedureId?: string;
  date: string;
  duration: number;
  notes?: string;
}

export interface UpdateAppointmentDTO {
  patientId?: string;
  procedureId?: string | null;
  date?: string;
  duration?: number;
  notes?: string | null;
  status?: AppointmentStatus;
}

export type ViewMode = "day" | "week" | "month";

export interface AgendaStatsData {
  total: number;
  confirmed: number;
  scheduled: number;
  inProgress: number;
  canceled: number;
}
