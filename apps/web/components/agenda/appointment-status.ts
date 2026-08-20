import type { AppointmentStatus } from "@/types/appointment";

export const statusConfig: Record<
  AppointmentStatus,
  {
    label: string;
    dot: string;
    border: string;
    bg: string;
    hover: string;
    text: string;
    badge: string;
  }
> = {
  SCHEDULED: {
    label: "Agendado",
    dot: "bg-amber-500",
    border: "border-l-amber-500",
    bg: "bg-amber-500/[0.055]",
    hover: "hover:bg-amber-500/[0.10]",
    text: "text-amber-700 dark:text-amber-400",
    badge: "border-amber-200 bg-amber-50 text-amber-700",
  },
  CONFIRMED: {
    label: "Confirmado",
    dot: "bg-emerald-500",
    border: "border-l-emerald-500",
    bg: "bg-emerald-500/[0.055]",
    hover: "hover:bg-emerald-500/[0.10]",
    text: "text-emerald-700 dark:text-emerald-400",
    badge: "border-emerald-200 bg-emerald-50 text-emerald-700",
  },
  IN_PROGRESS: {
    label: "Em atendimento",
    dot: "bg-rose-500",
    border: "border-l-rose-500",
    bg: "bg-rose-500/[0.055]",
    hover: "hover:bg-rose-500/[0.10]",
    text: "text-rose-700 dark:text-rose-400",
    badge: "border-blue-200 bg-blue-50 text-blue-700",
  },
  COMPLETED: {
    label: "Concluído",
    dot: "bg-slate-400",
    border: "border-l-slate-400",
    bg: "bg-slate-500/[0.045]",
    hover: "hover:bg-slate-500/[0.08]",
    text: "text-slate-600 dark:text-slate-400",
    badge: "border-slate-200 bg-slate-50 text-slate-700",
  },
  CANCELED: {
    label: "Cancelado",
    dot: "bg-destructive",
    border: "border-l-destructive",
    bg: "bg-destructive/[0.045]",
    hover: "hover:bg-destructive/[0.08]",
    text: "text-destructive",
    badge: "border-red-200 bg-red-50 text-red-700",
  },
  NO_SHOW: {
    label: "Não compareceu",
    dot: "bg-slate-500",
    border: "border-l-slate-500",
    bg: "bg-slate-500/[0.06]",
    hover: "hover:bg-slate-500/[0.10]",
    text: "text-slate-600 dark:text-slate-400",
    badge: "border-slate-300 bg-slate-100 text-slate-700",
  },
};