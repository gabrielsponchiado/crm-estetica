import { useState } from 'react';

export interface CreateProcedureDTO {
  name: string;
  durationMinutes: number;
  price: number;
  description?: string;
  recommendedMonths?: number;
}

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3333/api';

export function useCreateProcedure(onSuccess?: () => void) {
  const [isSubmitting, setIsSubmitting] = useState(false);

  const createProcedure = async (data: CreateProcedureDTO) => {
    try {
      setIsSubmitting(true);
      
      const res = await fetch(`${API_URL}/procedures`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });

      if (!res.ok) {
        throw new Error('Erro ao cadastrar procedimento.');
      }

      if (onSuccess) onSuccess();
      return true;
    } catch (error) {
      console.error(error);
      return false;
    } finally {
      setIsSubmitting(false);
    }
  };

  return {
    createProcedure,
    isSubmitting,
  };
}