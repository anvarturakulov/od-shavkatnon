import { Module } from '@nestjs/common';
import { RefValesService } from './refVales.service';
import { SequelizeModule } from '@nestjs/sequelize'
import { Reference } from 'src/references/references.model';
import { RefValue } from './refValue.model';
import { RefValesController } from './refVales.controller';

@Module({
  controllers: [RefValesController],
  providers: [RefValesService],
  imports: [
    SequelizeModule.forFeature([Reference, RefValue]),
  ],
})
export class RefValesModule {}
