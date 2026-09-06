"use client";

import { useState, useEffect } from "react";
import { useAuth } from "@/store/useAuth";
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
// MOCK DATA
// ======================================================

const kpis = [
  {
    id: 1,
    title: "Agendamentos Hoje",
    value: "08",
    description: "5 confirmados · 3 agendados",
    icon: Calendar,
    color: "text-rose-500",
    bg: "bg-rose-100",
    linkText: "Ver agenda →",
  },
  {
    id: 2,
    title: "Clientes Cadastrados",
    value: "452",
    description: "+12 este mês",
    icon: Users,
    color: "text-amber-500",
    bg: "bg-amber-100",
    linkText: "Ver clientes →",
  },
  {
    id: 3,
    title: "Aniversariantes",
    value: "05",
    description: "Neste mês",
    icon: Gift,
    color: "text-purple-500",
    bg: "bg-purple-100",
    linkText: "Ver aniversariantes →",
  },
  {
    id: 4,
    title: "Clientes sem retorno",
    value: "23",
    description: "Há mais de 90 dias",
    icon: RotateCw,
    color: "text-emerald-500",
    bg: "bg-emerald-100",
    linkText: "Ver lista →",
  },
];

const agenda = [
  {
    id: 1,
    time: "09:00",
    duration: "30 min",
    name: "Maria Silva",
    procedure: "Botox · Toxina Botulínica",
    status: "Confirmado",
    statusColor: "text-emerald-700 bg-emerald-50 border-emerald-200",
  },
  {
    id: 2,
    time: "10:30",
    duration: "45 min",
    name: "Juliana Souza",
    procedure: "Preenchimento Labial",
    status: "Agendado",
    statusColor: "text-amber-700 bg-amber-50 border-amber-200",
  },
  {
    id: 3,
    time: "14:00",
    duration: "60 min",
    name: "Fernanda Lima",
    procedure: "Bioestimulador de Colágeno",
    status: "Agendado",
    statusColor: "text-amber-700 bg-amber-50 border-amber-200",
  },
  {
    id: 4,
    time: "15:30",
    duration: "30 min",
    name: "Carla Mendes",
    procedure: "Avaliação · Harmonização",
    status: "Confirmado",
    statusColor: "text-emerald-700 bg-emerald-50 border-emerald-200",
  },
  {
    id: 5,
    time: "16:30",
    duration: "45 min",
    name: "Patrícia Alves",
    procedure: "Preenchimento Malar",
    status: "Agendado",
    statusColor: "text-amber-700 bg-amber-50 border-amber-200",
  },
];

const aniversariantes = [
  {
    id: 1,
    date: "25/06",
    subtitle: "Amanhã",
    name: "Juliana Costa",
  },
  {
    id: 2,
    date: "28/06",
    subtitle: "Sábado",
    name: "Ana Paula Lima",
  },
  {
    id: 3,
    date: "02/07",
    subtitle: "Próxima semana",
    name: "Fernanda Rocha",
  },
];

// ======================================================
// COMPONENT
// ======================================================

export default function DashboardPage() {
  const { user } = useAuth();

  const [currentDate, setCurrentDate] = useState("");

  const primeiroNome = user?.name?.split(" ")[0] || "";

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
    <div className="w-full min-h-full flex flex-col pt-0 pb-8 font-sans bg-transparent">
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

      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4 mb-7">
        {kpis.map((kpi) => (
          <div
            key={kpi.id}
            className="
              bg-white
              rounded-xl
              p-5
              border border-gray-100
              shadow-sm
              hover:shadow-md
              transition-shadow
              min-h-[154px]
              flex flex-col
            "
          >
            <div className="flex items-start gap-3">
              {/* Icon */}
              <div className={`p-2.5 rounded-lg ${kpi.bg} shrink-0`}>
                <kpi.icon
                  className={`w-5 h-5 ${kpi.color}`}
                  strokeWidth={1.75}
                />
              </div>

              {/* Info */}
              <div className="min-w-0">
                <p className="text-gray-500 text-xs font-medium leading-4">
                  {kpi.title}
                </p>

                <h3 className="text-2xl font-semibold text-gray-800 mt-0.5 tracking-tight">
                  {kpi.value}
                </h3>
              </div>
            </div>

            <div className="mt-auto pt-4 flex items-end justify-between gap-2">
              <p className="text-gray-400 text-[11px]">{kpi.description}</p>

              <button
                className={`
                  ${kpi.color}
                  text-[11px]
                  font-medium
                  whitespace-nowrap
                  hover:underline
                  transition-colors
                `}
              >
                {kpi.linkText}
              </button>
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
            xl:col-span-2
            overflow-hidden
            flex flex-col
          "
        >
          {/* Agenda Header */}

          <div className="px-5 sm:px-6 py-5 border-b border-gray-100">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <div className="flex items-center gap-2">
                  <Calendar className="w-5 h-5 text-rose-500" />

                  <h2 className="text-base font-semibold text-gray-800">
                    Agenda de hoje
                  </h2>
                </div>

                <p className="text-xs text-gray-400 mt-1 ml-7">
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
                  >
                    <ChevronLeft className="w-4 h-4" />
                  </button>

                  <span className="px-1">06/09/2026</span>

                  <button
                    className="
                      p-1.5
                      hover:bg-gray-100
                      rounded-lg
                      transition-colors
                    "
                    title="Próximo dia"
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
                >
                  Ver semana
                </button>
              </div>
            </div>
          </div>

          {/* Agenda List */}

          <div className="flex-1 overflow-x-auto">
            <div className="min-w-[680px]">
              {agenda.map((item, index) => (
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
                        {item.time}
                      </span>

                      <div className="flex items-center justify-end gap-1 mt-0.5">
                        <Clock className="w-3 h-3 text-gray-300" />

                        <span className="text-[11px] text-gray-400">
                          {item.duration}
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Timeline line */}

                  <div className="relative self-stretch flex items-center justify-center w-3">
                    {index !== agenda.length - 1 && (
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
                      {item.name.charAt(0)}
                    </div>

                    <div className="min-w-0">
                      <p className="text-sm font-medium text-gray-800 truncate">
                        {item.name}
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
                        ${item.statusColor}
                      `}
                    >
                      {item.status}
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
              ))}
            </div>
          </div>

          {/* Footer */}

          <div className="px-5 py-4 border-t border-gray-100 text-center">
            <button
              className="
                text-rose-500
                text-xs
                font-medium
                hover:text-rose-700
                hover:underline
                transition-colors
              "
            >
              Ver todos os agendamentos →
            </button>
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
              p-5 sm:p-6
            "
          >
            <div className="flex items-start justify-between mb-5">
              <div>
                <div className="flex items-center gap-2">
                  <Gift className="w-5 h-5 text-purple-500" />

                  <h2 className="text-base font-semibold text-gray-800">
                    Próximos aniversários
                  </h2>
                </div>

                <p className="text-xs text-gray-400 mt-1 ml-7">
                  Clientes que fazem aniversário
                </p>
              </div>
            </div>

            <div className="flex flex-col">
              {aniversariantes.map((person, index) => (
                <div
                  key={person.id}
                  className={`
                    flex items-center justify-between
                    py-3
                    ${
                      index !== aniversariantes.length - 1
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
                      {person.name.charAt(0)}
                    </div>

                    <div className="min-w-0">
                      <p className="text-sm font-medium text-gray-800 truncate">
                        {person.name}
                      </p>

                      <p className="text-xs text-gray-400 mt-0.5">
                        {person.subtitle}
                      </p>
                    </div>
                  </div>

                  <div className="text-right ml-3 shrink-0">
                    <span className="text-sm font-medium text-gray-700">
                      {person.date}
                    </span>
                  </div>
                </div>
              ))}
            </div>

            <div className="mt-4 pt-4 border-t border-gray-100">
              <button
                className="
                  w-full
                  text-purple-500
                  text-xs
                  font-medium
                  hover:text-purple-700
                  transition-colors
                "
              >
                Ver todos os aniversariantes →
              </button>
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
              p-5 sm:p-6
            "
          >
            <div className="flex items-start gap-3">
              <div className="p-2.5 rounded-lg bg-emerald-100 shrink-0">
                <RotateCw
                  className="w-5 h-5 text-emerald-500"
                  strokeWidth={1.75}
                />
              </div>

              <div>
                <h2 className="text-base font-semibold text-gray-800">
                  Clientes sem retorno
                </h2>

                <p className="text-xs text-gray-400 mt-1">Há mais de 90 dias</p>
              </div>
            </div>

            <div className="mt-5 flex items-end justify-between">
              <div>
                <p className="text-3xl font-semibold text-gray-800 tracking-tight">
                  23
                </p>

                <p className="text-xs text-gray-400 mt-1">
                  clientes precisam de atenção
                </p>
              </div>

              <button
                className="
                  text-emerald-500
                  text-xs
                  font-medium
                  hover:text-emerald-700
                  transition-colors
                "
              >
                Ver lista →
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
