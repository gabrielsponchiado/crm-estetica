"use client";

import { motion } from 'motion/react';
import Link from 'next/link';
import { ArrowRight } from 'lucide-react';

export function HeroSection() {
  return (
    <section className="relative overflow-hidden bg-[#FAFAFA] py-24 sm:py-32 min-h-[90vh] flex items-center">
      {/* Subtle grid background for structural feel */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:24px_24px]"></div>
      
      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center z-10 w-full">
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, ease: [0.16, 1, 0.3, 1] }}
          className="max-w-4xl mx-auto"
        >
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3, duration: 1 }}
            className="inline-block mb-6 text-xs font-semibold tracking-[0.2em] text-rose-500 uppercase"
          >
            A Tecnologia a Favor da Beleza
          </motion.div>

          <h1 className="text-5xl sm:text-6xl md:text-[5rem] font-serif text-stone-900 tracking-tight leading-[1.1] mb-8">
            O padrão ouro em gestão <br className="hidden sm:block" />
            <span className="text-rose-400 italic">para clínicas de estética.</span>
          </h1>
          
          <p className="text-lg md:text-xl text-stone-500 mb-12 leading-relaxed font-light max-w-2xl mx-auto">
            Harmoclinic transforma a rotina de profissionais de harmonização. Prontuários precisos, acompanhamento fotográfico inteligente e gestão de alto nível em uma única plataforma.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
            <Link 
              href="/register" 
              className="group relative inline-flex items-center justify-center px-8 py-4 text-sm font-medium text-white transition-all duration-300 bg-rose-400 rounded-lg hover:bg-rose-500 w-full sm:w-auto shadow-sm"
            >
              Iniciar Experiência
              <ArrowRight className="ml-2 w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </Link>
            <Link 
              href="#features" 
              className="inline-flex items-center justify-center px-8 py-4 text-sm font-medium text-stone-700 transition-all duration-300 bg-white border border-stone-200 rounded-lg hover:bg-stone-50 hover:border-stone-300 w-full sm:w-auto shadow-sm"
            >
              Explorar Funcionalidades
            </Link>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
