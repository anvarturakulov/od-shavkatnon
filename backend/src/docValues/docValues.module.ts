import { Module } from '@nestjs/common';
import { DocValuesController } from './docValues.controller';
import { DocValuesService } from './docValues.service';
import { Reference } from 'src/references/references.model';
import { SequelizeModule } from '@nestjs/sequelize';
import { DocValue } from './docValue.model';

@Module({
  controllers: [DocValuesController],
  providers: [DocValuesService],
  imports: [
    SequelizeModule.forFeature([Reference, DocValue]),
  ],
})
export class DocValuesModule {}
