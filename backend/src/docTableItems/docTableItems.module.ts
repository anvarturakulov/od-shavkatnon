import { Module } from '@nestjs/common';
import { DocTableItemsController } from './docTableItems.controller';
import { DocTableItemsService } from './docTableItems.service';

@Module({
  controllers: [DocTableItemsController],
  providers: [DocTableItemsService]
})
export class DocTableItemsModule {}
