"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { IconLayoutDashboard } from "@tabler/icons-react";
import { Calendar, Users, Cake, RotateCcw } from "lucide-react";

export default function DashboardPage() {
  return (
    <div className="space-y-6">
      {/* Cabeçalho */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2 border-b">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-foreground flex items-center gap-2">
            <IconLayoutDashboard className="w-6 h-6 text-primary animate-pulse" />
            Dashboard
          </h1>
          <p className="text-sm text-muted-foreground">
          Visão geral dos atendimentos e métricas da clínica.
        </p>
        </div>
    </div>
      {/* Grid de Cards KPI */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {/* Card 1: Agendamentos de Hoje */}
        <Card className="border-border/60 shadow-xs">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-1">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Agendamentos Hoje
            </CardTitle>
            <div className="w-10 h-10 flex items-center justify-center bg-rose-100 dark:bg-rose-950/60 rounded-xl text-rose-600">
              <Calendar className="w-5 h-5" />
            </div>
          </CardHeader>
          <CardContent className="pt-0">
            <div className="text-3xl font-bold text-foreground">12</div>
            <p className="text-xs text-muted-foreground mt-1">
              <span className="text-emerald-600 font-medium">8 confirmados</span> para hoje
            </p>
          </CardContent>
        </Card>

        {/* Card 2: Pacientes Totais */}
        <Card className="border-border/60 shadow-xs">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-1">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Total de Pacientes
            </CardTitle>
            <div className="w-10 h-10 flex items-center justify-center bg-blue-100 dark:bg-blue-950/60 rounded-xl text-blue-600">
              <Users className="w-5 h-5" />
            </div>
          </CardHeader>
          <CardContent className="pt-0">
            <div className="text-3xl font-bold text-foreground">458</div>
            <p className="text-xs text-muted-foreground mt-1">
              <span className="text-emerald-600 font-medium">+14</span> este mês
            </p>
          </CardContent>
        </Card>

        {/* Card 3: Aniversariantes do Mês */}
        <Card className="border-border/60 shadow-xs">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-1">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Aniversariantes
            </CardTitle>
            <div className="w-10 h-10 flex items-center justify-center bg-amber-100 dark:bg-amber-950/60 rounded-xl text-amber-600">
              <Cake className="w-5 h-5" />
            </div>
          </CardHeader>
          <CardContent className="pt-0">
            <div className="text-3xl font-bold text-foreground">18</div>
            <p className="text-xs text-muted-foreground mt-1">
              Em <span className="font-medium text-foreground">Agosto</span>
            </p>
          </CardContent>
        </Card>

        {/* Card 4: Clientes sem retorno */}
        <Card className="border-border/60 shadow-xs">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-1">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Aguardando Retorno
            </CardTitle>
            <div className="w-10 h-10 flex items-center justify-center bg-purple-100 dark:bg-purple-950/60 rounded-xl text-purple-600">
              <RotateCcw className="w-5 h-5" />
            </div>
          </CardHeader>
          <CardContent className="pt-0">
            <div className="text-3xl font-bold text-foreground">32</div>
            <p className="text-xs text-muted-foreground mt-1">
              Sem consulta há +60 dias
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}