import { PartialType } from '@nestjs/mapped-types';
import { CreatePatientsDto } from './create-patient.dto';

export class UpdatePatientsDto extends PartialType(CreatePatientsDto) {}