import { Module } from '@nestjs/common';
import { SequelizeModule } from '@nestjs/sequelize';
import { UsersModule } from './users/users.module';
import { ConfigModule } from '@nestjs/config';
import { User } from './users/users.model';
import { AuthModule } from './auth/auth.module';
import { FilesService } from './files/files.service';
import { FilesModule } from './files/files.module';
import { ReferencesModule } from './references/references.module';
import { Reference } from './references/references.model';
import { RefValue } from './refvales/refValue.model';
import { DocumentsModule } from './documents/documents.module';
import { DocTableItemsModule } from './docTableItems/docTableItems.module';
import { DocValuesController } from './docValues/docValues.controller';
import { DocValuesService } from './docValues/docValues.service';
import { RefValesModule } from './refvales/refVales.module';
import { DocValuesModule } from './docValues/docValues.module';


@Module({
    controllers: [DocValuesController],
    providers: [FilesService, DocValuesService],
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
            models: [User, Reference, RefValue],
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
    ]
})

export class AppModule {}