import { forwardRef, Module } from '@nestjs/common';
import { ReportsController } from './reports.controller';
import { ReportsService } from './reports.service';
import { SequelizeModule } from '@nestjs/sequelize';
import { User } from 'src/users/users.model';
import { Reference } from 'src/references/reference.model';
import { AuthModule } from 'src/auth/auth.module';
import { DocTableItems } from 'src/docTableItems/docTableItems.model';
import { DocValues } from 'src/docValues/docValues.model';
import { Entry } from 'src/entries/entry.model';
import { UsersModule } from 'src/users/users.module';

@Module({
  controllers: [ReportsController],
  imports: [
        SequelizeModule.forFeature([User, Reference, Document, DocTableItems, DocValues, Entry]),
        forwardRef(() => AuthModule),
        UsersModule
      ],
  providers: [ReportsService]
})
export class ReportsModule {}
