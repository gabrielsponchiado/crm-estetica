import { IsNotEmpty, IsString, IsOptional, IsEmail } from 'class-validator';

export class CreatePatientsDto {
  @IsString()
  @IsNotEmpty({ message: 'O nome do paciente é obrigatório' })
  name: string;

  @IsString()
  @IsNotEmpty({ message: 'O telefone do paciente é obrigatório' })
  phone: string;

  @IsOptional()
  @IsString()
  cpf?: string;

  @IsOptional()
  @IsEmail({}, { message: 'E-mail inválido' })
  email?: string;

  @IsOptional()
  @IsString()
  birthDate?: string;

  @IsOptional()
  @IsString()
  address?: string;
}