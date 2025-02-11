import { Schema, Prop, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument, Types } from 'mongoose';
import { TypeReference, TypePartners, TypeTMZ } from '../../interfaces/reference.interface';

export type ReferenceDocument = HydratedDocument<Reference>;

@Schema()
export class Reference {
  @Prop({ required: true })
  name: string;

  @Prop()
  deleted?: boolean

  @Prop({ enum: TypeReference, required: true })
  typeReference: TypeReference

  @Prop({ enum: TypePartners })
  typePartners?: TypePartners

  @Prop({ enum: TypeTMZ })
  typeTMZ?: TypeTMZ

  @Prop()
  unit?: string;

  @Prop()
  comment?: string;

  @Prop()
  delivery?: boolean

  @Prop()
  filial?: boolean

  @Prop()
  umumBulim?: boolean

  @Prop()
  sklad?: boolean

  @Prop()
  buxgalter: boolean

  @Prop()
  un?: boolean

  @Prop()
  clientForDeliveryId?: Types.ObjectId

  @Prop()
  firstPrice?: number

  @Prop()
  secondPrice?: number
  
  @Prop()
  thirdPrice?: number

  @Prop()
  telegramId?: string

  @Prop()
  norma: number

  @Prop()
  longCharge?: boolean

  @Prop()
  director: boolean

  @Prop()
  shavkat: boolean

  @Prop()
  maxsud: boolean

}

export const ReferenceSchema = SchemaFactory.createForClass(Reference);