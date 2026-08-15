import { CalendarDays, CheckCircle2, Clock3, XCircle } from "lucide-react";

interface AgendaStatsProps {
  total: number;
  confirmed: number;
  scheduled: number;
  cancelled: number;
}

export function AgendaStats({
  total,
  confirmed,
  scheduled,
  cancelled,
}: AgendaStatsProps) {
  const items = [
    {
      label: "Total",
      value: total,
      icon: CalendarDays,
    },
    {
      label: "Confirmados",
      value: confirmed,
      icon: CheckCircle2,
    },
    {
      label: "Agendados",
      value: scheduled,
      icon: Clock3,
    },
    {
      label: "Cancelados",
      value: cancelled,
      icon: XCircle,
    },
  ];

  return (
    <div className="grid grid-cols-4 gap-4">
      {items.map((item) => {
        const Icon = item.icon;

        return (
          <div
            key={item.label}
            className="rounded-xl border bg-card p-4 shadow-sm"
          >
            <div className="flex items-center justify-between">
              <span className="text-sm text-muted-foreground">
                {item.label}
              </span>

              <Icon className="h-4 w-4 text-muted-foreground" />
            </div>

            <p className="mt-2 text-2xl font-bold">{item.value}</p>
          </div>
        );
      })}
    </div>
  );
}
