import { IsNotEmpty, IsNumber, IsObject, Min } from 'class-validator';

export class CreateQuoteDto {
  @IsNotEmpty()
  @IsNumber()
  @Min(0)
  totalValue!: number;

  @IsObject()
  details!: object;
}