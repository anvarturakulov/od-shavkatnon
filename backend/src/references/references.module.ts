import { forwardRef, Module } from '@nestjs/common';
import { SequelizeModule } from '@nestjs/sequelize';
import { ReferencesController } from './references.controller';
import { ReferencesService } from './references.service';
import { Reference } from './reference.model';
import { RefValues } from 'src/refvalues/refValues.model';
import { DocValue } from 'src/docValues/docValue.model';
import { User } from 'src/users/users.model';
import { AuthModule } from 'src/auth/auth.module';
import { UsersModule } from 'src/users/users.module';

@Module({
  controllers: [ReferencesController],
  providers: [ReferencesService],
  imports: [
    SequelizeModule.forFeature([User, Reference, RefValues, DocValue]),
    forwardRef(() => AuthModule),
    UsersModule
  ],
})
export class ReferencesModule {}
