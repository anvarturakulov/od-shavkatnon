import { Module } from '@nestjs/common';
import { SequelizeModule } from '@nestjs/sequelize';
import { ReferencesController } from './references.controller';
import { ReferencesService } from './references.service';
import { Reference } from './references.model';
import { RefValues } from 'src/refvalues/refValues.model';
import { DocValue } from 'src/docValues/docValue.model';
import { User } from 'src/users/users.model';

@Module({
  controllers: [ReferencesController],
  providers: [ReferencesService],
  imports: [
    SequelizeModule.forFeature([Reference, RefValues, DocValue, User]),
  ],
})
export class ReferencesModule {}
