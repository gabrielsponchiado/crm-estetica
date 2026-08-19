import { IsNotEmpty, IsString, IsNumber, IsOptional, IsDateString } from 'class-validator';

export class CreateAgendaDto {
  @IsNotEmpty({ message: 'O paciente é obrigatório' })
  @IsString()
  patientId: string;

  @IsNotEmpty({ message: 'O procedimento é obrigatório' })
  @IsString()
  procedureId: string;

  @IsNotEmpty({ message: 'A data do agendamento é obrigatória' })
  @IsDateString({}, { message: 'Formato de data inválido' })
  date: string;

  @IsNotEmpty({ message: 'A duração é obrigatória' })
  @IsNumber({}, { message: 'A duração deve ser um número em minutos' })
  duration: number;

  @IsOptional()
  @IsString()
  notes?: string;
}