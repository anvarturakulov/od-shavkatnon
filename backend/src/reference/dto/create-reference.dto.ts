import { IsString, IsEnum, IsOptional, IsBoolean, IsNumber } from 'class-validator'
import { TypeReference, TypePartners, TypeTMZ } from '../../interfaces/reference.interface';

export class CreateReferenceDto {
  @IsString()
  name: string;

  @IsEnum(TypeReference)
  typeReference: TypeReference;

  @IsOptional()
  @IsEnum(TypePartners)
  typePartners?: TypePartners;

  @IsOptional()
  @IsEnum(TypeTMZ)
  typeTMZ?: TypeTMZ;

  @IsOptional()
  @IsString()
  unit?: string;

  @IsOptional()
  @IsBoolean()
  deleted?: boolean = false;

  @IsOptional()
  @IsString()
  comment?: string;
  
  @IsOptional()
  @IsBoolean()
  delivery?: boolean;

  @IsOptional()
  @IsBoolean()
  filial?: boolean;

  @IsOptional()
  @IsBoolean()
  sklad?: boolean;

  @IsOptional()
  @IsBoolean()
  buxgalter?: boolean;

  @IsOptional()
  @IsBoolean()
  umumBulim?: boolean;

  @IsOptional()
  @IsBoolean()
  un?: boolean;

  @IsOptional()
  @IsString()
  clientForDeliveryId: string  
  
  @IsOptional()
  @IsNumber()
  firstPrice?: number

  @IsOptional()
  @IsNumber()
  secondPrice?: number

  @IsOptional()
  @IsNumber()
  thirdPrice?: number

  @IsOptional()
  @IsString()
  telegramId?: string

  @IsOptional()
  @IsNumber()
  norma?: number

  @IsOptional()
  @IsBoolean()
  director?: boolean

  @IsOptional()
  @IsBoolean()
  shavkat?: boolean

  @IsOptional()
  @IsBoolean()
  maxsud?: boolean

}
