import { forwardRef, Module } from '@nestjs/common';
import { UsersController } from './users.controller';
import { UsersService } from './users.service';
import { SequelizeModule } from '@nestjs/sequelize';
import { User } from './users.model';
import { AuthModule } from 'src/auth/auth.module';
import { Reference } from 'src/references/reference.model';
import { Document } from 'src/documents/document.model';


@Module({
  controllers: [UsersController],
  providers: [UsersService],
  imports: [
    SequelizeModule.forFeature([User, Reference, Document]),
    forwardRef(() => AuthModule),
  ],
  exports: [UsersService]
})
export class UsersModule {}
