import {
  IsString,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  Min,
  Max,
  IsInt,
} from 'class-validator';

export class CreateProcedureDto {
  @IsString()
  @IsNotEmpty({ message: 'O nome do procedimento é obrigatório' })
  name!: string;

  @IsString()
  @IsOptional()
  description?: string;

  @IsNumber({}, { message: 'O preço deve ser um número válido' })
  @Min(0, { message: 'O preço não pode ser negativo' })
  price!: number;

  @IsInt({ message: 'A duração deve ser um número inteiro de minutos' })
  @Min(1, { message: 'A duração deve ter pelo menos 1 minuto' })
  @Max(1440, {
    message: 'A duração não pode ultrapassar 1440 minutos',
  })
  durationMinutes!: number;

  @IsOptional()
  @IsInt({
    message: 'O intervalo de retorno deve ser um número inteiro de meses',
  })
  @Min(1, {
    message: 'O intervalo de retorno deve ser de pelo menos 1 mês',
  })
  recommendedMonths?: number;
}