import { IsBoolean, IsNumber, IsOptional, IsString } from 'class-validator';

export class ReportOptionsDto {
  @IsNumber()
  startDate: number;

  @IsNumber()
  endDate: number;

  @IsString()
  firstReferenceId: string;

  @IsOptional()
  @IsString()
  secondReferenceId?: string;

  @IsOptional()
  @IsBoolean()
  showReport: boolean;

}

