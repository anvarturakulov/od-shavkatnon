import { Module } from '@nestjs/common';
import { DocTableItemsController } from './docTableItems.controller';
import { DocTableItemsService } from './docTableItems.service';
import { SequelizeModule } from '@nestjs/sequelize';
import { DocTableItem } from './docTableItem.model';
import { Reference } from 'src/references/reference.model';
import { Document } from 'src/documents/document.model';

@Module({
  controllers: [DocTableItemsController],
  providers: [DocTableItemsService],
  imports: [
    SequelizeModule.forFeature([DocTableItem, Reference, Document])
  ],
  exports: [DocTableItemsService]
})
export class DocTableItemsModule {}
