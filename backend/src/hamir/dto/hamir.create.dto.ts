import { IsString, IsBoolean, IsNumber, IsOptional } from 'class-validator';

export class CreateHamirDto {
  @IsNumber()
  date: number;
  
  @IsOptional()
  @IsNumber()
  order?: number;

  @IsString()
  user: string

  @IsString()
  sectionId: string

  @IsString()
  analiticId: string

  @IsBoolean()
  proveden: boolean = false

  @IsOptional()
  @IsString()
  firstWorker: string

  @IsOptional()
  @IsString()
  secondWorker: string

  @IsOptional()
  @IsString()
  thirdWorker: string

  @IsOptional()
  @IsString()
  zuvala: number


  @IsBoolean()
  fromHamirchi: boolean

}