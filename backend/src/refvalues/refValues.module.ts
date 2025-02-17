import { Module } from '@nestjs/common';
import { RefValuesService } from './refValues.service';
import { SequelizeModule } from '@nestjs/sequelize'
import { Reference } from 'src/references/references.model';
import { RefValues } from './refValues.model';
import { RefValesController } from './refValues.controller';

@Module({
  controllers: [RefValesController],
  providers: [RefValuesService],
  imports: [
    SequelizeModule.forFeature([Reference, RefValues]),
  ],
})
export class RefValesModule {}
