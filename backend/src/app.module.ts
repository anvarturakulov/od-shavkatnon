import { Module } from '@nestjs/common';
import { SequelizeModule } from '@nestjs/sequelize';
import { UsersModule } from './users/users.module';
import { ConfigModule } from '@nestjs/config';
import { User } from './users/users.model';
import { AuthModule } from './auth/auth.module';
import { PostsController } from './posts/posts.controller';
import { PostsModule } from './posts/posts.module';
import { Post } from './posts/post.model';
import { FilesService } from './files/files.service';
import { FilesModule } from './files/files.module';

@Module({
    controllers: [PostsController],
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
            models: [User, Post],
            autoLoadModels: true

          }),
        UsersModule,
        AuthModule,
        PostsModule,
        FilesModule,
    ]
})

export class AppModule {}