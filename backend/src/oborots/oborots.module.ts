import { Module } from '@nestjs/common';
import { OborotsController } from './oborots.controller';
import { OborotsService } from './oborots.service';
import { Oborot } from './oborot.model';
import { SequelizeModule } from '@nestjs/sequelize';

@Module({
  controllers: [OborotsController],
  providers: [OborotsService],
  exports: [OborotsService],
    imports: [
      SequelizeModule.forFeature([Oborot]),
    ],
})
export class OborotsModule {}
