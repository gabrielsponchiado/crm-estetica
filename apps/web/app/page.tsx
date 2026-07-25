import Link from 'next/link';

export default function Home() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-[#F8FAFC] p-4 text-center">
      <h1 className="text-4xl font-bold text-slate-900 mb-2">Estética</h1>
      <p className="text-slate-600 mb-8 max-w-md">
        Gerencie seus pacientes, prontuários, fotos de antes e depois e retornos de forma simples.
      </p>

      <div className="flex gap-4">
        <Link
          href="/login"
          className="px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-xl transition"
        >
          Acessar Conta
        </Link>
        <Link
          href="/register"
          className="px-6 py-3 bg-slate-200 hover:bg-slate-300 text-slate-800 font-medium rounded-xl transition"
        >
          Cadastre-se
        </Link>
      </div>
    </div>
  );
}