'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Eye, EyeOff, Loader2 } from 'lucide-react';
import { toast } from 'sonner';

import { fetcher } from '@/lib/api';

import {
  registerSchema,
  type RegisterInput,
} from '@/schemas/auth.schema';

export default function RegisterPage() {
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<RegisterInput>({
    resolver: zodResolver(registerSchema),
  });

  const router = useRouter();

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const onSubmit = async (data: RegisterInput) => {
    const { confirmPassword, ...payload } = data;

    try {
      await fetcher('/auth/register', {
        method: 'POST',
        body: JSON.stringify(payload),
      });

      router.push('/login');
    } catch {
      toast.error('Não foi possível criar sua conta', {
        description:
          'Verifique os dados informados e tente novamente.',
      });
    }
  };

  return (
    <main className="flex min-h-screen w-full overflow-hidden bg-[#faf9f8]">
      {/* Painel esquerdo */}
      <section className="relative hidden min-h-screen w-1/2 overflow-hidden bg-[#f2e7e7] lg:flex">
        <div className="absolute -left-40 top-36 h-[560px] w-[560px] rounded-full border border-white/70" />

        <div className="absolute -left-28 top-56 h-[400px] w-[400px] rounded-full border border-white/60" />

        <div className="absolute -bottom-52 right-[-80px] h-[480px] w-[480px] rounded-full bg-[#e7cccc]/70" />

        <div className="absolute right-[-100px] top-[-120px] h-[300px] w-[300px] rounded-full border border-white/60" />

        <div className="relative z-10 flex w-full flex-col justify-between px-14 py-14 xl:px-[8%]">
          <div>
            <div className="flex items-center gap-3 text-xs font-medium tracking-[0.18em] text-slate-500">
              <span className="h-2 w-2 rounded-full bg-rose-600" />
              GESTÃO PARA CLÍNICAS
            </div>
          </div>

          <div className="max-w-[590px] -translate-y-8">
            <p className="mb-6 text-sm font-medium text-slate-500">
              Simples. Organizado. Profissional.
            </p>

            <h2 className="text-5xl font-semibold leading-[1.05] tracking-[-0.035em] text-slate-900 xl:text-[58px]">
              Mais tempo para
              <br />
              <span className="text-rose-600">
                cuidar do que importa.
              </span>
            </h2>

            <p className="mt-8 max-w-[500px] text-[15px] leading-7 text-slate-600">
              Uma forma mais simples de organizar a rotina da sua clínica,
              acompanhar seus pacientes e manter tudo no lugar.
            </p>

            <div className="mt-10 flex items-center gap-5">
              <span className="h-px w-12 bg-rose-500" />

              <span className="text-[11px] font-medium tracking-[0.22em] text-slate-500">
                FEITO PARA A ROTINA REAL
              </span>
            </div>
          </div>

          <div />
        </div>
      </section>

      {/* Área do cadastro */}
      <section className="relative flex min-h-screen w-full min-w-0 flex-1 items-center justify-center overflow-hidden bg-[#faf9f8] px-6 py-12 lg:w-1/2 lg:flex-none">
        {/* Decoração */}
        <div className="pointer-events-none absolute -right-40 -top-40 h-[420px] w-[420px] rounded-full bg-rose-100/30 blur-3xl" />

        {/* Conteúdo */}
        <div className="relative z-10 w-full max-w-[365px]">
          <div className="mb-8">
            <p className="mb-3 text-sm font-medium text-rose-600">
              Vamos começar
            </p>

            <h1 className="text-[32px] font-semibold tracking-[-0.025em] text-slate-900">
              Crie sua conta
            </h1>

            <p className="mt-3 text-sm leading-6 text-slate-500">
              Configure seu acesso e comece a organizar sua clínica.
            </p>
          </div>

          <form
            onSubmit={handleSubmit(onSubmit)}
            className="space-y-4"
          >
            {/* Nome */}
            <div className="space-y-2">
              <label
                htmlFor="name"
                className="text-sm font-medium text-slate-700"
              >
                Nome
              </label>

              <input
                id="name"
                type="text"
                autoComplete="name"
                placeholder="Seu nome"
                {...register('name')}
                className={`h-11 w-full rounded-xl border bg-white px-3.5 text-sm text-slate-900 shadow-[0_1px_2px_rgba(0,0,0,0.02)] outline-none transition-all placeholder:text-slate-400 ${
                  errors.name
                    ? 'border-red-300 focus:border-red-400 focus:ring-2 focus:ring-red-100'
                    : 'border-slate-200 focus:border-rose-400 focus:ring-2 focus:ring-rose-50'
                }`}
              />

              {errors.name && (
                <p className="text-xs text-red-600">
                  {errors.name.message}
                </p>
              )}
            </div>

            {/* Nome da clínica */}
            <div className="space-y-2">
              <label
                htmlFor="clinicName"
                className="text-sm font-medium text-slate-700"
              >
                Nome da clínica
              </label>

              <input
                id="clinicName"
                type="text"
                autoComplete="organization"
                placeholder="Ex: Clínica Bella"
                {...register('clinicName')}
                className={`h-11 w-full rounded-xl border bg-white px-3.5 text-sm text-slate-900 shadow-[0_1px_2px_rgba(0,0,0,0.02)] outline-none transition-all placeholder:text-slate-400 ${
                  errors.clinicName
                    ? 'border-red-300 focus:border-red-400 focus:ring-2 focus:ring-red-100'
                    : 'border-slate-200 focus:border-rose-400 focus:ring-2 focus:ring-rose-50'
                }`}
              />

              {errors.clinicName && (
                <p className="text-xs text-red-600">
                  {errors.clinicName.message}
                </p>
              )}
            </div>

            {/* E-mail */}
            <div className="space-y-2">
              <label
                htmlFor="email"
                className="text-sm font-medium text-slate-700"
              >
                E-mail
              </label>

              <input
                id="email"
                type="email"
                autoComplete="email"
                placeholder="seu@email.com"
                {...register('email')}
                className={`h-11 w-full rounded-xl border bg-white px-3.5 text-sm text-slate-900 shadow-[0_1px_2px_rgba(0,0,0,0.02)] outline-none transition-all placeholder:text-slate-400 ${
                  errors.email
                    ? 'border-red-300 focus:border-red-400 focus:ring-2 focus:ring-red-100'
                    : 'border-slate-200 focus:border-rose-400 focus:ring-2 focus:ring-rose-50'
                }`}
              />

              {errors.email && (
                <p className="text-xs text-red-600">
                  {errors.email.message}
                </p>
              )}
            </div>

            {/* Senha */}
            <div className="space-y-2">
              <label
                htmlFor="password"
                className="text-sm font-medium text-slate-700"
              >
                Senha
              </label>

              <div className="relative">
                <input
                  id="password"
                  type={showPassword ? 'text' : 'password'}
                  autoComplete="new-password"
                  placeholder="Mínimo de 8 caracteres"
                  {...register('password')}
                  className={`h-11 w-full rounded-xl border bg-white px-3.5 pr-11 text-sm text-slate-900 shadow-[0_1px_2px_rgba(0,0,0,0.02)] outline-none transition-all placeholder:text-slate-400 ${
                    errors.password
                      ? 'border-red-300 focus:border-red-400 focus:ring-2 focus:ring-red-100'
                      : 'border-slate-200 focus:border-rose-400 focus:ring-2 focus:ring-rose-50'
                  }`}
                />

                <button
                  type="button"
                  onClick={() =>
                    setShowPassword((prev) => !prev)
                  }
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 transition-colors hover:text-slate-600"
                  aria-label={
                    showPassword
                      ? 'Ocultar senha'
                      : 'Mostrar senha'
                  }
                >
                  {showPassword ? (
                    <EyeOff className="h-4 w-4" />
                  ) : (
                    <Eye className="h-4 w-4" />
                  )}
                </button>
              </div>

              {errors.password && (
                <p className="text-xs text-red-600">
                  {errors.password.message}
                </p>
              )}
            </div>

            {/* Confirmar senha */}
            <div className="space-y-2">
              <label
                htmlFor="confirmPassword"
                className="text-sm font-medium text-slate-700"
              >
                Confirmar senha
              </label>

              <div className="relative">
                <input
                  id="confirmPassword"
                  type={
                    showConfirmPassword ? 'text' : 'password'
                  }
                  autoComplete="new-password"
                  placeholder="Digite sua senha novamente"
                  {...register('confirmPassword')}
                  className={`h-11 w-full rounded-xl border bg-white px-3.5 pr-11 text-sm text-slate-900 shadow-[0_1px_2px_rgba(0,0,0,0.02)] outline-none transition-all placeholder:text-slate-400 ${
                    errors.confirmPassword
                      ? 'border-red-300 focus:border-red-400 focus:ring-2 focus:ring-red-100'
                      : 'border-slate-200 focus:border-rose-400 focus:ring-2 focus:ring-rose-50'
                  }`}
                />

                <button
                  type="button"
                  onClick={() =>
                    setShowConfirmPassword((prev) => !prev)
                  }
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 transition-colors hover:text-slate-600"
                  aria-label={
                    showConfirmPassword
                      ? 'Ocultar confirmação da senha'
                      : 'Mostrar confirmação da senha'
                  }
                >
                  {showConfirmPassword ? (
                    <EyeOff className="h-4 w-4" />
                  ) : (
                    <Eye className="h-4 w-4" />
                  )}
                </button>
              </div>

              {errors.confirmPassword && (
                <p className="text-xs text-red-600">
                  {errors.confirmPassword.message}
                </p>
              )}
            </div>

            {/* Botão */}
            <button
              type="submit"
              disabled={isSubmitting}
              className="mt-2 flex h-11 w-full items-center justify-center rounded-xl bg-rose-600 text-sm font-medium text-white shadow-[0_4px_12px_rgba(225,29,72,0.14)] transition-all hover:bg-rose-700 hover:shadow-[0_5px_14px_rgba(225,29,72,0.18)] active:scale-[0.99] disabled:cursor-not-allowed disabled:opacity-60 disabled:shadow-none"
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Criando conta...
                </>
              ) : (
                'Criar conta'
              )}
            </button>
          </form>

          {/* Login */}
          <div className="mt-8 text-center">
            <p className="text-sm text-slate-500">
              Já possui uma conta?{' '}
              <Link
                href="/login"
                className="font-semibold text-rose-600 transition-colors hover:text-rose-700"
              >
                Fazer login
              </Link>
            </p>
          </div>
        </div>
      </section>
    </main>
  );
}