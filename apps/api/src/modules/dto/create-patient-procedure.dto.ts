import {
  IsDateString,
  IsNotEmpty,
  IsOptional,
  IsString,
} from 'class-validator';

export class CreatePatientProcedureDto {
  @IsString()
  @IsNotEmpty({ message: 'O procedimento é obrigatório' })
  procedureId!: string;

  @IsDateString({}, { message: 'A data de realização é inválida' })
  performedAt!: string;

  @IsOptional()
  @IsDateString({}, { message: 'A data de retorno é inválida' })
  nextReturnAt?: string;
}