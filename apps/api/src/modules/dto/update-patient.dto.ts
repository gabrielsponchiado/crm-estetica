import { PartialType } from '@nestjs/mapped-types';
import { CreatePatientsDto } from './create-patient.dto';
import { IsOptional } from 'class-validator';

export class UpdatePatientsDto extends PartialType(CreatePatientsDto) {
  @IsOptional()
  anamnesis?: Record<string, string | null>;
}