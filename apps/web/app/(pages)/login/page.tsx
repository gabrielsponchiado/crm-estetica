'use client';

import { useState } from 'react';
import Link from 'next/link';

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log('Login:', { email, password });
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#F8FAFC] p-4">
      <div className="w-full max-w-[360px] flex flex-col gap-6 text-center">
        <h1 className="text-2xl font-bold text-slate-900 tracking-tight">Login</h1>

        <form onSubmit={handleSubmit} className="flex flex-col gap-3">
          <input
            type="email"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Email"
            className="w-full h-12 px-4 bg-[#E2E8F0]/60 text-slate-900 placeholder-slate-500 rounded-xl outline-none focus:ring-2 focus:ring-blue-600 border border-transparent transition-all"
          />

          <input
            type="password"
            required
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Senha"
            className="w-full h-12 px-4 bg-[#E2E8F0]/60 text-slate-900 placeholder-slate-500 rounded-xl outline-none focus:ring-2 focus:ring-blue-600 border border-transparent transition-all"
          />

          <button
            type="submit"
            className="w-full h-12 mt-1 bg-[#2563EB] hover:bg-blue-700 active:scale-[0.98] text-white font-medium rounded-xl transition-all shadow-sm flex items-center justify-center"
          >
            Continuar
          </button>
        </form>

        <p className="text-sm text-slate-500">
          Ainda não tem conta?{' '}
          <Link href="/register" className="text-blue-600 font-semibold hover:underline">
            Registrar-se
          </Link>
        </p>
      </div>
    </div>
  );
}