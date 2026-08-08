import { IsString, IsNotEmpty, IsNumber, IsOptional, Min, Max } from 'class-validator';

export class CreateProcedureDto {
  @IsString()
  @IsNotEmpty({ message: 'O nome do procedimento é obrigatório' })
  name: string;

  @IsString()
  @IsOptional()
  description?: string;

  @IsNumber({}, { message: 'O preço deve ser um número válido' })
  @Min(0, { message: 'O preço não pode ser negativo' })
  @Max(999999.99, { message: 'O preço máximo permitido é R$ 999.999,99' })
  price: number;

  @IsNumber({}, { message: 'A duração deve ser um número de minutos' })
  @Min(1, { message: 'A duração deve ter pelo menos 1 minuto' })
  durationMinutes: number;

  @IsNumber()
  @IsOptional()
  recommendedMonths?: number;
}