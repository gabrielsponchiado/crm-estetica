'use client';

import React, { useState } from 'react';
import { usePathname } from 'next/navigation';
import Link from 'next/link';
import {
  IconLayoutDashboard,
  IconUsers,
  IconCalendar,
  IconSparkles,
  IconSettings,
  IconChevronLeft,
  IconChevronRight,
  IconLogout,
} from '@tabler/icons-react';
import { cn } from '@/lib/utils';
import { useAuth } from '@/store/useAuth';

const navItems = [
  { label: 'Dashboard',     href: '/dashboard',     Icon: IconLayoutDashboard },
  { label: 'Clientes',      href: '/clientes',      Icon: IconUsers           },
  { label: 'Agenda',        href: '/agenda',        Icon: IconCalendar        },
  { label: 'Procedimentos', href: '/procedimentos', Icon: IconSparkles        },
];

const bottomItems = [
  { label: 'Configurações', href: '/configuracoes', Icon: IconSettings },
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
        'group relative flex h-11 items-center rounded-xl transition-colors duration-150 select-none overflow-hidden',
        open ? 'px-3 justify-start gap-3' : 'px-0 justify-center',
        isActive
          ? 'bg-rose-600 text-white shadow-md shadow-rose-200/50'
          : 'text-slate-500 hover:bg-rose-50 hover:text-rose-700'
      )}
    >
      <Icon
        className={cn(
          'h-5 w-5 shrink-0 transition-colors duration-150',
          isActive ? 'text-white' : 'text-slate-400 group-hover:text-rose-600'
        )}
      />
      {open && (
        <span className="text-[0.9rem] font-medium tracking-[-0.01em] whitespace-nowrap leading-none">
          {label}
        </span>
      )}
    </Link>
  );
}

export default function AppLayout({ children }: { children: React.ReactNode }) {
  const [open, setOpen] = useState(true);
  const pathname = usePathname();
  const { user, logout } = useAuth();

  const initials = user?.name
    ? user.name.split(' ').map((n: string) => n[0]).slice(0, 2).join('').toUpperCase()
    : '?';

  return (
    <div className="flex h-screen overflow-hidden bg-[#F5F5F7]">
      {/* ── Sidebar ─────────────────────────────────────────── */}
      <aside
        style={{ width: open ? 256 : 68, transition: 'width 0.2s cubic-bezier(0.4,0,0.2,1)' }}
        className="relative flex h-full shrink-0 flex-col border-r border-neutral-200 bg-white py-5"
      >
        {/* Toggle button */}
        <button
          onClick={() => setOpen((v) => !v)}
          aria-label={open ? 'Fechar menu' : 'Abrir menu'}
          className="absolute -right-3.5 top-7 z-50 flex h-7 w-7 items-center
                     justify-center rounded-full border border-neutral-200
                     bg-white shadow-md transition-all duration-150
                     hover:bg-neutral-50 hover:shadow-lg active:scale-95"
        >
          {open ? (
            <IconChevronLeft className="h-3.5 w-3.5 text-neutral-400" />
          ) : (
            <IconChevronRight className="h-3.5 w-3.5 text-neutral-400" />
          )}
        </button>

        {/* Navegação principal */}
        <nav className="flex flex-1 flex-col gap-1.5 px-3 mt-24">
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

        {/* Bottom: Configurações + Perfil */}
        <div className="flex flex-col gap-1 border-t border-neutral-100 pt-4 px-3">
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

          {/* Perfil / Avatar */}
          <div className={cn(
            'mt-2 flex items-center rounded-xl py-2 transition-all',
            open ? 'px-1 gap-3 justify-start' : 'px-0 justify-center'
          )}>
            <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-rose-600 shadow-sm shadow-rose-200 text-sm font-semibold text-white">
              {initials}
            </div>
            {open && (
              <div className="flex flex-1 flex-col overflow-hidden min-w-0">
                <span className="text-xs font-semibold text-neutral-800 truncate">
                  {user?.name ?? 'Usuário'}
                </span>
                <span className="text-[10px] text-neutral-400 truncate">
                  {user?.email ?? ''}
                </span>
              </div>
            )}
            {open && (
              <button
                onClick={logout}
                title="Sair"
                className="ml-auto shrink-0 flex h-7 w-7 items-center justify-center rounded-lg text-neutral-400 hover:bg-rose-50 hover:text-rose-600 transition-colors"
              >
                <IconLogout className="h-4 w-4" />
              </button>
            )}
          </div>
        </div>
      </aside>

      {/* ── Conteúdo ────────────────────────────────────────── */}
      <main className="flex-1 overflow-y-auto p-8">{children}</main>
    </div>
  );
}
