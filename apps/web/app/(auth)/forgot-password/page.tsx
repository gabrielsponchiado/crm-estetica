"use client";

import Link from "next/link";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Loader2, ArrowLeft } from "lucide-react";
import { toast } from "sonner";
import { z } from "zod";

import { fetcher } from "@/lib/api";

const forgotPasswordSchema = z.object({
  email: z
    .string()
    .min(1, "E-mail é obrigatório")
    .email("Digite um e-mail válido"),
});

type ForgotPasswordInput = z.infer<typeof forgotPasswordSchema>;

interface ForgotPasswordResponse {
  message: string;
}

export default function ForgotPasswordPage() {
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<ForgotPasswordInput>({
    resolver: zodResolver(forgotPasswordSchema),
  });

  const onSubmit = async (data: ForgotPasswordInput) => {
    try {
      const response = await fetcher<ForgotPasswordResponse>(
        "/auth/forgot-password",
        {
          method: "POST",
          body: JSON.stringify(data),
        },
      );

      toast.success("Solicitação enviada", {
        description: response.message,
      });
    } catch (err: unknown) {
      const message =
        err instanceof Error
          ? err.message
          : "Não foi possível processar sua solicitação.";

      toast.error("Não foi possível continuar", {
        description: message,
      });
    }
  };

  return (
    <div className="min-h-screen bg-[#faf9f8] flex overflow-hidden">
      {/* =========================================================
          LADO ESQUERDO
      ========================================================= */}
      <section className="relative hidden lg:flex lg:w-1/2 overflow-hidden bg-[#f2e7e7]">
        {/* Decoração */}
        <div className="absolute -left-40 top-36 h-[560px] w-[560px] rounded-full border border-white/70" />

        <div className="absolute -left-28 top-56 h-[400px] w-[400px] rounded-full border border-white/60" />

        <div className="absolute -bottom-52 right-[-80px] h-[480px] w-[480px] rounded-full bg-[#e7cccc]/70" />

        <div className="absolute right-[-100px] top-[-120px] h-[300px] w-[300px] rounded-full border border-white/60" />

        {/* Conteúdo */}
        <div className="relative z-10 flex w-full flex-col justify-between px-14 py-14 xl:px-[8%]">
          <div>
            <div className="flex items-center gap-3 text-xs font-medium tracking-[0.18em] text-slate-500">
              <span className="h-2 w-2 rounded-full bg-rose-600" />
              GESTÃO PARA CLÍNICAS
            </div>
          </div>

          <div className="max-w-[590px] -translate-y-8">
            <p className="mb-6 text-sm font-medium text-slate-500">
              Recuperação de acesso
            </p>

            <h2 className="text-5xl font-semibold leading-[1.05] tracking-[-0.035em] text-slate-900 xl:text-[58px]">
              Volte a ter
              <br />
              <span className="text-rose-600">acesso à sua conta.</span>
            </h2>

            <p className="mt-8 max-w-[500px] text-[15px] leading-7 text-slate-600">
              Informe seu e-mail e enviaremos as instruções necessárias para
              redefinir sua senha.
            </p>

            <div className="mt-10 flex items-center gap-5">
              <span className="h-px w-12 bg-rose-500" />

              <span className="text-[11px] font-medium tracking-[0.22em] text-slate-500">
                ACESSO SEGURO
              </span>
            </div>
          </div>

          <div />
        </div>
      </section>

      {/* =========================================================
          LADO DIREITO
      ========================================================= */}
      <section className="relative flex min-h-screen w-full items-center justify-center overflow-hidden bg-[#faf9f8] px-6 py-12 lg:w-1/2">
        {/* Glow */}
        <div className="pointer-events-none absolute right-[-180px] top-[-180px] h-[420px] w-[420px] rounded-full bg-rose-100/30 blur-3xl" />

        <div className="relative z-10 w-full max-w-[365px]">
          {/* Cabeçalho */}
          <div className="mb-9">
            <p className="mb-3 text-sm font-medium text-rose-600">
              Recuperar acesso
            </p>

            <h1 className="text-[32px] font-semibold tracking-[-0.025em] text-slate-900">
              Esqueceu sua senha?
            </h1>

            <p className="mt-3 text-sm leading-6 text-slate-500">
              Informe seu e-mail e enviaremos as instruções para redefinir sua
              senha.
            </p>
          </div>

          {/* Formulário */}
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
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
                {...register("email")}
                className={`h-11 w-full rounded-xl border bg-white px-3.5 text-sm text-slate-900 shadow-[0_1px_2px_rgba(0,0,0,0.02)] outline-none transition-all placeholder:text-slate-400 ${
                  errors.email
                    ? "border-red-300 focus:border-red-400 focus:ring-2 focus:ring-red-100"
                    : "border-slate-200 focus:border-rose-400 focus:ring-2 focus:ring-rose-50"
                }`}
              />

              {errors.email && (
                <p className="text-xs text-red-600">
                  {errors.email.message}
                </p>
              )}
            </div>

            <button
              type="submit"
              disabled={isSubmitting}
              className="mt-2 flex h-11 w-full cursor-pointer items-center justify-center rounded-xl bg-rose-600 text-sm font-medium text-white shadow-[0_4px_12px_rgba(225,29,72,0.14)] transition-all hover:bg-rose-700 hover:shadow-[0_5px_14px_rgba(225,29,72,0.18)] active:scale-[0.99] disabled:cursor-not-allowed disabled:opacity-60 disabled:shadow-none"
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Enviando...
                </>
              ) : (
                "Enviar instruções"
              )}
            </button>
          </form>

          {/* Voltar para login */}
          <div className="mt-8 text-center">
            <Link
              href="/login"
              className="inline-flex items-center gap-2 text-sm font-medium text-slate-500 transition-colors hover:text-slate-700"
            >
              <ArrowLeft className="h-4 w-4" />
              Voltar para o login
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}