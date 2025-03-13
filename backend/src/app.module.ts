import { Module } from '@nestjs/common';
import { SequelizeModule } from '@nestjs/sequelize';
import { UsersModule } from './users/users.module';
import { ConfigModule } from '@nestjs/config';
import { User } from './users/users.model';
import { AuthModule } from './auth/auth.module';
import { FilesService } from './files/files.service';
import { FilesModule } from './files/files.module';
import { ReferencesModule } from './references/references.module';
import { Reference } from './references/reference.model';
import { RefValues } from './refvalues/refValues.model';
import { DocumentsModule } from './documents/documents.module';
import { DocTableItemsModule } from './docTableItems/docTableItems.module';
import { DocValuesController } from './docValues/docValues.controller';
import { DocValuesService } from './docValues/docValues.service';
import { RefValesModule } from './refvalues/refValues.module';
import { DocValuesModule } from './docValues/docValues.module';
import { EntriesModule } from './entries/entries.module';
import { Entry } from './entries/entry.model';
import { DocValues } from './docValues/docValues.model';
import { Document } from './documents/document.model';
import { DocTableItems } from './docTableItems/docTableItems.model';
import { ReportsModule } from './reports/reports.module';



@Module({
    controllers: [],
    providers: [FilesService],
    imports: [
        ConfigModule.forRoot({
            envFilePath: `.${process.env.NODE_ENV}.env`
        }),
        SequelizeModule.forRoot({
            dialect: 'postgres',
            host: process.env.POSTGRES_HOST,
            port: Number(process.env.POSTGRES_PORT),
            username: process.env.POSTGRES_USER,
            password: process.env.POSTGRES_PASSWORD,
            database: process.env.POSTGRES_DB,
            models: [User, Reference, RefValues, Entry, DocValues, DocTableItems, Document],
            autoLoadModels: true,
          }),
        UsersModule,
        AuthModule,
        FilesModule,
        ReferencesModule,
        RefValesModule,
        DocumentsModule,
        DocValuesModule,
        DocTableItemsModule,
        EntriesModule,
        ReportsModule,
    ],
})

export class AppModule {}