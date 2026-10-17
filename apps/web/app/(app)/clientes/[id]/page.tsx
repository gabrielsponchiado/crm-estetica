"use client";

import { use, useCallback, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import {
  ArrowLeft,
  Clock,
  DollarSign,
  FileText,
  Image as ImageIcon,
  LayoutDashboard,
  Loader2,
  Sparkles,
  UserX,
} from "lucide-react";

import { fetcher } from "@/lib/api";
import { Button } from "@/components/ui/button";

import { PatientHeader } from "./components/PatientHeader";
import { PatientOverview } from "./components/PatientOverview";
import { PatientAnamnesis } from "./components/PatientAnamnesis";
import { PatientProcedures } from "./components/PatientProcedures";
import { PatientPhotos } from "./components/PatientPhotos";
import { PatientQuotes } from "./components/PatientQuotes";
import { PatientAppointments } from "./components/PatientAppointments";
import { EditPatientDialog } from "./components/EditPatientDialog";
import { NewAppointmentDialog } from "./components/NewAppointmentDialog";

interface PatientDetailsPageProps {
  params: Promise<{ id: string }>;
}

type TabId =
  | "overview"
  | "anamnesis"
  | "procedures"
  | "photos"
  | "quotes"
  | "appointments";

type ProcedureCatalogItem = {
  id: string;
  name: string;
};

const TABS: {
  id: TabId;
  label: string;
  icon: typeof LayoutDashboard;
}[] = [
  {
    id: "overview",
    label: "Visão Geral",
    icon: LayoutDashboard,
  },
  {
    id: "anamnesis",
    label: "Anamnese",
    icon: FileText,
  },
  {
    id: "procedures",
    label: "Procedimentos",
    icon: Sparkles,
  },
  {
    id: "photos",
    label: "Fotos",
    icon: ImageIcon,
  },
  {
    id: "quotes",
    label: "Orçamentos",
    icon: DollarSign,
  },
  {
    id: "appointments",
    label: "Agendamentos",
    icon: Clock,
  },
];

export default function PatientDetailsPage({
  params,
}: PatientDetailsPageProps) {
  const { id } = use(params);
  const router = useRouter();

  const [activeTab, setActiveTab] = useState<TabId>("overview");
  const [patient, setPatient] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [procedureCatalog, setProcedureCatalog] = useState<
    ProcedureCatalogItem[]
  >([]);

  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [isNewAppointmentOpen, setIsNewAppointmentOpen] = useState(false);

  const applyPatientData = useCallback((data: any) => {
    setPatient(data);
  }, []);

  const refreshPatient = useCallback(async () => {
    const data = await fetcher<any>(`/patients/${id}`);
    applyPatientData(data);
  }, [id, applyPatientData]);

  useEffect(() => {
    async function init() {
      try {
        setLoading(true);

        const [patientData, procedures] = await Promise.all([
          fetcher<any>(`/patients/${id}`),
          fetcher<ProcedureCatalogItem[]>("/procedures").catch(() => []),
        ]);

        applyPatientData(patientData);
        setProcedureCatalog(Array.isArray(procedures) ? procedures : []);
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
        <p className="text-sm font-medium text-muted-foreground">
          Carregando prontuário...
        </p>
      </div>
    );
  }

  if (!patient) {
    return (
      <div className="p-12 text-center space-y-4 bg-card rounded-2xl border border-border/60 max-w-md mx-auto mt-10">
        <div className="w-12 h-12 rounded-full bg-muted flex items-center justify-center mx-auto text-muted-foreground">
          <UserX className="w-6 h-6" />
        </div>
        <p className="text-base font-semibold text-foreground">
          Paciente não encontrado.
        </p>
        <Button variant="outline" size="sm" onClick={() => router.back()}>
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

      {/* TABS RESTRUTURADAS E ESTILIZADAS */}
      <div className="w-full overflow-x-auto [ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden py-1">
        <nav className="inline-flex items-center gap-1.5 p-1.5 bg-muted/60 backdrop-blur-sm rounded-xl border border-border/50 min-w-full sm:min-w-0">
          {TABS.map(({ id: tabId, label, icon: Icon }) => {
            const isActive = activeTab === tabId;
            return (
              <button
                key={tabId}
                onClick={() => setActiveTab(tabId)}
                className={`flex items-center gap-2 px-3.5 py-2 rounded-lg text-xs font-semibold transition-all duration-150 cursor-pointer whitespace-nowrap select-none ${
                  isActive
                    ? "bg-background text-foreground shadow-xs ring-1 ring-border/80"
                    : "text-muted-foreground hover:text-foreground hover:bg-background/50 ring-1 ring-transparent"
                }`}
              >
                <Icon
                  className={`w-3.5 h-3.5 transition-colors ${
                    isActive ? "text-primary" : "text-muted-foreground/80"
                  }`}
                />
                {label}
              </button>
            );
          })}
        </nav>
      </div>

      {/* Conteúdo da Tab */}
      <div className="bg-card rounded-2xl border border-border/60 shadow-xs min-h-[400px]">
        {activeTab === "overview" && (
          <PatientOverview
            patient={patient}
            onTabChange={setActiveTab}
            onNewAppointment={() => setIsNewAppointmentOpen(true)}
          />
        )}

        {activeTab === "anamnesis" && (
          <PatientAnamnesis
            patient={patient}
            patientId={id}
            onRefresh={refreshPatient}
          />
        )}

        {activeTab === "procedures" && (
          <PatientProcedures
            patient={patient}
            procedureCatalog={procedureCatalog}
            onNewAppointment={() => setIsNewAppointmentOpen(true)}
            onRefresh={refreshPatient}
          />
        )}

        {activeTab === "photos" && <PatientPhotos patient={patient} />}

        {activeTab === "quotes" && <PatientQuotes patient={patient} />}

        {activeTab === "appointments" && (
          <PatientAppointments
            patient={patient}
            onNewAppointment={() => setIsNewAppointmentOpen(true)}
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
          setActiveTab("appointments");
        }}
      />
    </div>
  );
}
