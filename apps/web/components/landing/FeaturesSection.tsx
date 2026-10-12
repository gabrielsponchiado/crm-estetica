"use client";

import { motion } from 'motion/react';
import { Users, Camera, FileText, CalendarHeart } from 'lucide-react';

const features = [
  {
    title: "Experiência do Paciente",
    description: "Um perfil unificado e elegante com todo o histórico e planejamento estético.",
    icon: <Users className="w-5 h-5 text-rose-500" strokeWidth={1.5} />,
    className: "md:col-span-2",
  },
  {
    title: "Evolução Visual",
    description: "Ferramenta lado-a-lado para documentar os resultados de alto impacto.",
    icon: <Camera className="w-5 h-5 text-amber-500" strokeWidth={1.5} />,
    className: "md:col-span-1",
  },
  {
    title: "Prontuários Ágeis",
    description: "Assinaturas e termos preenchidos com fluidez e amparo legal.",
    icon: <FileText className="w-5 h-5 text-emerald-500" strokeWidth={1.5} />,
    className: "md:col-span-1",
  },
  {
    title: "Controle de Protocolos",
    description: "Nunca perca a data de retoque do botox ou das sessões de acompanhamento.",
    icon: <CalendarHeart className="w-5 h-5 text-blue-500" strokeWidth={1.5} />,
    className: "md:col-span-2",
  }
];

export function FeaturesSection() {
  return (
    <section id="features" className="py-24 sm:py-32 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-16 gap-8">
          <div className="max-w-2xl">
            <motion.h2 
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8 }}
              className="text-3xl sm:text-4xl md:text-5xl font-serif text-stone-900 mb-6 tracking-tight"
            >
              Arquitetura para Clínicas de Sucesso
            </motion.h2>
            <motion.p 
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.1, duration: 0.8 }}
              className="text-stone-500 text-lg font-light leading-relaxed"
            >
              Projetado para eliminar a complexidade operacional. Foque no que realmente importa: a arte da estética e o bem-estar do seu paciente.
            </motion.p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {features.map((feat, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-50px" }}
              transition={{ delay: index * 0.1, duration: 0.8 }}
              className={`p-10 rounded-2xl bg-[#FAFAFA] border border-stone-200/60 hover:bg-white transition-colors duration-500 flex flex-col justify-between min-h-[300px] shadow-sm hover:shadow-md ${feat.className}`}
            >
              <div className="w-12 h-12 rounded-xl bg-white border border-stone-200 flex items-center justify-center shadow-sm mb-8">
                {feat.icon}
              </div>
              <div>
                <h3 className="text-xl font-medium text-stone-900 mb-3 tracking-tight">{feat.title}</h3>
                <p className="text-stone-500 font-light leading-relaxed">
                  {feat.description}
                </p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
