import Link from 'next/link';

export function Footer() {
  return (
    <footer className="bg-white border-t border-stone-200/60 py-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col md:flex-row justify-between items-center gap-8">
        <div className="flex flex-col items-center md:items-start gap-2">
          <div className="text-xl font-serif tracking-tight">
            <span className="text-stone-800">HARMO</span><span className="text-rose-400">CLINIC</span>
          </div>
          <div className="text-stone-500 text-sm font-light">
            Elevando o padrão da estética.
          </div>
        </div>
        
        <div className="text-stone-400 text-sm font-light">
          &copy; {new Date().getFullYear()} Harmoclinic. Todos os direitos reservados.
        </div>
        
        <div className="flex gap-6">
          <Link href="#" className="text-sm text-stone-400 hover:text-rose-400 transition-colors">
            Termos de Uso
          </Link>
          <Link href="#" className="text-sm text-stone-400 hover:text-rose-400 transition-colors">
            Política de Privacidade
          </Link>
        </div>
      </div>
    </footer>
  );
}
