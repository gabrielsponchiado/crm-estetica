import { AgendaPage } from "@/components/agenda/AgendaPage";

export default function Page() {
  return (
    <div className="flex flex-col flex-1 h-full h-[calc(100vh-80px)]">
      <AgendaPage />
    </div>
  );
}
