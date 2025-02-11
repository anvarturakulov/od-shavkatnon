import { Type } from 'class-transformer';
import { IsString, IsEnum, IsOptional, IsBoolean, IsNumber, IsDateString, IsArray, ValidateNested } from 'class-validator';
import { DocumentType } from '../../interfaces/document.interface';

class DocTableItemDto {
  @IsString()
  referenceId: string;
  
  @IsNumber()
  count: number;
  
  @IsNumber()
  price: number;
  
  @IsNumber()
  total: number;

  @IsString()
  comment: string;
}

export class CreateDocumentDto {
  @IsNumber()
  date: number;

  @IsNumber()
  docNumber: number

  @IsEnum(DocumentType)
  documentType: DocumentType;

  @IsOptional()
  @IsBoolean()
  deleted: boolean = false;

  @IsString()
  user: string

  @IsString()
  senderId: string

  @IsString()
  receiverId: string

  @IsBoolean()
  isWorker: boolean

  @IsBoolean()
  isPartner: boolean

  @IsBoolean()
  isFounder: boolean

  @IsBoolean()
  isCash: boolean

  @IsString()
  analiticId: string

  @IsNumber()
  count: number

  @IsNumber()
  price: number

  @IsNumber()
  total: number

  @IsNumber()
  cashFromPartner: number

  @IsString()
  @IsOptional()
  comment?: string

  @IsBoolean()
  proveden?: boolean

  @IsString()
  @IsOptional()
  firstWorkerId?: string

  @IsString()
  @IsOptional()
  secondWorkerId?: string

  @IsString()
  @IsOptional()
  thirdWorkerId?: string

  @IsOptional()
  @IsArray()
  @Type(() => DocTableItemDto)
  tableItems?: DocTableItemDto[];
}