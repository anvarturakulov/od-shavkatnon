import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { AuthModule } from 'src/auth/auth.module';
import { ReferenceModule } from 'src/reference/reference.module';
import { HamirController } from './hamir.controller';
import { HamirService } from './hamir.service';
import { Hamir, HamirSchema } from './models/hamir.model';
import { DocumentModule } from 'src/document/document.module';

@Module({
  controllers: [HamirController],
  providers: [HamirService],
  imports: [
    MongooseModule.forFeature([{ name: Hamir.name, schema: HamirSchema }]),
    AuthModule,
    ReferenceModule,
    DocumentModule
  ],
  exports: [HamirService, MongooseModule]
})
export class HamirModule { }
