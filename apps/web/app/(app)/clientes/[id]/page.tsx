'use client';

import { use, useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { ArrowLeft, Phone, Mail, Calendar, FileText, Sparkles, Image, DollarSign, Clock, Loader2, Pencil } from 'lucide-react';
import { Button } from '@/components/ui/button'; 
import { maskCpf, maskPhone } from '@/lib/masks';
import { fetcher } from '@/lib/api';

interface PatientDetailsPageProps {
  params: Promise<{ id: string }>;
}

export default function PatientDetailsPage({ params }: PatientDetailsPageProps) {
  const { id } = use(params);
  const router = useRouter();
  
  const [activeTab, setActiveTab] = useState<'anamnesis' | 'procedures' | 'photos' | 'quotes' | 'appointments'>('anamnesis');
  const [patient, setPatient] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3333/api';

  // Buscar dados reais do paciente pelo ID
  useEffect(() => {
    async function fetchPatient() {
      try {
        setLoading(true);
        const data = await fetcher(`/patients/${id}`);
        setPatient(data);
      } catch (error) {
        console.error('Erro ao carregar paciente:', error);
      } finally {
        setLoading(false);
      }
    }

    if (id) {
      fetchPatient();
    }
  }, [id]);

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[400px] gap-2">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
        <p className="text-sm text-muted-foreground">Carregando prontuário...</p>
      </div>
    );
  }

  if (!patient) {
    return (
      <div className="p-6 text-center space-y-4">
        <p className="text-muted-foreground">Paciente não encontrado.</p>
        <Button variant="outline" onClick={() => router.back()}>
          <ArrowLeft className="w-4 h-4 mr-2" /> Voltar para Clientes
        </Button>
      </div>
    );
  }

  return (
    <div className="p-6 space-y-6 max-w-7xl mx-auto">
      {/* 🔹 Header and Summary (Minimal SaaS Design) */}
      <div className="flex flex-col gap-6 mb-6">
        {/* Breadcrumb / Voltar */}
        <div>
          <button
            onClick={() => router.back()}
            className="text-sm font-medium text-muted-foreground hover:text-foreground flex items-center gap-2 transition-colors cursor-pointer"
          >
            <ArrowLeft className="w-4 h-4" />
            Voltar para Clientes
          </button>
        </div>

        {/* Profile Info & Actions */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 rounded-full bg-primary/10 text-primary flex items-center justify-center text-xl font-bold uppercase shrink-0">
              {patient.name.charAt(0)}
            </div>
            <div>
              <h1 className="text-3xl font-bold tracking-tight text-foreground">
                {patient.name}
              </h1>
              <p className="text-sm text-muted-foreground mt-1 flex items-center gap-2">
                <span>Prontuário Eletrônico</span>
                {patient.createdAt && (
                  <>
                    <span>•</span>
                    <span>Cliente desde {new Date(patient.createdAt).getFullYear()}</span>
                  </>
                )}
              </p>
            </div>
          </div>

          <div className="flex flex-wrap gap-2">
            <Button variant="outline" className="gap-2 cursor-pointer shadow-sm hidden sm:flex">
              <Pencil className="w-4 h-4" />
              Editar Perfil
            </Button>
            <Button variant="default" className="gap-2 cursor-pointer shadow-sm">
              <Sparkles className="w-4 h-4" />
              Novo Atendimento
            </Button>
          </div>
        </div>

        {/* Info Cards */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="bg-card p-4 rounded-xl border border-border shadow-xs flex flex-col gap-1">
            <div className="flex items-center gap-2 text-muted-foreground mb-1">
              <Phone className="w-4 h-4" />
              <span className="text-xs font-medium uppercase tracking-wider">Contato</span>
            </div>
            <span className="text-sm font-semibold text-foreground">
              {patient.phone ? maskPhone(patient.phone) : 'Não informado'}
            </span>
          </div>
          
          <div className="bg-card p-4 rounded-xl border border-border shadow-xs flex flex-col gap-1">
            <div className="flex items-center gap-2 text-muted-foreground mb-1">
              <Mail className="w-4 h-4" />
              <span className="text-xs font-medium uppercase tracking-wider">E-mail</span>
            </div>
            <span className="text-sm font-semibold text-foreground truncate" title={patient.email || ''}>
              {patient.email || 'Não informado'}
            </span>
          </div>

          <div className="bg-card p-4 rounded-xl border border-border shadow-xs flex flex-col gap-1">
            <div className="flex items-center gap-2 text-muted-foreground mb-1">
              <FileText className="w-4 h-4" />
              <span className="text-xs font-medium uppercase tracking-wider">Documento (CPF)</span>
            </div>
            <span className="text-sm font-semibold text-foreground">
              {patient.cpf ? maskCpf(patient.cpf) : 'Não informado'}
            </span>
          </div>

          <div className="bg-card p-4 rounded-xl border border-border shadow-xs flex flex-col gap-1">
            <div className="flex items-center gap-2 text-muted-foreground mb-1">
              <Calendar className="w-4 h-4" />
              <span className="text-xs font-medium uppercase tracking-wider">Nascimento</span>
            </div>
            <span className="text-sm font-semibold text-foreground">
              {patient.birthDate ? new Date(patient.birthDate).toLocaleDateString('pt-BR', { timeZone: 'UTC' }) : 'Não informada'}
            </span>
          </div>
        </div>
      </div>

      {/* 🔹 Navegação por Abas (Tabs) */}
      <div className="border-b border-border">
        <nav className="-mb-px flex space-x-8">
          <button
            onClick={() => setActiveTab('anamnesis')}
            className={`flex items-center gap-2 py-3 px-1 border-b-2 text-sm font-medium transition-colors cursor-pointer ${
              activeTab === 'anamnesis'
                ? 'border-primary text-primary font-semibold'
                : 'border-transparent text-muted-foreground hover:text-foreground'
            }`}
          >
            <FileText className="w-4 h-4" />
            Anamnese
          </button>

          <button
            onClick={() => setActiveTab('procedures')}
            className={`flex items-center gap-2 py-3 px-1 border-b-2 text-sm font-medium transition-colors cursor-pointer ${
              activeTab === 'procedures'
                ? 'border-primary text-primary font-semibold'
                : 'border-transparent text-muted-foreground hover:text-foreground'
            }`}
          >
            <Sparkles className="w-4 h-4" />
            Procedimentos
          </button>

          <button
            onClick={() => setActiveTab('photos')}
            className={`flex items-center gap-2 py-3 px-1 border-b-2 text-sm font-medium transition-colors cursor-pointer ${
              activeTab === 'photos'
                ? 'border-primary text-primary font-semibold'
                : 'border-transparent text-muted-foreground hover:text-foreground'
            }`}
          >
            <Image className="w-4 h-4" />
            Fotos (Antes & Depois)
          </button>

          <button
            onClick={() => setActiveTab('quotes')}
            className={`flex items-center gap-2 py-3 px-1 border-b-2 text-sm font-medium transition-colors cursor-pointer ${
              activeTab === 'quotes'
                ? 'border-primary text-primary font-semibold'
                : 'border-transparent text-muted-foreground hover:text-foreground'
            }`}
          >
            <DollarSign className="w-4 h-4" />
            Orçamentos
          </button>

          <button
            onClick={() => setActiveTab('appointments')}
            className={`flex items-center gap-2 py-3 px-1 border-b-2 text-sm font-medium transition-colors cursor-pointer ${
              activeTab === 'appointments'
                ? 'border-primary text-primary font-semibold'
                : 'border-transparent text-muted-foreground hover:text-foreground'
            }`}
          >
            <Clock className="w-4 h-4" />
            Agendamentos
          </button>
        </nav>
      </div>

      {/* 🔹 Conteúdo da Aba Selecionada */}
      <div className="bg-card p-6 rounded-xl border border-border min-h-[300px]">
        {activeTab === 'anamnesis' && (
          <div>
            <h3 className="text-lg font-semibold mb-2 text-foreground">Ficha de Anamnese</h3>
            <p className="text-sm text-muted-foreground">Histórico de saúde, alergias, medicações e contraindicações.</p>
          </div>
        )}

        {activeTab === 'procedures' && (
          <div>
            <h3 className="text-lg font-semibold mb-2 text-foreground">Procedimentos Realizados</h3>
            <p className="text-sm text-muted-foreground">Histórico de sessões e tratamentos estéticos aplicados.</p>
          </div>
        )}

        {activeTab === 'photos' && (
          <div>
            <h3 className="text-lg font-semibold mb-2 text-foreground">Fotos Antes & Depois</h3>
            <p className="text-sm text-muted-foreground">Comparativo visual de sessões e evolução do tratamento.</p>
          </div>
        )}

        {activeTab === 'quotes' && (
          <div>
            <h3 className="text-lg font-semibold mb-2 text-foreground">Orçamentos e Propostas</h3>
            <p className="text-sm text-muted-foreground">Acompanhamento financeiro de planos de tratamento.</p>
          </div>
        )}

        {activeTab === 'appointments' && (
          <div>
            <h3 className="text-lg font-semibold mb-2 text-foreground">Histórico de Agendamentos</h3>
            <p className="text-sm text-muted-foreground">Consultas e sessões agendadas ou finalizadas.</p>
          </div>
        )}
      </div>
    </div>
  );
}