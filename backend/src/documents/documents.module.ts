import { forwardRef, Module } from '@nestjs/common';
import { DocumentsService } from './documents.service';
import { DocumentsController } from './documents.controller';
import { Reference } from 'src/references/reference.model';
import { User } from 'src/users/users.model';
import { Entry } from 'src/entries/entry.model';
import { Document } from './document.model';
import { DocTableItems } from 'src/docTableItems/docTableItems.model';
import { DocValues } from 'src/docValues/docValues.model';
import { UsersModule } from 'src/users/users.module';
import { AuthModule } from 'src/auth/auth.module';
import { SequelizeModule } from '@nestjs/sequelize';
import { ReferencesModule } from 'src/references/references.module';

@Module({
  controllers: [DocumentsController],
  providers: [ DocumentsService],
  imports: [
      SequelizeModule.forFeature([User, Reference, Document, DocTableItems, DocValues, Entry]),
      forwardRef(() => AuthModule),
      UsersModule,
      ReferencesModule
    ],
  exports: [DocumentsService]
})
export class DocumentsModule {}
