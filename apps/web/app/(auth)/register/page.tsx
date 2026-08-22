'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { IconSparkles } from '@tabler/icons-react';
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
  const [authError, setAuthError] = useState<string | null>(null);

  const onSubmit = async (data: RegisterInput) => {
    // confirmPassword é só para validação local, não deve ir para o backend
    const { confirmPassword, ...payload } = data;
    setAuthError(null);

    try {
      await fetcher('/auth/register', {
        method: 'POST',
        body: JSON.stringify(payload),
      });

      router.push('/login');
    } catch (err: any) {
      setAuthError(err.message || 'Erro ao criar conta. Tente novamente.');
    }
  };

  return (
    <div className="min-h-screen bg-[#F5F5F7] flex items-center justify-center px-4 py-8 relative overflow-hidden">
      {/* Decoração de fundo */}
      <div className="absolute -top-32 -right-32 h-80 w-80 rounded-full bg-rose-100/60 blur-3xl" />
      <div className="absolute -bottom-32 -left-32 h-80 w-80 rounded-full bg-rose-50 blur-3xl" />

      <div className="relative w-full max-w-[420px]">
        <div className="bg-white border border-neutral-200/80 rounded-2xl shadow-sm px-7 py-8 sm:px-9 sm:py-9">

          {/* Logo / identidade */}
          <div className="flex flex-col items-center text-center mb-8">
            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-rose-600 shadow-sm shadow-rose-200">
              <IconSparkles className="h-6 w-6 text-white" />
            </div>

            <h1 className="mt-5 text-2xl font-semibold tracking-tight text-slate-900">
              Crie sua conta
            </h1>

            <p className="mt-2 text-sm text-slate-500">
              Configure seu acesso ao sistema
            </p>
          </div>

          {/* Formulário */}
          <form
            onSubmit={handleSubmit(onSubmit)}
            className="flex flex-col gap-4"
          >
            {/* Nome */}
            <div className="flex flex-col gap-2">
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
                {...register('name')}
                placeholder="Seu nome"
                className={`w-full h-11 px-3.5 rounded-xl bg-white text-sm text-slate-900 placeholder:text-slate-400 outline-none transition-all border ${
                  errors.name
                    ? 'border-red-300 focus:ring-2 focus:ring-red-100'
                    : 'border-slate-200 focus:border-rose-500 focus:ring-2 focus:ring-rose-100'
                }`}
              />

              {errors.name && (
                <p className="text-xs text-red-600">
                  {errors.name.message}
                </p>
              )}
            </div>

            {/* Nome da Clínica */}
            <div className="flex flex-col gap-2">
              <label
                htmlFor="clinicName"
                className="text-sm font-medium text-slate-700"
              >
                Nome da Clínica
              </label>

              <input
                id="clinicName"
                type="text"
                autoComplete="organization"
                {...register('clinicName')}
                placeholder="Ex: Clínica Bella"
                className={`w-full h-11 px-3.5 rounded-xl bg-white text-sm text-slate-900 placeholder:text-slate-400 outline-none transition-all border ${
                  errors.clinicName
                    ? 'border-red-300 focus:ring-2 focus:ring-red-100'
                    : 'border-slate-200 focus:border-rose-500 focus:ring-2 focus:ring-rose-100'
                }`}
              />

              {errors.clinicName && (
                <p className="text-xs text-red-600">
                  {errors.clinicName.message}
                </p>
              )}
            </div>

            {/* Email */}
            <div className="flex flex-col gap-2">
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
                {...register('email')}
                placeholder="seu@email.com"
                className={`w-full h-11 px-3.5 rounded-xl bg-white text-sm text-slate-900 placeholder:text-slate-400 outline-none transition-all border ${
                  errors.email
                    ? 'border-red-300 focus:ring-2 focus:ring-red-100'
                    : 'border-slate-200 focus:border-rose-500 focus:ring-2 focus:ring-rose-100'
                }`}
              />

              {errors.email && (
                <p className="text-xs text-red-600">
                  {errors.email.message}
                </p>
              )}
            </div>

            {/* Senha */}
            <div className="flex flex-col gap-2">
              <label
                htmlFor="password"
                className="text-sm font-medium text-slate-700"
              >
                Senha
              </label>

              <input
                id="password"
                type="password"
                autoComplete="new-password"
                {...register('password')}
                placeholder="Mínimo de 8 caracteres"
                className={`w-full h-11 px-3.5 rounded-xl bg-white text-sm text-slate-900 placeholder:text-slate-400 outline-none transition-all border ${
                  errors.password
                    ? 'border-red-300 focus:ring-2 focus:ring-red-100'
                    : 'border-slate-200 focus:border-rose-500 focus:ring-2 focus:ring-rose-100'
                }`}
              />

              {errors.password && (
                <p className="text-xs text-red-600">
                  {errors.password.message}
                </p>
              )}
            </div>

            {/* Confirmar senha */}
            <div className="flex flex-col gap-2">
              <label
                htmlFor="confirmPassword"
                className="text-sm font-medium text-slate-700"
              >
                Confirmar senha
              </label>

              <input
                id="confirmPassword"
                type="password"
                autoComplete="new-password"
                {...register('confirmPassword')}
                placeholder="Digite sua senha novamente"
                className={`w-full h-11 px-3.5 rounded-xl bg-white text-sm text-slate-900 placeholder:text-slate-400 outline-none transition-all border ${
                  errors.confirmPassword
                    ? 'border-red-300 focus:ring-2 focus:ring-red-100'
                    : 'border-slate-200 focus:border-rose-500 focus:ring-2 focus:ring-rose-100'
                }`}
              />

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
              className="w-full h-11 mt-2 rounded-xl bg-rose-600 hover:bg-rose-700 disabled:opacity-60 disabled:cursor-not-allowed active:scale-[0.99] text-white text-sm font-medium shadow-sm shadow-rose-200 transition-all"
            >
              {isSubmitting ? 'Criando conta...' : 'Criar conta'}
            </button>

            {/* Erro de criação */}
            {authError && (
              <p className="text-center text-xs text-red-600 bg-red-50 border border-red-100 rounded-lg py-2 px-3">
                {authError}
              </p>
            )}
          </form>


          {/* Login */}
          <div className="mt-7 pt-6 border-t border-slate-100 text-center">
            <p className="text-sm text-slate-500">
              Já possui uma conta?{' '}
              <Link
                href="/login"
                className="font-semibold text-rose-600 hover:text-rose-700 hover:underline underline-offset-2 transition-colors"
              >
                Fazer login
              </Link>
            </p>
          </div>
        </div>

        <p className="mt-5 text-center text-xs text-slate-400">
          Sistema de gestão para clínica estética
        </p>
      </div>
    </div>
  );
}