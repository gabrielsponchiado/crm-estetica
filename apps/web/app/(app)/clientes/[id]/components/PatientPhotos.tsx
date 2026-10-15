'use client';

import { Calendar, Image, Plus } from 'lucide-react';

import { Button } from '@/components/ui/button';

type PatientPhotosProps = {
  patient: any;
};

export function PatientPhotos({
  patient,
}: PatientPhotosProps) {
  return (
    <div className="p-6">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h3 className="text-base font-semibold text-foreground">
            Fotos Antes & Depois
          </h3>

          <p className="text-sm text-muted-foreground mt-0.5">
            Comparativo visual de sessões e evolução do tratamento.
          </p>
        </div>

        <Button
          size="sm"
          variant="outline"
          disabled
          className="gap-2 opacity-60"
        >
          <Plus className="w-4 h-4" />
          Nova Sessão

          <span className="text-[10px] bg-muted px-1.5 py-0.5 rounded-full">
            Em breve
          </span>
        </Button>
      </div>

      {patient.evaluations?.length > 0 ? (
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {patient.evaluations.map((ev: any) => (
            <div
              key={ev.id}
              className="border rounded-xl overflow-hidden bg-background"
            >
              <div className="p-4 border-b">
                <p className="font-semibold text-sm text-foreground truncate">
                  {ev.title || 'Avaliação'}
                </p>

                <p className="text-xs text-muted-foreground flex items-center gap-1 mt-1">
                  <Calendar className="w-3 h-3" />

                  {new Date(
                    ev.createdAt,
                  ).toLocaleDateString('pt-BR')}
                </p>
              </div>

              <div className="grid grid-cols-2 gap-px bg-border">
                {['before', 'after'].map((type) => {
                  const photos =
                    type === 'before'
                      ? ev.beforePhotos
                      : ev.afterPhotos;

                  return (
                    <div
                      key={type}
                      className="aspect-square bg-muted flex flex-col items-center justify-center text-xs text-muted-foreground"
                    >
                      {photos?.[0] ? (
                        <img
                          src={photos[0]}
                          className="w-full h-full object-cover"
                          alt={
                            type === 'before'
                              ? 'Antes'
                              : 'Depois'
                          }
                        />
                      ) : (
                        <>
                          <Image className="w-5 h-5 mb-1 opacity-30" />

                          <span className="opacity-60 text-[11px]">
                            {type === 'before'
                              ? 'Antes'
                              : 'Depois'}
                          </span>
                        </>
                      )}
                    </div>
                  );
                })}
              </div>

              {ev.notes && (
                <div className="p-3 text-xs text-muted-foreground border-t">
                  <p className="line-clamp-2">
                    {ev.notes}
                  </p>
                </div>
              )}
            </div>
          ))}
        </div>
      ) : (
        <div className="text-center py-16 text-muted-foreground border border-dashed rounded-xl bg-muted/20">
          <Image className="w-10 h-10 mx-auto mb-3 opacity-40" />

          <p className="font-medium">
            Nenhuma sessão de fotos registrada
          </p>

          <p className="text-xs mt-1 opacity-70">
            Disponível em breve
          </p>
        </div>
      )}
    </div>
  );
}