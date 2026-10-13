"use client";

import { useState } from "react";
import {
  Bell,
  Building2,
  ChevronRight,
  Lock,
  Settings,
  UserRound,
} from "lucide-react";

const sections = [
  {
    title: "Sua conta",
    items: [
      {
        id: "profile",
        label: "Perfil",
        icon: UserRound,
      },
      {
        id: "security",
        label: "Segurança",
        icon: Lock,
      },
      {
        id: "preferences",
        label: "Preferências",
        icon: Settings,
      },
    ],
  },
  {
    title: "Sua clínica",
    items: [
      {
        id: "clinic",
        label: "Informações da clínica",
        icon: Building2,
      },
    ],
  },
  {
    title: "Sistema",
    items: [
      {
        id: "notifications",
        label: "Notificações",
        icon: Bell,
      },
    ],
  },
];

export default function ConfiguracoesPage() {
  const [activeSection, setActiveSection] = useState("profile");

  return (
    <div className="flex min-h-full w-full bg-[#faf9f8]">
      {/* Sidebar de configurações */}
      <aside className="w-64 shrink-0 border-r border-slate-200/80 bg-[#faf9f8] px-5 py-8">
        <div className="mb-9 px-2">
          <h1 className="text-2xl font-semibold tracking-[-0.025em] text-slate-900">
            Configurações
          </h1>

          <p className="mt-2 text-sm leading-6 text-slate-500">
            Gerencie sua conta e as preferências da clínica.
          </p>
        </div>

        <nav className="space-y-7">
          {sections.map((section) => (
            <div key={section.title}>
              <p className="mb-2 px-2 text-[11px] font-semibold uppercase tracking-[0.16em] text-slate-400">
                {section.title}
              </p>

              <div className="space-y-1">
                {section.items.map((item) => {
                  const Icon = item.icon;
                  const isActive = activeSection === item.id;

                  return (
                    <button
                      key={item.id}
                      type="button"
                      onClick={() => setActiveSection(item.id)}
                      className={`flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-left text-sm transition-all ${
                        isActive
                          ? "bg-rose-50 font-medium text-rose-700"
                          : "text-slate-600 hover:bg-white hover:text-slate-900"
                      }`}
                    >
                      <Icon
                        className={`h-4 w-4 shrink-0 ${
                          isActive
                            ? "text-rose-600"
                            : "text-slate-400"
                        }`}
                      />

                      <span className="flex-1">{item.label}</span>

                      {isActive && (
                        <ChevronRight className="h-4 w-4 text-rose-500" />
                      )}
                    </button>
                  );
                })}
              </div>
            </div>
          ))}
        </nav>
      </aside>

      {/* Conteúdo */}
      <main className="min-w-0 flex-1 overflow-y-auto px-8 py-10 lg:px-12 xl:px-16">
        {activeSection === "profile" && (
          <section className="max-w-3xl">
            <div className="border-b border-slate-200 pb-6">
              <h2 className="text-xl font-semibold tracking-[-0.02em] text-slate-900">
                Perfil
              </h2>

              <p className="mt-1.5 text-sm leading-6 text-slate-500">
                Gerencie as informações da sua conta.
              </p>
            </div>

            <div className="mt-8 space-y-9">
              {/* Foto */}
              <div className="flex items-center gap-5">
                <div className="flex h-16 w-16 items-center justify-center rounded-full bg-rose-100 text-rose-600">
                  <UserRound className="h-7 w-7" />
                </div>

                <div>
                  <p className="text-sm font-medium text-slate-900">
                    Foto do perfil
                  </p>

                  <p className="mt-1 text-xs leading-5 text-slate-500">
                    Adicione uma foto para personalizar sua conta.
                  </p>

                  <button
                    type="button"
                    className="mt-3 text-sm font-semibold text-rose-600 transition-colors hover:text-rose-700"
                  >
                    Alterar foto
                  </button>
                </div>
              </div>

              {/* Nome */}
              <div className="max-w-xl space-y-2">
                <label
                  htmlFor="name"
                  className="text-sm font-medium text-slate-700"
                >
                  Nome
                </label>

                <input
                  id="name"
                  type="text"
                  placeholder="Seu nome"
                  className="h-11 w-full rounded-xl border border-slate-200 bg-white px-3.5 text-sm text-slate-900 shadow-[0_1px_2px_rgba(0,0,0,0.02)] outline-none transition-all placeholder:text-slate-400 focus:border-rose-400 focus:ring-2 focus:ring-rose-50"
                />
              </div>

              {/* E-mail */}
              <div className="max-w-xl space-y-2">
                <label
                  htmlFor="email"
                  className="text-sm font-medium text-slate-700"
                >
                  E-mail
                </label>

                <input
                  id="email"
                  type="email"
                  placeholder="seu@email.com"
                  className="h-11 w-full rounded-xl border border-slate-200 bg-white px-3.5 text-sm text-slate-900 shadow-[0_1px_2px_rgba(0,0,0,0.02)] outline-none transition-all placeholder:text-slate-400 focus:border-rose-400 focus:ring-2 focus:ring-rose-50"
                />

                <p className="text-xs leading-5 text-slate-400">
                  Este é o e-mail utilizado para acessar sua conta.
                </p>
              </div>

              {/* Salvar */}
              <div className="border-t border-slate-200 pt-6">
                <button
                  type="button"
                  className="rounded-xl bg-rose-600 px-5 py-2.5 text-sm font-medium text-white shadow-[0_4px_12px_rgba(225,29,72,0.12)] transition-all hover:bg-rose-700 hover:shadow-[0_5px_14px_rgba(225,29,72,0.16)] active:scale-[0.99]"
                >
                  Salvar alterações
                </button>
              </div>
            </div>
          </section>
        )}

        {activeSection === "security" && (
          <section className="max-w-3xl">
            <div className="border-b border-slate-200 pb-6">
              <h2 className="text-xl font-semibold tracking-[-0.02em] text-slate-900">
                Segurança
              </h2>

              <p className="mt-1.5 text-sm leading-6 text-slate-500">
                Gerencie a segurança da sua conta.
              </p>
            </div>

            <div className="mt-8 max-w-xl">
              <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-[0_1px_2px_rgba(0,0,0,0.02)]">
                <h3 className="text-sm font-semibold text-slate-900">
                  Senha
                </h3>

                <p className="mt-1.5 text-sm leading-6 text-slate-500">
                  Altere sua senha de acesso à plataforma.
                </p>

                <button
                  type="button"
                  className="mt-4 text-sm font-semibold text-rose-600 transition-colors hover:text-rose-700"
                >
                  Alterar senha
                </button>
              </div>
            </div>
          </section>
        )}

        {activeSection === "preferences" && (
          <section className="max-w-3xl">
            <div className="border-b border-slate-200 pb-6">
              <h2 className="text-xl font-semibold tracking-[-0.02em] text-slate-900">
                Preferências
              </h2>

              <p className="mt-1.5 text-sm leading-6 text-slate-500">
                Personalize sua experiência no sistema.
              </p>
            </div>

            <div className="mt-8 max-w-xl">
              <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-[0_1px_2px_rgba(0,0,0,0.02)]">
                <p className="text-sm font-medium text-slate-900">
                  Preferências
                </p>

                <p className="mt-1.5 text-sm leading-6 text-slate-500">
                  Novas opções de personalização estarão disponíveis aqui.
                </p>
              </div>
            </div>
          </section>
        )}

        {activeSection === "clinic" && (
          <section className="max-w-3xl">
            <div className="border-b border-slate-200 pb-6">
              <h2 className="text-xl font-semibold tracking-[-0.02em] text-slate-900">
                Informações da clínica
              </h2>

              <p className="mt-1.5 text-sm leading-6 text-slate-500">
                Gerencie os dados da sua clínica.
              </p>
            </div>

            <div className="mt-8 max-w-xl">
              <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-[0_1px_2px_rgba(0,0,0,0.02)]">
                <p className="text-sm font-medium text-slate-900">
                  Dados da clínica
                </p>

                <p className="mt-1.5 text-sm leading-6 text-slate-500">
                  Nome, documento e outras informações da clínica.
                </p>
              </div>
            </div>
          </section>
        )}

        {activeSection === "notifications" && (
          <section className="max-w-3xl">
            <div className="border-b border-slate-200 pb-6">
              <h2 className="text-xl font-semibold tracking-[-0.02em] text-slate-900">
                Notificações
              </h2>

              <p className="mt-1.5 text-sm leading-6 text-slate-500">
                Escolha quais notificações você deseja receber.
              </p>
            </div>

            <div className="mt-8 max-w-xl">
              <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-[0_1px_2px_rgba(0,0,0,0.02)]">
                <p className="text-sm font-medium text-slate-900">
                  Notificações
                </p>

                <p className="mt-1.5 text-sm leading-6 text-slate-500">
                  As preferências de notificação poderão ser configuradas
                  aqui.
                </p>
              </div>
            </div>
          </section>
        )}
      </main>
    </div>
  );
}