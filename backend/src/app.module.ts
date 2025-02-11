import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthModule } from './auth/auth.module';
import { ConfigModule } from '@nestjs/config';
import { MongooseModule } from '@nestjs/mongoose';
import { DocumentModule } from './document/document.module';
import { ReferenceModule } from './reference/reference.module';
import { ReportModule } from './report/report.module';
import { HamirModule } from './hamir/hamir.module';


@Module({
  imports: [
    ConfigModule.forRoot(),
    MongooseModule.forRoot('mongodb://127.0.0.1:27017/shavkatbase?directConnection=true&serverSelectionTimeoutMS=2000'),
    // MongooseModule.forRoot(
    //    'mongodb+srv://anvar:vqqaCNtEAjNUyUh5@cluster0.uoe1t.mongodb.net/',
    // ),
    AuthModule,
    DocumentModule,
    ReferenceModule,
    ReportModule,
    HamirModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
