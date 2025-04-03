import { forwardRef, Module } from '@nestjs/common';
import { DocumentsService } from './documents.service';
import { ConfigModule } from '@nestjs/config';
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
import { Stock } from 'src/stocks/stock.model';
import { StocksModule } from 'src/stocks/stocks.module';
import { OborotsModule } from 'src/oborots/oborots.module';

@Module({
  controllers: [DocumentsController],
  providers: [ DocumentsService],
  imports: [
    ConfigModule.forRoot(),  
    SequelizeModule.forFeature([User, Reference, Document, DocTableItems, DocValues, Entry, Stock]),
      forwardRef(() => AuthModule),
      UsersModule,
      ReferencesModule,
      StocksModule,
      OborotsModule
    ],
  exports: [DocumentsService]
})
export class DocumentsModule {}
