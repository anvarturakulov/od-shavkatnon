import { Module } from '@nestjs/common';
import { SequelizeModule } from '@nestjs/sequelize';
import { ReferencesController } from './references.controller';
import { ReferencesService } from './references.service';
import { Reference } from './references.model';
import { RefValue } from 'src/refvales/refValue.model';
import { DocValue } from 'src/docValues/docValue.model';

@Module({
  controllers: [ReferencesController],
  providers: [ReferencesService],
  imports: [
    SequelizeModule.forFeature([Reference, RefValue, DocValue]),
  ],
})
export class ReferencesModule {}
