"use client";

import { useState, useEffect } from "react";
import { useAuth } from "@/store/useAuth";
import { useDashboard } from "@/hooks/useDashboard";
import { useAppointments } from "@/hooks/useAppointments";
import { format, parseISO, isSameDay } from "date-fns";
import { ptBR } from "date-fns/locale";
import Link from "next/link";
import {
  Calendar,
  Users,
  Gift,
  RotateCw,
  MoreVertical,
  MessageCircle,
  Edit2,
  ChevronLeft,
  ChevronRight,
  Plus,
  Clock,
} from "lucide-react";

// ======================================================
// UTILS
// ======================================================

function getStatusColor(status: string) {
  switch (status) {
    case "CONFIRMED": return "text-emerald-700 bg-emerald-50 border-emerald-200";
    case "SCHEDULED": return "text-amber-700 bg-amber-50 border-amber-200";
    case "IN_PROGRESS": return "text-blue-700 bg-blue-50 border-blue-200";
    case "COMPLETED": return "text-purple-700 bg-purple-50 border-purple-200";
    case "CANCELED": return "text-rose-700 bg-rose-50 border-rose-200";
    default: return "text-gray-700 bg-gray-50 border-gray-200";
  }
}

function getStatusText(status: string) {
  switch (status) {
    case "CONFIRMED": return "Confirmado";
    case "SCHEDULED": return "Agendado";
    case "IN_PROGRESS": return "Em andamento";
    case "COMPLETED": return "Concluído";
    case "CANCELED": return "Cancelado";
    default: return status;
  }
}

// ======================================================
// COMPONENT
// ======================================================

export default function DashboardPage() {
  const { user } = useAuth();
  const { summary, loading } = useDashboard();
  const { getAppointmentsForDay } = useAppointments();

  const [currentDate, setCurrentDate] = useState("");
  const [selectedDate, setSelectedDate] = useState(new Date());

  const primeiroNome = user?.name?.split(" ")[0] || "";

  const dailyAgenda = getAppointmentsForDay(selectedDate);
  const formattedSelectedDate = format(selectedDate, "dd/MM/yyyy");

  const kpis = [
    {
      id: 1,
      title: "Agendamentos Hoje",
      value: summary?.appointmentsToday.total.toString() || "0",
      description: `${summary?.appointmentsToday.confirmados || 0} confirmados · ${summary?.appointmentsToday.agendados || 0} agendados`,
      icon: Calendar,
      color: "text-rose-600",
      bg: "bg-rose-50",
      borderColor: "border-rose-100",
    },
    {
      id: 2,
      title: "Clientes Cadastrados",
      value: summary?.patientsStats.total.toString() || "0",
      description: `+${summary?.patientsStats.newThisMonth || 0} este mês`,
      icon: Users,
      color: "text-blue-600",
      bg: "bg-blue-50",
      borderColor: "border-blue-100",
    },
    {
      id: 3,
      title: "Aniversariantes",
      value: summary?.birthdays.length.toString() || "0",
      description: "Neste mês",
      icon: Gift,
      color: "text-purple-600",
      bg: "bg-purple-50",
      borderColor: "border-purple-100",
    },
    {
      id: 4,
      title: "Clientes sem retorno",
      value: summary?.inactivePatients.length.toString() || "0",
      description: "Há mais de 90 dias",
      icon: RotateCw,
      color: "text-emerald-600",
      bg: "bg-emerald-50",
      borderColor: "border-emerald-100",
    },
  ];

  useEffect(() => {
    const date = new Date();

    const formattedDate = date.toLocaleDateString("pt-BR", {
      weekday: "long",
      day: "numeric",
      month: "long",
      year: "numeric",
    });

    setCurrentDate(
      formattedDate.charAt(0).toUpperCase() + formattedDate.slice(1),
    );
  }, []);

  return (
    <div className="w-full min-h-full flex flex-col pt-0 pb-8 font-sans bg-transparent relative">
      {/* Decorative background blur/gradient */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[300px] bg-rose-500/5 blur-[120px] rounded-full pointer-events-none -z-10" />

      {/* ==================================================
          HEADER
      ================================================== */}

      <header className="flex flex-col sm:flex-row sm:items-center justify-between gap-5 mb-7">
        <div>
          <h1 className="text-2xl font-semibold text-gray-800 tracking-tight">
            Bom dia, <span className="text-rose-600">{primeiroNome}!</span>
          </h1>

          <p className="text-gray-500 text-sm mt-1.5 flex items-center gap-2">
            <Calendar className="w-4 h-4 text-gray-400" />
            {currentDate}
          </p>
        </div>
      </header>

      {/* ==================================================
          KPIs
      ================================================== */}

      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-5 mb-8">
        {kpis.map((kpi) => (
          <div
            key={kpi.id}
            className="
              relative
              bg-white
              rounded-2xl
              p-6
              border border-gray-100
              shadow-sm
              hover:shadow-md
              transition-all
              duration-300
              flex flex-col
              overflow-hidden
              group
            "
          >
            {/* Subtle background glow on hover */}
            <div className={`absolute top-0 right-0 -mr-8 -mt-8 w-32 h-32 rounded-full ${kpi.bg} opacity-0 group-hover:opacity-70 transition-opacity duration-500 blur-2xl pointer-events-none`} />

            <div className="flex items-center justify-between mb-4 relative z-10">
              <p className="text-gray-500 text-sm font-medium">
                {kpi.title}
              </p>
              
              <div className={`p-2.5 rounded-xl ${kpi.bg} ${kpi.color} ring-1 ring-inset ${kpi.borderColor} shadow-sm group-hover:scale-110 transition-transform duration-300`}>
                <kpi.icon
                  className="w-5 h-5"
                  strokeWidth={2}
                />
              </div>
            </div>

            <div className="mb-2 relative z-10">
              <h3 className="text-3xl font-bold text-gray-900 tracking-tight">
                {kpi.value}
              </h3>
            </div>

            <div className="mt-auto pt-4 flex items-center justify-between gap-2 border-t border-gray-50 relative z-10">
              <p className="text-gray-400 text-[13px] font-medium">{kpi.description}</p>
            </div>
          </div>
        ))}
      </div>

      {/* ==================================================
          MAIN CONTENT
      ================================================== */}

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-5 flex-1">
        {/* ==================================================
            AGENDA
        ================================================== */}

        <div
          className="
            bg-white
            rounded-2xl
            border border-gray-100
            shadow-sm
            hover:shadow-md
            transition-shadow
            xl:col-span-2
            flex flex-col
          "
        >
          {/* Agenda Header */}

          <div className="px-5 sm:px-6 py-5 border-b border-gray-100 bg-gray-50/50 rounded-t-2xl">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <div className="flex items-center gap-2">
                  <div className="p-2 rounded-lg bg-rose-100/50 text-rose-500">
                    <Calendar className="w-5 h-5" />
                  </div>
                  <h2 className="text-lg font-semibold text-gray-800 tracking-tight">
                    Agenda de hoje
                  </h2>
                </div>

                <p className="text-sm text-gray-500 mt-1 ml-11">
                  Seus próximos atendimentos
                </p>
              </div>

              {/* Date navigation */}

              <div className="flex items-center gap-3">
                <div className="flex items-center gap-1 text-sm text-gray-600 font-medium">
                  <button
                    className="
                      p-1.5
                      hover:bg-gray-100
                      rounded-lg
                      transition-colors
                    "
                    title="Dia anterior"
                    onClick={() => {
                      const prevDate = new Date(selectedDate);
                      prevDate.setDate(prevDate.getDate() - 1);
                      setSelectedDate(prevDate);
                    }}
                  >
                    <ChevronLeft className="w-4 h-4" />
                  </button>

                  <span className="px-1">{formattedSelectedDate}</span>

                  <button
                    className="
                      p-1.5
                      hover:bg-gray-100
                      rounded-lg
                      transition-colors
                    "
                    title="Próximo dia"
                    onClick={() => {
                      const nextDate = new Date(selectedDate);
                      nextDate.setDate(nextDate.getDate() + 1);
                      setSelectedDate(nextDate);
                    }}
                  >
                    <ChevronRight className="w-4 h-4" />
                  </button>
                </div>

                <button
                  className="
                    bg-rose-50
                    text-rose-600
                    hover:bg-rose-100
                    px-3.5
                    py-2
                    rounded-lg
                    text-xs
                    font-medium
                    transition-colors
                  "
                  onClick={() => setSelectedDate(new Date())}
                >
                  Hoje
                </button>
              </div>
            </div>
          </div>

          {/* Agenda List */}

          <div className="flex-1 overflow-x-auto">
            <div className="min-w-[680px]">
              {dailyAgenda.length === 0 ? (
                <div className="p-8 text-center text-gray-500">
                  Nenhum agendamento para este dia.
                </div>
              ) : (
                dailyAgenda.map((item, index) => (
                  <div
                    key={item.id}
                    className="
                      relative
                      flex
                      items-center
                      gap-4
                      px-5 sm:px-6
                      py-4
                      border-b border-gray-50
                      hover:bg-gray-50/60
                      transition-colors
                      group
                    "
                  >
                    {/* Timeline */}

                    <div className="w-[62px] shrink-0">
                      <div className="text-right">
                        <span className="text-sm font-semibold text-rose-500">
                          {item.startTime}
                        </span>

                        <div className="flex items-center justify-end gap-1 mt-0.5">
                          <Clock className="w-3 h-3 text-gray-300" />

                          <span className="text-[11px] text-gray-400">
                            {item.durationMinutes} min
                          </span>
                        </div>
                      </div>
                    </div>

                    {/* Timeline line */}

                    <div className="relative self-stretch flex items-center justify-center w-3">
                      {index !== dailyAgenda.length - 1 && (
                        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 w-px h-[calc(100%+1px)] bg-gray-100" />
                      )}

                      <div className="relative z-10 w-2.5 h-2.5 rounded-full bg-rose-400 ring-4 ring-rose-50" />
                    </div>

                    {/* Patient */}

                    <div className="flex items-center gap-3 flex-1 min-w-0">
                      <div
                        className="
                          w-10 h-10
                          rounded-full
                          bg-rose-100
                          flex items-center justify-center
                          text-rose-600
                          font-semibold
                          text-sm
                          shrink-0
                        "
                      >
                        {item.patientName.charAt(0).toUpperCase()}
                      </div>

                      <div className="min-w-0">
                        <p className="text-sm font-medium text-gray-800 truncate">
                          {item.patientName}
                        </p>

                        <p className="text-xs text-gray-500 mt-0.5 truncate">
                          {item.procedure}
                        </p>
                      </div>
                    </div>

                    {/* Actions */}

                    <div className="flex items-center gap-2 shrink-0">
                      <button
                        className="
                          p-2
                          text-green-500
                          hover:bg-green-50
                          rounded-lg
                          transition-colors
                          opacity-70
                          group-hover:opacity-100
                        "
                        title="Enviar WhatsApp"
                      >
                        <MessageCircle className="w-4 h-4" />
                      </button>

                      <span
                        className={`
                          px-3
                          py-1.5
                          rounded-full
                          text-[11px]
                          font-medium
                          border
                          ${getStatusColor(item.status)}
                        `}
                      >
                        {getStatusText(item.status)}
                      </span>

                      <button
                        className="
                          p-2
                          text-gray-400
                          hover:text-rose-500
                          hover:bg-rose-50
                          rounded-lg
                          transition-colors
                          opacity-60
                          group-hover:opacity-100
                        "
                        title="Editar"
                      >
                        <Edit2 className="w-4 h-4" />
                      </button>

                      <button
                        className="
                          p-2
                          text-gray-400
                          hover:text-gray-600
                          hover:bg-gray-100
                          rounded-lg
                          transition-colors
                        "
                        title="Mais opções"
                      >
                        <MoreVertical className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>

        {/* ==================================================
            RIGHT COLUMN
        ================================================== */}

        <div className="flex flex-col gap-5">
          {/* ==================================================
              ANIVERSÁRIOS
          ================================================== */}

          <div
            className="
              bg-white
              rounded-2xl
              border border-gray-100
              shadow-sm
              hover:shadow-md
              transition-shadow
              p-5 sm:p-6
            "
          >
            <div className="flex items-start justify-between mb-5">
              <div>
                <div className="flex items-center gap-2">
                  <div className="p-2 rounded-lg bg-purple-100/50 text-purple-500">
                    <Gift className="w-5 h-5" />
                  </div>
                  <h2 className="text-lg font-semibold text-gray-800 tracking-tight">
                    Próximos aniversários
                  </h2>
                </div>

                <p className="text-sm text-gray-500 mt-1 ml-11">
                  Clientes que fazem aniversário
                </p>
              </div>
            </div>

            <div className="flex flex-col">
              {!summary?.birthdays.length ? (
                <p className="text-sm text-gray-500 py-4 text-center">Nenhum aniversariante este mês.</p>
              ) : (
                summary.birthdays.map((person, index) => {
                  const bDate = new Date(person.birthDate);
                  const bDay = bDate.getDate();
                  const bMonth = bDate.getMonth() + 1;
                  const dateFormatted = `${bDay.toString().padStart(2, '0')}/${bMonth.toString().padStart(2, '0')}`;
                  return (
                    <div
                      key={person.id}
                      className={`
                        flex items-center justify-between
                        py-3
                        ${
                          index !== summary.birthdays.length - 1
                            ? "border-b border-gray-50"
                            : ""
                        }
                      `}
                    >
                      <div className="flex items-center gap-3 min-w-0">
                        <div
                          className="
                            w-10 h-10
                            rounded-full
                            bg-purple-100
                            flex items-center justify-center
                            text-purple-600
                            font-semibold
                            text-sm
                            shrink-0
                          "
                        >
                          {person.name.charAt(0).toUpperCase()}
                        </div>

                        <div className="min-w-0">
                          <p className="text-sm font-medium text-gray-800 truncate">
                            {person.name}
                          </p>
                        </div>
                      </div>

                      <div className="text-right ml-3 shrink-0">
                        <span className="text-sm font-semibold text-purple-600 bg-purple-50 px-2.5 py-1 rounded-md">
                          {dateFormatted}
                        </span>
                      </div>
                    </div>
                  );
                })
              )}
            </div>
          </div>

          {/* ==================================================
              CLIENTES SEM RETORNO
          ================================================== */}

          <div
            className="
              bg-white
              rounded-2xl
              border border-gray-100
              shadow-sm
              hover:shadow-md
              transition-shadow
              p-5 sm:p-6
              relative
              overflow-hidden
            "
          >
            <div className="flex items-start gap-3 relative z-10">
              <div className="p-2.5 rounded-lg bg-emerald-100 shrink-0">
                <RotateCw
                  className="w-5 h-5 text-emerald-600"
                  strokeWidth={2}
                />
              </div>

              <div>
                <h2 className="text-lg font-semibold text-gray-800 tracking-tight">
                  Clientes sem retorno
                </h2>

                <p className="text-sm text-gray-500 mt-1">Há mais de 90 dias</p>
              </div>
            </div>

            <div className="mt-6 flex items-end justify-between relative z-10">
              <div>
                <p className="text-4xl font-bold text-gray-900 tracking-tight">
                  {summary?.inactivePatients.length || 0}
                </p>

                <p className="text-sm text-gray-500 mt-1 font-medium">
                  clientes precisam de atenção
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
