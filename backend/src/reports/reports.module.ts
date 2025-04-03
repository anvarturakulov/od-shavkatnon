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
import { Stock } from 'src/stocks/stock.model';
import { StocksModule } from 'src/stocks/stocks.module';
import { OborotsModule } from 'src/oborots/oborots.module';

@Module({
  controllers: [ReportsController],
  imports: [
        SequelizeModule.forFeature([User, Reference,Entry]),
        forwardRef(() => AuthModule),
        UsersModule,
        ReferencesModule,
        DocumentsModule,
        EntriesModule,
        StocksModule,
        OborotsModule
      ],
  providers: [ReportsService]
})
export class ReportsModule {}
