import {
  IsNotEmpty,
  IsString,
  IsOptional,
  IsEmail,
  IsDateString,
} from 'class-validator';

export class CreatePatientsDto {
  @IsString()
  @IsNotEmpty({ message: 'O nome do paciente é obrigatório' })
  name!: string;

  @IsString()
  @IsNotEmpty({ message: 'O telefone do paciente é obrigatório' })
  phone!: string;

  @IsOptional()
  @IsString()
  cpf?: string;

  @IsOptional()
  @IsEmail({}, { message: 'E-mail inválido' })
  email?: string;

  @IsOptional()
  @IsDateString({}, { message: 'Data de nascimento inválida' })
  birthDate?: string;

  @IsOptional()
  @IsString()
  address?: string;
}