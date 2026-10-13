"use client";

import { Suspense, useState } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Loader2, Eye, EyeOff, ArrowLeft } from "lucide-react";
import { toast } from "sonner";
import { z } from "zod";

import { fetcher } from "@/lib/api";

const resetPasswordSchema = z
  .object({
    password: z.string().min(8, "A senha deve ter pelo menos 8 caracteres"),
    confirmPassword: z.string().min(1, "Confirme sua nova senha"),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "As senhas não coincidem",
    path: ["confirmPassword"],
  });

type ResetPasswordInput = z.infer<typeof resetPasswordSchema>;

interface ResetPasswordResponse {
  message: string;
}

function ResetPasswordContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const token = searchParams.get("token");

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<ResetPasswordInput>({
    resolver: zodResolver(resetPasswordSchema),
  });

  const onSubmit = async (data: ResetPasswordInput) => {
    if (!token) {
      toast.error("Link inválido", {
        description:
          "O link de recuperação está incompleto ou não possui um token válido.",
      });

      return;
    }

    try {
      const response = await fetcher<ResetPasswordResponse>(
        "/auth/reset-password",
        {
          method: "POST",
          body: JSON.stringify({
            token,
            password: data.password,
          }),
        },
      );

      toast.success("Senha redefinida", {
        description: response.message,
      });

      router.push("/login");
    } catch (err: unknown) {
      const message =
        err instanceof Error
          ? err.message
          : "Não foi possível redefinir sua senha.";

      toast.error("Não foi possível redefinir a senha", {
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
              Segurança e tranquilidade.
            </p>

            <h2 className="text-5xl font-semibold leading-[1.05] tracking-[-0.035em] text-slate-900 xl:text-[58px]">
              Recupere seu
              <br />
              <span className="text-rose-600">acesso com segurança.</span>
            </h2>

            <p className="mt-8 max-w-[500px] text-[15px] leading-7 text-slate-600">
              Crie uma nova senha para voltar a acessar sua clínica de forma
              segura e continuar sua rotina normalmente.
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
            <p className="mb-3 text-sm font-medium text-rose-600">Nova senha</p>

            <h1 className="text-[32px] font-semibold tracking-[-0.025em] text-slate-900">
              Redefina sua senha
            </h1>

            <p className="mt-3 text-sm leading-6 text-slate-500">
              Escolha uma nova senha para recuperar o acesso à sua conta.
            </p>
          </div>

          {!token ? (
            <div className="rounded-xl border border-red-200 bg-red-50 px-4 py-4">
              <p className="text-sm font-medium text-red-700">
                Link de recuperação inválido.
              </p>

              <p className="mt-1 text-xs leading-5 text-red-600">
                Solicite uma nova recuperação de senha para receber outro link.
              </p>
            </div>
          ) : (
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
              {/* Nova senha */}
              <div className="space-y-2">
                <label
                  htmlFor="password"
                  className="text-sm font-medium text-slate-700"
                >
                  Nova senha
                </label>

                <div className="relative">
                  <input
                    id="password"
                    type={showPassword ? "text" : "password"}
                    autoComplete="new-password"
                    placeholder="Digite sua nova senha"
                    {...register("password")}
                    className={`h-11 w-full rounded-xl border bg-white px-3.5 pr-11 text-sm text-slate-900 shadow-[0_1px_2px_rgba(0,0,0,0.02)] outline-none transition-all placeholder:text-slate-400 ${
                      errors.password
                        ? "border-red-300 focus:border-red-400 focus:ring-2 focus:ring-red-100"
                        : "border-slate-200 focus:border-rose-400 focus:ring-2 focus:ring-rose-50"
                    }`}
                  />

                  <button
                    type="button"
                    onClick={() => setShowPassword((prev) => !prev)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 transition-colors hover:text-slate-600"
                    aria-label={
                      showPassword ? "Ocultar senha" : "Mostrar senha"
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
                  Confirmar nova senha
                </label>

                <div className="relative">
                  <input
                    id="confirmPassword"
                    type={showConfirmPassword ? "text" : "password"}
                    autoComplete="new-password"
                    placeholder="Digite novamente sua senha"
                    {...register("confirmPassword")}
                    className={`h-11 w-full rounded-xl border bg-white px-3.5 pr-11 text-sm text-slate-900 shadow-[0_1px_2px_rgba(0,0,0,0.02)] outline-none transition-all placeholder:text-slate-400 ${
                      errors.confirmPassword
                        ? "border-red-300 focus:border-red-400 focus:ring-2 focus:ring-red-100"
                        : "border-slate-200 focus:border-rose-400 focus:ring-2 focus:ring-rose-50"
                    }`}
                  />

                  <button
                    type="button"
                    onClick={() => setShowConfirmPassword((prev) => !prev)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 transition-colors hover:text-slate-600"
                    aria-label={
                      showConfirmPassword ? "Ocultar senha" : "Mostrar senha"
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
                className="mt-2 flex h-11 w-full cursor-pointer items-center justify-center rounded-xl bg-rose-600 text-sm font-medium text-white shadow-[0_4px_12px_rgba(225,29,72,0.14)] transition-all hover:bg-rose-700 hover:shadow-[0_5px_14px_rgba(225,29,72,0.18)] active:scale-[0.99] disabled:cursor-not-allowed disabled:opacity-60 disabled:shadow-none"
              >
                {isSubmitting ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Redefinindo...
                  </>
                ) : (
                  "Redefinir senha"
                )}
              </button>
            </form>
          )}

          {/* Voltar */}
          <div className="mt-8 text-center">
            <Link
              href="/login"
              className="inline-flex items-center gap-2 text-sm font-medium text-slate-500 transition-colors hover:text-rose-600"
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

function ResetPasswordFallback() {
  return (
    <div className="min-h-screen bg-[#faf9f8] flex items-center justify-center px-6">
      <div className="flex items-center gap-2 text-sm text-slate-500">
        <Loader2 className="h-4 w-4 animate-spin" />
        Carregando...
      </div>
    </div>
  );
}

export default function ResetPasswordPage() {
  return (
    <Suspense fallback={<ResetPasswordFallback />}>
      <ResetPasswordContent />
    </Suspense>
  );
}
