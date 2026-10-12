import {
  IsNotEmpty,
  IsString,
  IsNumber,
  IsOptional,
  IsDateString,
  IsInt,
  Min,
  Max,
} from 'class-validator';

export class CreateAgendaDto {
  @IsNotEmpty({ message: 'O paciente é obrigatório' })
  @IsString()
  patientId!: string;

  @IsNotEmpty({ message: 'O procedimento é obrigatório' })
  @IsString()
  procedureId!: string;

  @IsNotEmpty({ message: 'A data do agendamento é obrigatória' })
  @IsDateString({}, { message: 'Formato de data inválido' })
  date!: string;

  @IsNotEmpty({ message: 'A duração é obrigatória' })
  @IsInt({ message: 'A duração deve ser um número inteiro de minutos' })
  @Min(1, { message: 'A duração deve ser de pelo menos 1 minuto' })
  @Max(1440, {
    message: 'A duração não pode ultrapassar 1440 minutos',
  })
  duration!: number;

  @IsOptional()
  @IsString()
  notes?: string;
}
