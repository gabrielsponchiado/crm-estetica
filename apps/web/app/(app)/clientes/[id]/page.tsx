'use client';

import { use, useCallback, useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import {
  ArrowLeft,
  Clock,
  DollarSign,
  FileText,
  Image,
  LayoutDashboard,
  Loader2,
  Sparkles,
} from 'lucide-react';

import { fetcher } from '@/lib/api';
import { Button } from '@/components/ui/button';

import { PatientHeader } from '../components/PatientHeader';
import { PatientOverview } from '../components/PatientOverview';
import { PatientAnamnesis } from '../components/PatientAnamnesis';
import { PatientProcedures } from '../components/PatientProcedures';
import { PatientPhotos } from '../components/PatientPhotos';
import { PatientQuotes } from '../components/PatientQuotes';
import { PatientAppointments } from '../components/PatientAppointments';
import { EditPatientDialog } from '../components/EditPatientDialog';
import { NewAppointmentDialog } from '../components/NewAppointmentDialog';

interface PatientDetailsPageProps {
  params: Promise<{ id: string }>;
}

type TabId =
  | 'overview'
  | 'anamnesis'
  | 'procedures'
  | 'photos'
  | 'quotes'
  | 'appointments';

const TABS: {
  id: TabId;
  label: string;
  icon: typeof LayoutDashboard;
}[] = [
  { id: 'overview', label: 'Visão Geral', icon: LayoutDashboard },
  { id: 'anamnesis', label: 'Anamnese', icon: FileText },
  { id: 'procedures', label: 'Procedimentos', icon: Sparkles },
  { id: 'photos', label: 'Fotos', icon: Image },
  { id: 'quotes', label: 'Orçamentos', icon: DollarSign },
  { id: 'appointments', label: 'Agendamentos', icon: Clock },
];

export default function PatientDetailsPage({
  params,
}: PatientDetailsPageProps) {
  const { id } = use(params);
  const router = useRouter();

  const [activeTab, setActiveTab] = useState<TabId>('overview');
  const [patient, setPatient] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [procedureCatalog, setProcedureCatalog] = useState<any[]>([]);

  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [isNewAppointmentOpen, setIsNewAppointmentOpen] = useState(false);

  const applyPatientData = useCallback((data: any) => {
    setPatient(data);
  }, []);

  const refreshPatient = useCallback(async () => {
    const data = await fetcher(`/patients/${id}`);
    applyPatientData(data);
  }, [id, applyPatientData]);

  useEffect(() => {
    async function init() {
      try {
        setLoading(true);

        const [patientData, procedures] = await Promise.all([
          fetcher<any>(`/patients/${id}`),
          fetcher<any[]>('/procedures').catch(() => []),
        ]);

        applyPatientData(patientData);
        setProcedureCatalog(
          Array.isArray(procedures) ? procedures : [],
        );
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    }

    if (id) {
      init();
    }
  }, [id, applyPatientData]);

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[400px] gap-3">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />

        <p className="text-sm text-muted-foreground">
          Carregando prontuário...
        </p>
      </div>
    );
  }

  if (!patient) {
    return (
      <div className="p-6 text-center space-y-4">
        <p className="text-muted-foreground">
          Paciente não encontrado.
        </p>

        <Button
          variant="outline"
          onClick={() => router.back()}
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          Voltar para Clientes
        </Button>
      </div>
    );
  }

  return (
    <div className="flex flex-col space-y-6 w-full min-h-full pb-12">
      <PatientHeader
        patient={patient}
        onBack={() => router.back()}
        onEdit={() => setIsEditDialogOpen(true)}
        onNewAppointment={() => setIsNewAppointmentOpen(true)}
      />

      <div className="border-b border-border overflow-x-auto custom-scrollbar">
        <nav className="-mb-px flex space-x-1 min-w-max">
          {TABS.map(({ id: tabId, label, icon: Icon }) => (
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

      <div className="bg-card rounded-xl border border-border min-h-[400px]">
        {activeTab === 'overview' && (
          <PatientOverview
            patient={patient}
            onTabChange={setActiveTab}
            onNewAppointment={() =>
              setIsNewAppointmentOpen(true)
            }
          />
        )}

        {activeTab === 'anamnesis' && (
          <PatientAnamnesis
            patient={patient}
            patientId={id}
            onRefresh={refreshPatient}
          />
        )}

        {activeTab === 'procedures' && (
          <PatientProcedures
            patient={patient}
            onNewAppointment={() =>
              setIsNewAppointmentOpen(true)
            }
          />
        )}

        {activeTab === 'photos' && (
          <PatientPhotos patient={patient} />
        )}

        {activeTab === 'quotes' && (
          <PatientQuotes patient={patient} />
        )}

        {activeTab === 'appointments' && (
          <PatientAppointments
            patient={patient}
            onNewAppointment={() =>
              setIsNewAppointmentOpen(true)
            }
          />
        )}
      </div>

      <EditPatientDialog
        patient={patient}
        patientId={id}
        open={isEditDialogOpen}
        onOpenChange={setIsEditDialogOpen}
        onSaved={refreshPatient}
      />

      <NewAppointmentDialog
        patientId={id}
        patientName={patient.name}
        procedureCatalog={procedureCatalog}
        open={isNewAppointmentOpen}
        onOpenChange={setIsNewAppointmentOpen}
        onCreated={async () => {
          await refreshPatient();
          setActiveTab('appointments');
        }}
      />
    </div>
  );
}