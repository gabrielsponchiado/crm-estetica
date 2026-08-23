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
    <div className="p-6 space-y-6 max-w-[1600px] mx-auto">
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
      <div className="bg-card p-6 rounded-xl border border-border min-h-[400px]">
        {activeTab === 'anamnesis' && (
          <div className="animate-in fade-in slide-in-from-bottom-2 duration-300">
            <h3 className="text-lg font-semibold text-foreground">Ficha de Anamnese</h3>
            <p className="text-sm text-muted-foreground">Histórico de saúde, alergias, medicações e contraindicações.</p>
            {patient.anamnesis ? (
              <pre className="p-4 bg-muted/50 rounded-lg text-sm mt-4 overflow-auto border">
                {JSON.stringify(patient.anamnesis, null, 2)}
              </pre>
            ) : (
              <div className="text-center py-12 text-muted-foreground border border-dashed rounded-lg mt-4 bg-muted/20">
                <FileText className="w-8 h-8 mx-auto mb-3 opacity-50" />
                <p>Nenhuma ficha de anamnese preenchida.</p>
                <Button variant="outline" className="mt-4 bg-background">Preencher Ficha</Button>
              </div>
            )}
          </div>
        )}

        {activeTab === 'procedures' && (
          <div className="animate-in fade-in slide-in-from-bottom-2 duration-300">
            <div className="flex items-center justify-between mb-2">
              <div>
                <h3 className="text-lg font-semibold text-foreground">Procedimentos Realizados</h3>
                <p className="text-sm text-muted-foreground">Histórico de sessões e tratamentos estéticos aplicados.</p>
              </div>
              <Button size="sm"><Sparkles className="w-4 h-4 mr-2" /> Registrar Procedimento</Button>
            </div>
            {patient.procedures?.length > 0 ? (
              <div className="mt-4 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                {patient.procedures.map((pp: any) => (
                  <div key={pp.id} className="p-4 border rounded-xl bg-card shadow-sm hover:shadow-md transition-shadow">
                    <p className="font-semibold text-foreground">{pp.procedure?.name || 'Procedimento'}</p>
                    <div className="mt-2 space-y-1">
                      <p className="text-sm text-muted-foreground flex items-center gap-2">
                        <Clock className="w-3.5 h-3.5" />
                        Realizado em: {new Date(pp.performedAt).toLocaleDateString('pt-BR')}
                      </p>
                      {pp.nextReturnAt && (
                        <p className="text-sm text-orange-500 font-medium flex items-center gap-2 mt-1">
                          <Calendar className="w-3.5 h-3.5" />
                          Retorno: {new Date(pp.nextReturnAt).toLocaleDateString('pt-BR')}
                        </p>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-12 text-muted-foreground border border-dashed rounded-lg mt-4 bg-muted/20">
                <Sparkles className="w-8 h-8 mx-auto mb-3 opacity-50" />
                <p>Nenhum procedimento registrado.</p>
              </div>
            )}
          </div>
        )}

        {activeTab === 'photos' && (
          <div className="animate-in fade-in slide-in-from-bottom-2 duration-300">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h3 className="text-lg font-semibold text-foreground">Fotos Antes & Depois</h3>
                <p className="text-sm text-muted-foreground">Comparativo visual de sessões e evolução do tratamento.</p>
              </div>
              <Button size="sm"><Image className="w-4 h-4 mr-2" /> Nova Sessão</Button>
            </div>
            
            {patient.evaluations?.length > 0 ? (
              <div className="mt-4 grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                {patient.evaluations.map((ev: any) => (
                  <div key={ev.id} className="border rounded-xl overflow-hidden bg-card shadow-sm hover:shadow-md transition-shadow">
                    <div className="p-4 border-b bg-muted/10">
                      <p className="font-semibold text-foreground truncate">{ev.title || 'Avaliação'}</p>
                      <p className="text-xs text-muted-foreground flex items-center gap-1 mt-1">
                        <Calendar className="w-3 h-3" />
                        {new Date(ev.createdAt).toLocaleDateString('pt-BR')}
                      </p>
                    </div>
                    <div className="grid grid-cols-2 gap-px bg-border">
                       <div className="aspect-square bg-muted flex flex-col items-center justify-center text-xs text-muted-foreground relative group">
                         {ev.beforePhotos?.[0] ? (
                           <img src={ev.beforePhotos[0]} className="w-full h-full object-cover" alt="Antes" />
                         ) : (
                           <>
                             <Image className="w-6 h-6 mb-1 opacity-40" />
                             <span className="opacity-70">Antes</span>
                           </>
                         )}
                       </div>
                       <div className="aspect-square bg-muted flex flex-col items-center justify-center text-xs text-muted-foreground relative group">
                         {ev.afterPhotos?.[0] ? (
                           <img src={ev.afterPhotos[0]} className="w-full h-full object-cover" alt="Depois" />
                         ) : (
                           <>
                             <Image className="w-6 h-6 mb-1 opacity-40" />
                             <span className="opacity-70">Depois</span>
                           </>
                         )}
                       </div>
                    </div>
                    {ev.notes && (
                      <div className="p-3 text-xs text-muted-foreground border-t">
                        <p className="line-clamp-2" title={ev.notes}>{ev.notes}</p>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-12 text-muted-foreground border border-dashed rounded-lg mt-4 bg-muted/20">
                <Image className="w-8 h-8 mx-auto mb-3 opacity-50" />
                <p>Nenhuma sessão de fotos registrada.</p>
                <p className="text-xs mt-1 opacity-70">Crie uma nova sessão para acompanhar a evolução do paciente.</p>
              </div>
            )}
          </div>
        )}

        {activeTab === 'quotes' && (
          <div className="animate-in fade-in slide-in-from-bottom-2 duration-300">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h3 className="text-lg font-semibold text-foreground">Orçamentos e Propostas</h3>
                <p className="text-sm text-muted-foreground">Acompanhamento financeiro de planos de tratamento.</p>
              </div>
              <Button size="sm"><DollarSign className="w-4 h-4 mr-2" /> Novo Orçamento</Button>
            </div>
            
            {patient.quotes?.length > 0 ? (
               <div className="mt-4 grid gap-4 lg:grid-cols-2">
                 {patient.quotes.map((q: any) => (
                   <div key={q.id} className="flex items-center justify-between p-5 border rounded-xl bg-card shadow-sm hover:shadow-md transition-shadow">
                     <div className="flex gap-4 items-center">
                       <div className="bg-primary/10 p-3 rounded-full text-primary">
                         <DollarSign className="w-5 h-5" />
                       </div>
                       <div>
                         <p className="font-semibold text-foreground">Orçamento #{q.id.substring(0,6).toUpperCase()}</p>
                         <p className="text-sm text-muted-foreground flex items-center gap-1 mt-0.5">
                           <Calendar className="w-3.5 h-3.5" />
                           {new Date(q.createdAt).toLocaleDateString('pt-BR')}
                         </p>
                       </div>
                     </div>
                     <div className="text-right">
                       <p className="font-bold text-foreground text-lg">R$ {Number(q.totalValue).toLocaleString('pt-BR', {minimumFractionDigits: 2})}</p>
                       <span className={`inline-block mt-1 text-xs px-2.5 py-0.5 rounded-full font-medium ${
                         q.status === 'APPROVED' ? 'bg-green-100 text-green-700' :
                         q.status === 'REJECTED' ? 'bg-red-100 text-red-700' :
                         'bg-yellow-100 text-yellow-700'
                       }`}>
                         {q.status === 'APPROVED' ? 'Aprovado' : q.status === 'REJECTED' ? 'Rejeitado' : 'Pendente'}
                       </span>
                     </div>
                   </div>
                 ))}
               </div>
            ) : (
              <div className="text-center py-12 text-muted-foreground border border-dashed rounded-lg mt-4 bg-muted/20">
                <DollarSign className="w-8 h-8 mx-auto mb-3 opacity-50" />
                <p>Nenhum orçamento registrado.</p>
              </div>
            )}
          </div>
        )}

        {activeTab === 'appointments' && (
          <div className="animate-in fade-in slide-in-from-bottom-2 duration-300">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h3 className="text-lg font-semibold text-foreground">Histórico de Agendamentos</h3>
                <p className="text-sm text-muted-foreground">Consultas e sessões agendadas ou finalizadas.</p>
              </div>
              <Button size="sm"><Clock className="w-4 h-4 mr-2" /> Agendar Consulta</Button>
            </div>
            
            {patient.appointments?.length > 0 ? (
               <div className="mt-4 grid gap-4 lg:grid-cols-2">
                 {patient.appointments.map((apt: any) => (
                   <div key={apt.id} className="flex flex-col sm:flex-row sm:items-center justify-between p-5 border rounded-xl bg-card shadow-sm hover:shadow-md transition-shadow gap-4">
                     <div className="flex items-center gap-4">
                       <div className="bg-primary/10 p-3 rounded-full text-primary shrink-0">
                         <Clock className="w-5 h-5" />
                       </div>
                       <div className="min-w-0">
                         <p className="font-semibold text-foreground truncate">{apt.procedure?.name || 'Consulta Estética'}</p>
                         <p className="text-sm text-muted-foreground flex flex-wrap items-center gap-1.5 mt-0.5">
                           <Calendar className="w-3.5 h-3.5" />
                           {new Date(apt.scheduledAt).toLocaleDateString('pt-BR')} 
                           <span>às</span>
                           <span className="font-medium">{new Date(apt.scheduledAt).toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit'})}</span>
                         </p>
                       </div>
                     </div>
                     <div className="shrink-0">
                       <span className={`text-xs px-3 py-1 rounded-full font-medium border ${
                         apt.status === 'COMPLETED' ? 'bg-green-100 text-green-700 border-green-200' :
                         apt.status === 'CANCELED' ? 'bg-red-100 text-red-700 border-red-200' :
                         apt.status === 'CONFIRMED' ? 'bg-blue-100 text-blue-700 border-blue-200' :
                         'bg-orange-100 text-orange-700 border-orange-200'
                       }`}>
                         {apt.status === 'COMPLETED' ? 'Finalizado' : 
                          apt.status === 'CANCELED' ? 'Cancelado' : 
                          apt.status === 'CONFIRMED' ? 'Confirmado' : 
                          'Agendado'}
                       </span>
                     </div>
                   </div>
                 ))}
               </div>
            ) : (
              <div className="text-center py-12 text-muted-foreground border border-dashed rounded-lg mt-4 bg-muted/20">
                <Clock className="w-8 h-8 mx-auto mb-3 opacity-50" />
                <p>Nenhum agendamento encontrado.</p>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}