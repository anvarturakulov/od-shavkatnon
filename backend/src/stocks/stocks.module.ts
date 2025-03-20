import { Module } from '@nestjs/common';
import { StocksService } from './stocks.service';
import { StocksController } from './stocks.controller';
import { SequelizeModule } from '@nestjs/sequelize';
import { Stock } from './stock.model';

@Module({
  providers: [StocksService],
  controllers: [StocksController],
  exports: [StocksService],
  imports: [
    SequelizeModule.forFeature([Stock]),
  ],
})
export class StocksModule {}
