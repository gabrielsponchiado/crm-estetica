/**
 * Valida um CPF usando o algoritmo oficial dos dígitos verificadores.
 * Aceita CPF com ou sem máscara.
 */
export function isValidCpf(cpf: string): boolean {
  const digits = cpf.replace(/\D/g, "");

  if (digits.length !== 11) return false;

  // Descarta CPFs com todos os dígitos iguais (ex: 111.111.111-11)
  if (/^(\d)\1+$/.test(digits)) return false;

  // Valida 1º dígito verificador
  let sum = 0;
  for (let i = 0; i < 9; i++) {
    sum += Number(digits.charAt(i)) * (10 - i);
  }
  let remainder = (sum * 10) % 11;
  if (remainder === 10 || remainder === 11) remainder = 0;
  if (remainder !== Number(digits.charAt(9))) return false;

  // Valida 2º dígito verificador
  sum = 0;
  for (let i = 0; i < 10; i++) {
    sum += Number(digits.charAt(i)) * (11 - i);
  }
  remainder = (sum * 10) % 11;
  if (remainder === 10 || remainder === 11) remainder = 0;
  if (remainder !== Number(digits.charAt(10))) return false;

  return true;
}

/**
 * Valida um número de telefone brasileiro.
 * Aceita formatos: (11) 99999-9999, 11999999999, etc.
 * Retorna true para 10 ou 11 dígitos.
 */
export function isValidPhone(phone: string): boolean {
  const digits = phone.replace(/\D/g, "");
  return digits.length === 10 || digits.length === 11;
}

/**
 * Valida formato de e-mail básico.
 */
export function isValidEmail(email: string): boolean {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim());
}
