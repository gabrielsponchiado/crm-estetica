'use client';

import { useState } from 'react';
import Link from 'next/link';

export default function RegisterPage() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (password !== confirmPassword) {
      setError('As senhas não coincidem!');
      return;
    }

    console.log('Registrar:', { name, email, password });
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#F8FAFC] p-4">
      <div className="w-full max-w-[360px] flex flex-col gap-6 text-center">
        <h1 className="text-2xl font-bold text-slate-900 tracking-tight">Registrar-se</h1>

        {error && (
          <div className="p-3 text-sm text-red-600 bg-red-50 rounded-xl border border-red-200">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="flex flex-col gap-3 text-left">
          <input
            type="text"
            required
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Nome"
            className="w-full h-12 px-4 bg-[#E2E8F0]/60 text-slate-900 placeholder-slate-400 rounded-xl outline-none focus:ring-2 focus:ring-blue-600 border border-transparent transition-all leading-normal"
          />

          <input
            type="email"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Email"
            className="w-full h-12 px-4 bg-[#E2E8F0]/60 text-slate-900 placeholder-slate-400 rounded-xl outline-none focus:ring-2 focus:ring-blue-600 border border-transparent transition-all leading-normal"
          />

          <input
            type="password"
            required
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Senha"
            className="w-full h-12 px-4 bg-[#E2E8F0]/60 text-slate-900 placeholder-slate-400 rounded-xl outline-none focus:ring-2 focus:ring-blue-600 border border-transparent transition-all leading-normal"
          />

          <input
            type="password"
            required
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            placeholder="Confirmar senha"
            className="w-full h-12 px-4 bg-[#E2E8F0]/60 text-slate-900 placeholder-slate-400 rounded-xl outline-none focus:ring-2 focus:ring-blue-600 border border-transparent transition-all leading-normal"
          />

          <button
            type="submit"
            className="w-full h-12 mt-2 bg-[#2563EB] hover:bg-blue-700 active:scale-[0.98] text-white font-medium rounded-xl transition-all shadow-sm flex items-center justify-center text-center"
          >
            Continuar
          </button>
        </form>

        <p className="text-sm text-slate-500">
          Já possui conta?{' '}
          <Link href="/login" className="text-blue-600 font-semibold hover:underline">
            Fazer login
          </Link>
        </p>
      </div>
    </div>
  );
}