import { Module } from '@nestjs/common';
import { ReferenceController } from './reference.controller';
import { ReferenceService } from './reference.service';
import { MongooseModule } from '@nestjs/mongoose';
import { Reference, ReferenceSchema } from './models/referense.model';

@Module({
  controllers: [ReferenceController],
  providers: [ReferenceService],
  imports: [MongooseModule.forFeature([{ name: Reference.name, schema: ReferenceSchema }])],
  exports: [ReferenceService]
})
export class ReferenceModule {}
