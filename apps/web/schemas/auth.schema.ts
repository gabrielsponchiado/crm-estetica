import { z } from 'zod';

export const loginSchema = z.object({
  email: z
    .string()
    .min(1, 'O e-mail é obrigatório')
    .email('Digite um e-mail válido'),

  password: z
    .string()
    .min(1, 'A senha é obrigatória'),
});

export const registerSchema = z
  .object({
    name: z
      .string()
      .min(2, 'O nome deve ter pelo menos 2 caracteres'),

    email: z
      .string()
      .min(1, 'O e-mail é obrigatório')
      .email('Digite um e-mail válido'),

    password: z
      .string()
      .min(8, 'A senha deve ter pelo menos 8 caracteres'),

    confirmPassword: z
      .string()
      .min(1, 'Confirme sua senha'),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: 'As senhas não coincidem',
    path: ['confirmPassword'],
  });

export type LoginInput = z.infer<typeof loginSchema>;
export type RegisterInput = z.infer<typeof registerSchema>;