import { Module } from '@nestjs/common';
import { DocumentsService } from './documents.service';
import { DocumentsController } from './documents.controller';
import { SequelizeModule } from '@nestjs/sequelize';
import { Reference } from 'src/references/references.model';
import { User } from 'src/users/users.model';
import { DocValue } from 'src/docValues/docValue.model';
import { DocTableItem } from 'src/docTableItems/docTableItem.model';
import { Entry } from 'src/entries/entry.model';
import { Document } from './document.model';

@Module({
  providers: [DocumentsService],
  controllers: [DocumentsController],
  imports: [
      SequelizeModule.forFeature([User, Reference, Document, DocTableItem, DocValue, Entry])
    ],
  exports: [DocumentsService]
})
export class DocumentsModule {}
