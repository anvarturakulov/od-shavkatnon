import { forwardRef, Module } from '@nestjs/common';
import { ReportsController } from './reports.controller';
import { ReportsService } from './reports.service';
import { SequelizeModule } from '@nestjs/sequelize';
import { User } from 'src/users/users.model';
import { Reference } from 'src/references/reference.model';
import { AuthModule } from 'src/auth/auth.module';
import { Entry } from 'src/entries/entry.model';
import { UsersModule } from 'src/users/users.module';
import { ReferencesModule } from 'src/references/references.module';
import { DocumentsModule } from 'src/documents/documents.module';
import { EntriesModule } from 'src/entries/entries.module';
import { StocksModule } from 'src/stocks/stocks.module';
import { OborotsModule } from 'src/oborots/oborots.module';
import { Document } from 'src/documents/document.model';
import { DocTableItems } from 'src/docTableItems/docTableItems.model';
import { DocValues } from 'src/docValues/docValues.model';

@Module({
  controllers: [ReportsController],
  imports: [
        SequelizeModule.forFeature([User, Reference,Entry, Document, DocTableItems, DocValues]),
        forwardRef(() => AuthModule),
        UsersModule,
        ReferencesModule,
        EntriesModule,
        StocksModule,
        OborotsModule,
        DocumentsModule
      ],
  providers: [ReportsService],
  exports: [ReportsService]
})
export class ReportsModule {}
