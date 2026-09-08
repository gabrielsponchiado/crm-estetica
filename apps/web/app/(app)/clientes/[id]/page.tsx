'use client';

import { use, useState, useEffect, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import {
  ArrowLeft, Phone, Mail, Calendar, FileText, Sparkles, Image,
  DollarSign, Clock, Loader2, Pencil, LayoutDashboard, Activity,
  Save, Edit2, CheckCircle, XCircle, AlertCircle, Plus
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { maskCpf, maskPhone, unmaskCpf, unmaskPhone } from '@/lib/masks';
import { fetcher } from '@/lib/api';

interface PatientDetailsPageProps {
  params: Promise<{ id: string }>;
}

type AnamnesisData = {
  alergias: string;
  medicacoes: string;
  condicoes: string;
  contraindicacoes: string;
  observacoes: string;
};

const EMPTY_ANAMNESIS: AnamnesisData = {
  alergias: '',
  medicacoes: '',
  condicoes: '',
  contraindicacoes: '',
  observacoes: '',
};

const STATUS_CONFIG: Record<string, { label: string; className: string }> = {
  COMPLETED:   { label: 'Finalizado',       className: 'bg-green-100 text-green-700 border-green-200' },
  CANCELED:    { label: 'Cancelado',        className: 'bg-red-100 text-red-700 border-red-200' },
  CONFIRMED:   { label: 'Confirmado',       className: 'bg-blue-100 text-blue-700 border-blue-200' },
  SCHEDULED:   { label: 'Agendado',         className: 'bg-orange-100 text-orange-700 border-orange-200' },
  IN_PROGRESS: { label: 'Em andamento',     className: 'bg-purple-100 text-purple-700 border-purple-200' },
  NO_SHOW:     { label: 'Não compareceu',   className: 'bg-gray-100 text-gray-600 border-gray-200' },
};

const QUOTE_STATUS: Record<string, { label: string; className: string }> = {
  APPROVED: { label: 'Aprovado',  className: 'bg-green-100 text-green-700' },
  REJECTED: { label: 'Rejeitado', className: 'bg-red-100 text-red-700' },
  EXPIRED:  { label: 'Expirado',  className: 'bg-gray-100 text-gray-500' },
  PENDING:  { label: 'Pendente',  className: 'bg-yellow-100 text-yellow-700' },
};

export default function PatientDetailsPage({ params }: PatientDetailsPageProps) {
  const { id } = use(params);
  const router = useRouter();

  const [activeTab, setActiveTab] = useState<'overview' | 'anamnesis' | 'procedures' | 'photos' | 'quotes' | 'appointments'>('overview');
  const [patient, setPatient] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [procedureCatalog, setProcedureCatalog] = useState<any[]>([]);

  // Anamnese
  const [isEditingAnamnesis, setIsEditingAnamnesis] = useState(false);
  const [anamnesisForm, setAnamnesisForm] = useState<AnamnesisData>(EMPTY_ANAMNESIS);
  const [isSavingAnamnesis, setIsSavingAnamnesis] = useState(false);

  // Edit Profile
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [editFormData, setEditFormData] = useState({ name: '', phone: '', email: '', cpf: '', birthDate: '' });

  // New Appointment
  const [isNewAppointmentOpen, setIsNewAppointmentOpen] = useState(false);
  const [aptForm, setAptForm] = useState({ procedureId: '', date: '', duration: '60', notes: '' });
  const [isCreatingApt, setIsCreatingApt] = useState(false);
  const [aptError, setAptError] = useState('');

  const applyPatientData = useCallback((data: any) => {
    setPatient(data);
    setEditFormData({
      name: data.name || '',
      phone: data.phone || '',
      email: data.email || '',
      cpf: data.cpf || '',
      birthDate: data.birthDate ? (new Date(data.birthDate).toISOString().split('T')[0] ?? '') : ''
    });
    if (data.anamnesis && typeof data.anamnesis === 'object') {
      setAnamnesisForm({
        alergias:         data.anamnesis.alergias || '',
        medicacoes:       data.anamnesis.medicacoes || '',
        condicoes:        data.anamnesis.condicoes || '',
        contraindicacoes: data.anamnesis.contraindicacoes || '',
        observacoes:      data.anamnesis.observacoes || '',
      });
    }
  }, []);

  const refreshPatient = useCallback(async () => {
    const data: any = await fetcher(`/patients/${id}`);
    applyPatientData(data);
  }, [id, applyPatientData]);

  useEffect(() => {
    async function init() {
      try {
        setLoading(true);
        const [patientData, procs] = await Promise.all([
          fetcher<any>(`/patients/${id}`),
          fetcher<any[]>('/procedures').catch(() => []),
        ]);
        applyPatientData(patientData);
        setProcedureCatalog(Array.isArray(procs) ? procs : []);
      } catch (e) {
        console.error(e);
      } finally {
        setLoading(false);
      }
    }
    if (id) init();
  }, [id, applyPatientData]);

  const handleSaveAnamnesis = async () => {
    setIsSavingAnamnesis(true);
    try {
      await fetcher(`/patients/${id}`, {
        method: 'PATCH',
        body: JSON.stringify({ anamnesis: anamnesisForm }),
      });
      await refreshPatient();
      setIsEditingAnamnesis(false);
    } catch (err) {
      console.error('Erro ao salvar anamnese:', err);
    } finally {
      setIsSavingAnamnesis(false);
    }
  };

  const handleCancelAnamnesis = () => {
    const prev = patient?.anamnesis;
    if (prev && typeof prev === 'object') {
      setAnamnesisForm({
        alergias:         prev.alergias || '',
        medicacoes:       prev.medicacoes || '',
        condicoes:        prev.condicoes || '',
        contraindicacoes: prev.contraindicacoes || '',
        observacoes:      prev.observacoes || '',
      });
    } else {
      setAnamnesisForm(EMPTY_ANAMNESIS);
    }
    setIsEditingAnamnesis(false);
  };

  const handleEditSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await fetcher(`/patients/${id}`, {
        method: 'PATCH',
        body: JSON.stringify({
          ...editFormData,
          phone: unmaskPhone(editFormData.phone),
          cpf: unmaskCpf(editFormData.cpf),
          birthDate: editFormData.birthDate ? new Date(editFormData.birthDate).toISOString() : undefined,
        }),
      });
      await refreshPatient();
      setIsEditDialogOpen(false);
    } catch (err) {
      console.error('Erro ao atualizar paciente', err);
      setIsEditDialogOpen(false);
    }
  };

  const handleCreateAppointment = async (e: React.FormEvent) => {
    e.preventDefault();
    setAptError('');
    if (!aptForm.procedureId) { setAptError('Selecione um procedimento.'); return; }
    if (!aptForm.date)        { setAptError('Informe a data e hora.'); return; }
    setIsCreatingApt(true);
    try {
      await fetcher('/agenda', {
        method: 'POST',
        body: JSON.stringify({
          patientId:   id,
          procedureId: aptForm.procedureId,
          date:        new Date(aptForm.date).toISOString(),
          duration:    Number(aptForm.duration) || 60,
          notes:       aptForm.notes || undefined,
        }),
      });
      setIsNewAppointmentOpen(false);
      setAptForm({ procedureId: '', date: '', duration: '60', notes: '' });
      await refreshPatient();
      setActiveTab('appointments');
    } catch (err: any) {
      setAptError(err?.message || 'Erro ao criar agendamento.');
    } finally {
      setIsCreatingApt(false);
    }
  };

  const anamnesisHasContent = Object.values(anamnesisForm).some(v => v.trim() !== '');

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[400px] gap-3">
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

  const tabs = [
    { id: 'overview',     label: 'Visão Geral',   icon: LayoutDashboard },
    { id: 'anamnesis',    label: 'Anamnese',       icon: FileText },
    { id: 'procedures',   label: 'Procedimentos',  icon: Sparkles },
    { id: 'photos',       label: 'Fotos',          icon: Image },
    { id: 'quotes',       label: 'Orçamentos',     icon: DollarSign },
    { id: 'appointments', label: 'Agendamentos',   icon: Clock },
  ] as const;

  return (
    <div className="flex flex-col space-y-6 w-full min-h-full pb-12">

      {/* ─── Header ─── */}
      <div className="flex flex-col gap-6 mb-2">
        <button
          onClick={() => router.back()}
          className="text-sm font-medium text-muted-foreground hover:text-foreground flex items-center gap-2 transition-colors cursor-pointer w-fit"
        >
          <ArrowLeft className="w-4 h-4" />
          Voltar para Clientes
        </button>

        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 rounded-full bg-primary/10 text-primary flex items-center justify-center text-xl font-bold uppercase shrink-0">
              {patient.name.charAt(0)}
            </div>
            <div>
              <h1 className="text-3xl font-bold tracking-tight text-foreground">{patient.name}</h1>
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
            <Button variant="outline" className="gap-2 shadow-sm hidden sm:flex" onClick={() => setIsEditDialogOpen(true)}>
              <Pencil className="w-4 h-4" /> Editar Perfil
            </Button>
            <Button className="gap-2 shadow-sm" onClick={() => setIsNewAppointmentOpen(true)}>
              <Plus className="w-4 h-4" /> Novo Agendamento
            </Button>
          </div>
        </div>

        {/* Info Cards */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {[
            { icon: Phone,    label: 'Contato',    value: patient.phone     ? maskPhone(patient.phone)   : 'Não informado' },
            { icon: Mail,     label: 'E-mail',     value: patient.email     || 'Não informado', truncate: true },
            { icon: FileText, label: 'CPF',        value: patient.cpf       ? maskCpf(patient.cpf)       : 'Não informado' },
            { icon: Calendar, label: 'Nascimento', value: patient.birthDate ? new Date(patient.birthDate).toLocaleDateString('pt-BR', { timeZone: 'UTC' }) : 'Não informada' },
          ].map(({ icon: Icon, label, value, truncate }) => (
            <div key={label} className="bg-card p-4 rounded-xl border border-border shadow-xs flex flex-col gap-1">
              <div className="flex items-center gap-2 text-muted-foreground mb-1">
                <Icon className="w-4 h-4" />
                <span className="text-xs font-medium uppercase tracking-wider">{label}</span>
              </div>
              <span className={`text-sm font-semibold text-foreground ${truncate ? 'truncate' : ''}`}>
                {value}
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* ─── Tabs ─── */}
      <div className="border-b border-border overflow-x-auto custom-scrollbar">
        <nav className="-mb-px flex space-x-1 min-w-max">
          {tabs.map(({ id: tabId, label, icon: Icon }) => (
            <button
              key={tabId}
              onClick={() => setActiveTab(tabId)}
              className={`flex items-center gap-2 py-3 px-3 border-b-2 text-sm font-medium transition-colors cursor-pointer ${
                activeTab === tabId
                  ? 'border-primary text-primary'
                  : 'border-transparent text-muted-foreground hover:text-foreground hover:border-border'
              }`}
            >
              <Icon className="w-4 h-4" />
              {label}
            </button>
          ))}
        </nav>
      </div>

      {/* ─── Tab Content ─── */}
      <div className="bg-card rounded-xl border border-border min-h-[400px]">

        {/* ── Visão Geral ── */}
        {activeTab === 'overview' && (
          <div className="p-6 space-y-6">
            <div>
              <h3 className="text-base font-semibold text-foreground">Visão Geral</h3>
              <p className="text-sm text-muted-foreground mt-0.5">Resumo das atividades e informações importantes.</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="p-5 border rounded-xl bg-background flex flex-col justify-between">
                <div>
                  <div className="flex items-center gap-2 text-primary mb-3">
                    <Clock className="w-4 h-4" />
                    <h4 className="font-semibold text-sm text-foreground">Último / Próximo</h4>
                  </div>
                  {patient.appointments?.length > 0 ? (
                    <div>
                      <p className="font-medium text-sm text-foreground">{patient.appointments[0].procedure?.name || 'Consulta'}</p>
                      <p className="text-xs text-muted-foreground mt-1 flex items-center gap-1.5">
                        <Calendar className="w-3.5 h-3.5" />
                        {new Date(patient.appointments[0].scheduledAt).toLocaleDateString('pt-BR')} às {new Date(patient.appointments[0].scheduledAt).toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' })}
                      </p>
                      <span className={`inline-block mt-3 text-[10px] uppercase tracking-wider px-2.5 py-1 rounded-full font-bold border ${STATUS_CONFIG[patient.appointments[0].status]?.className || ''}`}>
                        {STATUS_CONFIG[patient.appointments[0].status]?.label || patient.appointments[0].status}
                      </span>
                    </div>
                  ) : (
                    <p className="text-sm text-muted-foreground">Nenhum agendamento registrado.</p>
                  )}
                </div>
                <Button variant="ghost" size="sm" className="mt-4 justify-start text-xs text-primary hover:text-primary/80 px-0" onClick={() => setActiveTab('appointments')}>
                  Ver agendamentos →
                </Button>
              </div>

              <div className="p-5 border rounded-xl bg-background flex flex-col justify-between">
                <div>
                  <div className="flex items-center gap-2 text-primary mb-3">
                    <Sparkles className="w-4 h-4" />
                    <h4 className="font-semibold text-sm text-foreground">Procedimentos</h4>
                  </div>
                  <div className="flex items-baseline gap-2 mt-4">
                    <span className="text-4xl font-bold text-foreground">{patient.procedures?.length || 0}</span>
                    <span className="text-xs text-muted-foreground font-medium uppercase tracking-wide">Sessões</span>
                  </div>
                  {patient.procedures?.length > 0 && (
                    <p className="text-xs text-muted-foreground mt-2 flex items-center gap-1">
                      <Clock className="w-3.5 h-3.5" /> Último em {new Date(patient.procedures[0].performedAt).toLocaleDateString('pt-BR')}
                    </p>
                  )}
                </div>
                <Button variant="ghost" size="sm" className="mt-4 justify-start text-xs text-primary hover:text-primary/80 px-0" onClick={() => setActiveTab('procedures')}>
                  Ver histórico →
                </Button>
              </div>

              <div className="p-5 border rounded-xl bg-background flex flex-col justify-between">
                <div>
                  <div className="flex items-center gap-2 text-primary mb-3">
                    <DollarSign className="w-4 h-4" />
                    <h4 className="font-semibold text-sm text-foreground">Total Investido</h4>
                  </div>
                  <p className="font-bold text-3xl text-foreground mt-4">
                    R$ {(patient.quotes?.filter((q: any) => q.status === 'APPROVED').reduce((acc: number, curr: any) => acc + Number(curr.totalValue), 0) || 0).toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                  </p>
                  <p className="text-xs text-muted-foreground mt-1">Orçamentos aprovados</p>
                </div>
                <Button variant="ghost" size="sm" className="mt-4 justify-start text-xs text-primary hover:text-primary/80 px-0" onClick={() => setActiveTab('quotes')}>
                  Ver orçamentos →
                </Button>
              </div>
            </div>

            <div className="pt-5 border-t border-border">
              <h4 className="text-sm font-semibold text-foreground mb-3 flex items-center gap-2">
                <Activity className="w-4 h-4 text-primary" /> Ações Rápidas
              </h4>
              <div className="flex flex-wrap gap-3">
                <Button variant="outline" size="sm" className="gap-2" onClick={() => setActiveTab('anamnesis')}>
                  <FileText className="w-4 h-4" /> Atualizar Anamnese
                </Button>
                <Button variant="outline" size="sm" className="gap-2" onClick={() => setIsNewAppointmentOpen(true)}>
                  <Plus className="w-4 h-4" /> Novo Agendamento
                </Button>
                <Button variant="outline" size="sm" className="gap-2" onClick={() => setActiveTab('photos')}>
                  <Image className="w-4 h-4" /> Adicionar Fotos
                </Button>
              </div>
            </div>
          </div>
        )}

        {/* ── Anamnese ── */}
        {activeTab === 'anamnesis' && (
          <div className="p-6">
            <div className="flex items-center justify-between mb-6">
              <div>
                <h3 className="text-base font-semibold text-foreground">Ficha de Anamnese</h3>
                <p className="text-sm text-muted-foreground mt-0.5">Histórico de saúde, alergias, medicações e contraindicações.</p>
              </div>
              {!isEditingAnamnesis && (
                <Button variant="outline" size="sm" className="gap-2" onClick={() => setIsEditingAnamnesis(true)}>
                  <Edit2 className="w-4 h-4" />
                  {anamnesisHasContent ? 'Editar Ficha' : 'Preencher Ficha'}
                </Button>
              )}
            </div>

            {isEditingAnamnesis ? (
              <div className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                  <div className="space-y-1.5">
                    <Label htmlFor="alergias" className="text-sm font-medium">Alergias conhecidas</Label>
                    <Textarea
                      id="alergias"
                      value={anamnesisForm.alergias}
                      onChange={e => setAnamnesisForm(prev => ({ ...prev, alergias: e.target.value }))}
                      placeholder="Ex: penicilina, látex, níquel..."
                      className="min-h-[80px] resize-none text-sm"
                    />
                  </div>
                  <div className="space-y-1.5">
                    <Label htmlFor="medicacoes" className="text-sm font-medium">Medicamentos em uso</Label>
                    <Textarea
                      id="medicacoes"
                      value={anamnesisForm.medicacoes}
                      onChange={e => setAnamnesisForm(prev => ({ ...prev, medicacoes: e.target.value }))}
                      placeholder="Ex: losartana 50mg, metformina 850mg..."
                      className="min-h-[80px] resize-none text-sm"
                    />
                  </div>
                  <div className="space-y-1.5">
                    <Label htmlFor="condicoes" className="text-sm font-medium">Condições de saúde</Label>
                    <Textarea
                      id="condicoes"
                      value={anamnesisForm.condicoes}
                      onChange={e => setAnamnesisForm(prev => ({ ...prev, condicoes: e.target.value }))}
                      placeholder="Ex: diabetes tipo 2, hipertensão, hipotireoidismo..."
                      className="min-h-[80px] resize-none text-sm"
                    />
                  </div>
                  <div className="space-y-1.5">
                    <Label htmlFor="contraindicacoes" className="text-sm font-medium">Contraindicações para procedimentos</Label>
                    <Textarea
                      id="contraindicacoes"
                      value={anamnesisForm.contraindicacoes}
                      onChange={e => setAnamnesisForm(prev => ({ ...prev, contraindicacoes: e.target.value }))}
                      placeholder="Ex: gravidez, marca-passo, epilepsia..."
                      className="min-h-[80px] resize-none text-sm"
                    />
                  </div>
                  <div className="space-y-1.5 md:col-span-2">
                    <Label htmlFor="observacoes" className="text-sm font-medium">Observações gerais</Label>
                    <Textarea
                      id="observacoes"
                      value={anamnesisForm.observacoes}
                      onChange={e => setAnamnesisForm(prev => ({ ...prev, observacoes: e.target.value }))}
                      placeholder="Informações adicionais relevantes..."
                      className="min-h-[80px] resize-none text-sm"
                    />
                  </div>
                </div>
                <div className="flex gap-3 pt-4 border-t border-border">
                  <Button onClick={handleSaveAnamnesis} disabled={isSavingAnamnesis} className="gap-2">
                    {isSavingAnamnesis ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
                    Salvar Anamnese
                  </Button>
                  <Button variant="outline" onClick={handleCancelAnamnesis} disabled={isSavingAnamnesis}>
                    Cancelar
                  </Button>
                </div>
              </div>
            ) : anamnesisHasContent ? (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {([
                  { field: 'alergias',         label: 'Alergias',                      icon: AlertCircle, color: 'text-red-500' },
                  { field: 'medicacoes',        label: 'Medicamentos em uso',           icon: FileText,    color: 'text-blue-500' },
                  { field: 'condicoes',         label: 'Condições de saúde',            icon: Activity,    color: 'text-orange-500' },
                  { field: 'contraindicacoes',  label: 'Contraindicações',              icon: XCircle,     color: 'text-yellow-600' },
                  { field: 'observacoes',       label: 'Observações gerais',            icon: CheckCircle, color: 'text-muted-foreground' },
                ] as { field: keyof AnamnesisData; label: string; icon: any; color: string }[]).map(({ field, label, icon: Icon, color }) => {
                  const value = anamnesisForm[field];
                  if (!value) return null;
                  return (
                    <div key={field} className="p-4 border rounded-xl bg-background">
                      <div className={`flex items-center gap-2 mb-2 ${color}`}>
                        <Icon className="w-4 h-4" />
                        <span className="text-xs font-semibold uppercase tracking-wider text-foreground">{label}</span>
                      </div>
                      <p className="text-sm text-foreground whitespace-pre-wrap leading-relaxed">{value}</p>
                    </div>
                  );
                })}
              </div>
            ) : (
              <div className="text-center py-16 text-muted-foreground border border-dashed rounded-xl bg-muted/20">
                <FileText className="w-10 h-10 mx-auto mb-3 opacity-40" />
                <p className="font-medium">Ficha de anamnese não preenchida</p>
                <p className="text-xs mt-1 opacity-70">Clique em "Preencher Ficha" para iniciar</p>
              </div>
            )}
          </div>
        )}

        {/* ── Procedimentos ── */}
        {activeTab === 'procedures' && (
          <div className="p-6">
            <div className="flex items-center justify-between mb-6">
              <div>
                <h3 className="text-base font-semibold text-foreground">Procedimentos Realizados</h3>
                <p className="text-sm text-muted-foreground mt-0.5">Histórico de sessões e tratamentos estéticos aplicados.</p>
              </div>
              <Button size="sm" className="gap-2" onClick={() => setIsNewAppointmentOpen(true)}>
                <Plus className="w-4 h-4" /> Agendar Procedimento
              </Button>
            </div>
            {patient.procedures?.length > 0 ? (
              <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                {patient.procedures.map((pp: any) => (
                  <div key={pp.id} className="p-4 border rounded-xl bg-background">
                    <p className="font-semibold text-sm text-foreground">{pp.procedure?.name || 'Procedimento'}</p>
                    <div className="mt-3 space-y-1.5">
                      <p className="text-xs text-muted-foreground flex items-center gap-2">
                        <Clock className="w-3.5 h-3.5 shrink-0" />
                        Realizado em: {new Date(pp.performedAt).toLocaleDateString('pt-BR')}
                      </p>
                      {pp.nextReturnAt && (
                        <p className="text-xs text-orange-500 font-medium flex items-center gap-2">
                          <Calendar className="w-3.5 h-3.5 shrink-0" />
                          Retorno: {new Date(pp.nextReturnAt).toLocaleDateString('pt-BR')}
                        </p>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-16 text-muted-foreground border border-dashed rounded-xl bg-muted/20">
                <Sparkles className="w-10 h-10 mx-auto mb-3 opacity-40" />
                <p className="font-medium">Nenhum procedimento registrado</p>
                <p className="text-xs mt-1 opacity-70">Agende um procedimento para iniciar o histórico</p>
              </div>
            )}
          </div>
        )}

        {/* ── Fotos ── */}
        {activeTab === 'photos' && (
          <div className="p-6">
            <div className="flex items-center justify-between mb-6">
              <div>
                <h3 className="text-base font-semibold text-foreground">Fotos Antes & Depois</h3>
                <p className="text-sm text-muted-foreground mt-0.5">Comparativo visual de sessões e evolução do tratamento.</p>
              </div>
              <Button size="sm" variant="outline" disabled className="gap-2 opacity-60">
                <Plus className="w-4 h-4" /> Nova Sessão
                <span className="text-[10px] bg-muted px-1.5 py-0.5 rounded-full">Em breve</span>
              </Button>
            </div>
            {patient.evaluations?.length > 0 ? (
              <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                {patient.evaluations.map((ev: any) => (
                  <div key={ev.id} className="border rounded-xl overflow-hidden bg-background">
                    <div className="p-4 border-b">
                      <p className="font-semibold text-sm text-foreground truncate">{ev.title || 'Avaliação'}</p>
                      <p className="text-xs text-muted-foreground flex items-center gap-1 mt-1">
                        <Calendar className="w-3 h-3" /> {new Date(ev.createdAt).toLocaleDateString('pt-BR')}
                      </p>
                    </div>
                    <div className="grid grid-cols-2 gap-px bg-border">
                      {['before', 'after'].map(type => {
                        const photos = type === 'before' ? ev.beforePhotos : ev.afterPhotos;
                        return (
                          <div key={type} className="aspect-square bg-muted flex flex-col items-center justify-center text-xs text-muted-foreground">
                            {photos?.[0] ? (
                              <img src={photos[0]} className="w-full h-full object-cover" alt={type === 'before' ? 'Antes' : 'Depois'} />
                            ) : (
                              <>
                                <Image className="w-5 h-5 mb-1 opacity-30" />
                                <span className="opacity-60 text-[11px]">{type === 'before' ? 'Antes' : 'Depois'}</span>
                              </>
                            )}
                          </div>
                        );
                      })}
                    </div>
                    {ev.notes && (
                      <div className="p-3 text-xs text-muted-foreground border-t">
                        <p className="line-clamp-2">{ev.notes}</p>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-16 text-muted-foreground border border-dashed rounded-xl bg-muted/20">
                <Image className="w-10 h-10 mx-auto mb-3 opacity-40" />
                <p className="font-medium">Nenhuma sessão de fotos registrada</p>
                <p className="text-xs mt-1 opacity-70">Disponível em breve</p>
              </div>
            )}
          </div>
        )}

        {/* ── Orçamentos ── */}
        {activeTab === 'quotes' && (
          <div className="p-6">
            <div className="flex items-center justify-between mb-6">
              <div>
                <h3 className="text-base font-semibold text-foreground">Orçamentos e Propostas</h3>
                <p className="text-sm text-muted-foreground mt-0.5">Acompanhamento financeiro de planos de tratamento.</p>
              </div>
              <Button size="sm" variant="outline" disabled className="gap-2 opacity-60">
                <Plus className="w-4 h-4" /> Novo Orçamento
                <span className="text-[10px] bg-muted px-1.5 py-0.5 rounded-full">Em breve</span>
              </Button>
            </div>
            {patient.quotes?.length > 0 ? (
              <div className="grid gap-3 lg:grid-cols-2">
                {patient.quotes.map((q: any) => {
                  const cfg = QUOTE_STATUS[q.status] || QUOTE_STATUS.PENDING || { label: 'Pendente', className: 'bg-yellow-100 text-yellow-700' };
                  return (
                    <div key={q.id} className="flex items-center justify-between p-5 border rounded-xl bg-background">
                      <div className="flex gap-4 items-center">
                        <div className="bg-primary/10 p-3 rounded-full text-primary shrink-0">
                          <DollarSign className="w-4 h-4" />
                        </div>
                        <div>
                          <p className="font-semibold text-sm text-foreground">Orçamento #{q.id.substring(0, 6).toUpperCase()}</p>
                          <p className="text-xs text-muted-foreground flex items-center gap-1 mt-0.5">
                            <Calendar className="w-3 h-3" /> {new Date(q.createdAt).toLocaleDateString('pt-BR')}
                          </p>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="font-bold text-foreground">R$ {Number(q.totalValue).toLocaleString('pt-BR', { minimumFractionDigits: 2 })}</p>
                        <span className={`inline-block mt-1 text-xs px-2.5 py-0.5 rounded-full font-medium ${cfg.className}`}>{cfg.label}</span>
                      </div>
                    </div>
                  );
                })}
              </div>
            ) : (
              <div className="text-center py-16 text-muted-foreground border border-dashed rounded-xl bg-muted/20">
                <DollarSign className="w-10 h-10 mx-auto mb-3 opacity-40" />
                <p className="font-medium">Nenhum orçamento registrado</p>
              </div>
            )}
          </div>
        )}

        {/* ── Agendamentos ── */}
        {activeTab === 'appointments' && (
          <div className="p-6">
            <div className="flex items-center justify-between mb-6">
              <div>
                <h3 className="text-base font-semibold text-foreground">Histórico de Agendamentos</h3>
                <p className="text-sm text-muted-foreground mt-0.5">Consultas e sessões agendadas ou finalizadas.</p>
              </div>
              <Button size="sm" className="gap-2" onClick={() => setIsNewAppointmentOpen(true)}>
                <Plus className="w-4 h-4" /> Agendar Consulta
              </Button>
            </div>
            {patient.appointments?.length > 0 ? (
              <div className="grid gap-3 lg:grid-cols-2">
                {patient.appointments.map((apt: any) => {
                  const cfg = STATUS_CONFIG[apt.status] || STATUS_CONFIG.SCHEDULED || { label: 'Agendado', className: 'bg-orange-100 text-orange-700 border-orange-200' };
                  return (
                    <div key={apt.id} className="flex flex-col sm:flex-row sm:items-center justify-between p-5 border rounded-xl bg-background gap-4">
                      <div className="flex items-center gap-4">
                        <div className="bg-primary/10 p-3 rounded-full text-primary shrink-0">
                          <Clock className="w-4 h-4" />
                        </div>
                        <div className="min-w-0">
                          <p className="font-semibold text-sm text-foreground truncate">{apt.procedure?.name || 'Consulta Estética'}</p>
                          <p className="text-xs text-muted-foreground flex flex-wrap items-center gap-1.5 mt-0.5">
                            <Calendar className="w-3.5 h-3.5 shrink-0" />
                            {new Date(apt.scheduledAt).toLocaleDateString('pt-BR')}
                            <span>às</span>
                            <span className="font-medium">{new Date(apt.scheduledAt).toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' })}</span>
                          </p>
                          {apt.notes && (
                            <p className="text-xs text-muted-foreground mt-1 truncate max-w-[240px]">{apt.notes}</p>
                          )}
                        </div>
                      </div>
                      <span className={`text-xs px-3 py-1 rounded-full font-medium border shrink-0 ${cfg.className}`}>
                        {cfg.label}
                      </span>
                    </div>
                  );
                })}
              </div>
            ) : (
              <div className="text-center py-16 text-muted-foreground border border-dashed rounded-xl bg-muted/20">
                <Clock className="w-10 h-10 mx-auto mb-3 opacity-40" />
                <p className="font-medium">Nenhum agendamento encontrado</p>
                <p className="text-xs mt-1 opacity-70">Crie o primeiro agendamento para este paciente</p>
              </div>
            )}
          </div>
        )}
      </div>

      {/* ─── Modal: Editar Perfil ─── */}
      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle>Editar Perfil</DialogTitle>
            <DialogDescription>Atualize as informações cadastrais de {patient.name.split(' ')[0]}.</DialogDescription>
          </DialogHeader>
          <form onSubmit={handleEditSubmit} className="space-y-5 py-4">
            <div className="space-y-2">
              <Label htmlFor="edit-name">Nome Completo</Label>
              <Input id="edit-name" value={editFormData.name} onChange={e => setEditFormData({ ...editFormData, name: e.target.value })} required />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="edit-cpf">CPF</Label>
                <Input id="edit-cpf" value={maskCpf(editFormData.cpf)} onChange={e => setEditFormData({ ...editFormData, cpf: e.target.value })} placeholder="000.000.000-00" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="edit-birthDate">Nascimento</Label>
                <Input id="edit-birthDate" type="date" value={editFormData.birthDate} onChange={e => setEditFormData({ ...editFormData, birthDate: e.target.value })} />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="edit-phone">Celular</Label>
                <Input id="edit-phone" value={maskPhone(editFormData.phone)} onChange={e => setEditFormData({ ...editFormData, phone: e.target.value })} placeholder="(00) 00000-0000" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="edit-email">E-mail</Label>
                <Input id="edit-email" type="email" value={editFormData.email} onChange={e => setEditFormData({ ...editFormData, email: e.target.value })} placeholder="email@exemplo.com" />
              </div>
            </div>
            <DialogFooter className="pt-4 border-t border-border">
              <Button type="button" variant="outline" onClick={() => setIsEditDialogOpen(false)}>Cancelar</Button>
              <Button type="submit">Salvar Alterações</Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      {/* ─── Modal: Novo Agendamento ─── */}
      <Dialog open={isNewAppointmentOpen} onOpenChange={(open) => { setIsNewAppointmentOpen(open); if (!open) setAptError(''); }}>
        <DialogContent className="sm:max-w-[480px]">
          <DialogHeader>
            <DialogTitle>Novo Agendamento</DialogTitle>
            <DialogDescription>Agende uma consulta ou sessão para {patient.name.split(' ')[0]}.</DialogDescription>
          </DialogHeader>
          <form onSubmit={handleCreateAppointment} className="space-y-5 py-4">
            <div className="space-y-2">
              <Label htmlFor="apt-procedure">Procedimento *</Label>
              <select
                id="apt-procedure"
                value={aptForm.procedureId}
                onChange={e => setAptForm(prev => ({ ...prev, procedureId: e.target.value }))}
                className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2"
                required
              >
                <option value="">Selecione um procedimento...</option>
                {procedureCatalog.map((p: any) => (
                  <option key={p.id} value={p.id}>
                    {p.name} — R$ {Number(p.price).toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                  </option>
                ))}
              </select>
              {procedureCatalog.length === 0 && (
                <p className="text-xs text-muted-foreground">Nenhum procedimento cadastrado. Acesse Procedimentos para cadastrar.</p>
              )}
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="apt-date">Data e Hora *</Label>
                <Input id="apt-date" type="datetime-local" value={aptForm.date} onChange={e => setAptForm(prev => ({ ...prev, date: e.target.value }))} required />
              </div>
              <div className="space-y-2">
                <Label htmlFor="apt-duration">Duração (min)</Label>
                <Input id="apt-duration" type="number" min={15} max={480} value={aptForm.duration} onChange={e => setAptForm(prev => ({ ...prev, duration: e.target.value }))} />
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="apt-notes">Observações</Label>
              <Textarea
                id="apt-notes"
                placeholder="Motivo da consulta, preparações necessárias..."
                value={aptForm.notes}
                onChange={e => setAptForm(prev => ({ ...prev, notes: e.target.value }))}
                className="resize-none min-h-[80px] text-sm"
              />
            </div>
            {aptError && (
              <div className="flex items-center gap-2 text-sm text-destructive bg-destructive/10 border border-destructive/20 rounded-lg px-3 py-2">
                <AlertCircle className="w-4 h-4 shrink-0" />
                {aptError}
              </div>
            )}
            <DialogFooter className="pt-4 border-t border-border">
              <Button type="button" variant="outline" onClick={() => setIsNewAppointmentOpen(false)}>Cancelar</Button>
              <Button type="submit" disabled={isCreatingApt} className="gap-2">
                {isCreatingApt ? <Loader2 className="w-4 h-4 animate-spin" /> : <Plus className="w-4 h-4" />}
                Agendar
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
}