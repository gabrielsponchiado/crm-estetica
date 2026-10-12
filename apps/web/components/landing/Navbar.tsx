"use client";

import Link from 'next/link';
import { motion } from 'motion/react';

export function Navbar() {
  return (
    <motion.nav 
      initial={{ y: -20, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
      className="w-full bg-white/90 backdrop-blur-md sticky top-0 z-50 border-b border-stone-200/60"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between">
        <Link href="/" className="text-2xl font-serif tracking-tight">
          <span className="text-stone-800">HARMO</span><span className="text-rose-400">CLINIC</span>
        </Link>
        <div className="flex gap-6 items-center">
          <Link href="/login" className="text-sm text-stone-600 hover:text-stone-900 font-medium transition-colors">
            Acesso
          </Link>
          <Link href="/register" className="bg-rose-400 hover:bg-rose-500 text-white text-sm px-6 py-2.5 rounded-lg font-medium transition-colors shadow-sm">
            Criar Conta
          </Link>
        </div>
      </div>
    </motion.nav>
  );
}
