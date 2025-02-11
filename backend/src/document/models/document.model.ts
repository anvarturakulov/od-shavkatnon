import { Schema, Prop, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument, Schema as MSchema, Types } from 'mongoose';
import { DocumentType } from '../../interfaces/document.interface';

export type DocDocument = HydratedDocument<Document>;

export class DocTableItem {
  @Prop()
  referenceId: Types.ObjectId;
  
  @Prop()
  count: number;

  @Prop()
  price: number;
  
  @Prop()
  total: number;

}

@Schema()
export class Document {
  @Prop({ required: true })
  date: number;

  @Prop()
  docNumber: number

  @Prop({ enum: DocumentType })
  documentType: DocumentType

  @Prop()
  deleted?: boolean

  @Prop()
  user: string

  @Prop()
  senderId: Types.ObjectId

  @Prop()
  receiverId: Types.ObjectId

  @Prop()
  isWorker: boolean

  @Prop()
  isPartner: boolean

  @Prop()
  isFounder: boolean

  @Prop()
  isCash: boolean

  @Prop()
  analiticId: Types.ObjectId

  @Prop()
  count: number

  @Prop()
  price: number

  @Prop()
  total: number

  @Prop()
  cashFromPartner: number

  @Prop()
  comment?: string

  @Prop()
  proveden?: boolean

  @Prop()
  firstWorkerId: Types.ObjectId

  @Prop()
  secondWorkerId: Types.ObjectId

  @Prop()
  thirdWorkerId: Types.ObjectId

  @Prop({ type: () => [DocTableItem], _id: false })
  tableItems?: DocTableItem[];

}

export const DocumentSchema = SchemaFactory.createForClass(Document);
