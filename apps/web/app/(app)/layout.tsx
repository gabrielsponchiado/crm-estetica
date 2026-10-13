"use client";

import React, { useEffect, useState } from "react";
import { usePathname } from "next/navigation";
import Link from "next/link";
import {
  IconLayoutDashboard,
  IconUsers,
  IconCalendar,
  IconSparkles,
  IconSettings,
  IconChevronLeft,
  IconChevronRight,
  IconLogout,
} from "@tabler/icons-react";
import { cn } from "@/lib/utils";
import { useAuth } from "@/store/useAuth";

const navItems = [
  {
    label: "Dashboard",
    href: "/dashboard",
    Icon: IconLayoutDashboard,
  },
  {
    label: "Clientes",
    href: "/clientes",
    Icon: IconUsers,
  },
  {
    label: "Agenda",
    href: "/agenda",
    Icon: IconCalendar,
  },
  {
    label: "Procedimentos",
    href: "/procedimentos",
    Icon: IconSparkles,
    },
];

const bottomItems = [
  {
    label: "Configurações",
    href: "/configuracoes",
    Icon: IconSettings,
  },
];

function NavLink({
  label,
  href,
  Icon,
  isActive,
  open,
}: {
  label: string;
  href: string;
  Icon: React.ElementType;
  isActive: boolean;
  open: boolean;
}) {
  return (
    <Link
      href={href}
      className={cn(
        "group relative flex h-11 items-center overflow-hidden rounded-xl select-none transition-colors duration-150",
        open ? "justify-start gap-3 px-3" : "justify-center px-0",
        isActive
          ? "bg-rose-600 text-white shadow-md shadow-rose-200/50"
          : "text-slate-500 hover:bg-rose-50 hover:text-rose-700",
      )}
    >
      <Icon
        className={cn(
          "h-5 w-5 shrink-0 transition-colors duration-150",
          isActive
            ? "text-white"
            : "text-slate-400 group-hover:text-rose-600",
        )}
      />

      {open && (
        <span className="whitespace-nowrap text-[0.9rem] font-medium leading-none tracking-[-0.01em]">
          {label}
        </span>
      )}
    </Link>
  );
}

export default function AppLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [open, setOpen] = useState(true);
  const pathname = usePathname();
  const { user, logout } = useAuth();

  const isSettingsPage = pathname === "/configuracoes";

  useEffect(() => {
    const saved = localStorage.getItem("sidebar-open");

    if (saved !== null) {
      setOpen(saved === "true");
    }
  }, []);

  const toggleSidebar = () => {
    setOpen((prev) => {
      const next = !prev;

      localStorage.setItem("sidebar-open", String(next));

      return next;
    });
  };

  const initials = user?.name
    ? user.name
        .split(" ")
        .map((n: string) => n[0])
        .slice(0, 2)
        .join("")
        .toUpperCase()
    : "?";

  return (
    <div className="flex h-screen overflow-hidden bg-[#faf9f8]">
      {/* Sidebar */}
      <aside
        style={{
          width: open ? 256 : 68,
          transition: "width 0.2s cubic-bezier(0.4,0,0.2,1)",
        }}
        className="relative flex h-full shrink-0 flex-col border-r border-slate-200/80 bg-[#faf9f8] py-5"
      >
        {/* Toggle */}
        <button
          type="button"
          onClick={toggleSidebar}
          aria-label={open ? "Fechar menu" : "Abrir menu"}
          className="absolute -right-3.5 top-7 z-50 flex h-7 w-7 items-center justify-center rounded-full border border-slate-200 bg-white shadow-md transition-all duration-150 hover:bg-slate-50 hover:shadow-lg active:scale-95"
        >
          {open ? (
            <IconChevronLeft className="h-3.5 w-3.5 text-slate-400" />
          ) : (
            <IconChevronRight className="h-3.5 w-3.5 text-slate-400" />
          )}
        </button>

        {/* Navegação principal */}
        <nav className="mt-24 flex flex-1 flex-col gap-1.5 px-3">
          {navItems.map(({ label, href, Icon }) => (
            <NavLink
              key={href}
              label={label}
              href={href}
              Icon={Icon}
              isActive={pathname === href}
              open={open}
            />
          ))}
        </nav>

        {/* Configurações + Perfil */}
        <div className="flex flex-col gap-1 border-t border-slate-200/70 px-3 pt-4">
          {bottomItems.map(({ label, href, Icon }) => (
            <NavLink
              key={href}
              label={label}
              href={href}
              Icon={Icon}
              isActive={pathname === href}
              open={open}
            />
          ))}

          {/* Perfil */}
          <div
            className={cn(
              "mt-2 flex items-center rounded-xl py-2 transition-all",
              open
                ? "justify-start gap-3 px-1"
                : "justify-center px-0",
            )}
          >
            <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-rose-600 text-sm font-semibold text-white shadow-sm shadow-rose-200">
              {initials}
            </div>

            {open && (
              <div className="flex min-w-0 flex-1 flex-col overflow-hidden">
                <span className="truncate text-xs font-semibold text-slate-800">
                  {user?.name ?? "Usuário"}
                </span>

                <span className="truncate text-[10px] text-slate-400">
                  {user?.email ?? ""}
                </span>
              </div>
            )}

            {open && (
              <button
                type="button"
                onClick={logout}
                title="Sair"
                className="ml-auto flex h-7 w-7 shrink-0 items-center justify-center rounded-lg text-slate-400 transition-colors hover:bg-rose-50 hover:text-rose-600"
              >
                <IconLogout className="h-4 w-4" />
              </button>
            )}
          </div>
        </div>
      </aside>

      {/* Conteúdo */}
      <main
        className={cn(
          "flex min-h-0 flex-1 flex-col overflow-y-auto",
          isSettingsPage ? "p-0" : "p-8",
        )}
      >
        {children}
      </main>
    </div>
  );
}