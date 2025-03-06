import { Controller, Get, NotFoundException, Query, Req, UseGuards, UsePipes, ValidationPipe } from '@nestjs/common';
import { ReportsService } from './reports.service';
import { Roles } from 'src/auth/roles-auth.decorator';
import { RolesGuard } from 'src/auth/roles.guard';
import { QuerySimple } from 'src/interfaces/report.interface';
import { Request } from 'express';
import { requestTransform } from './querys/requestTransform';
import { REPORT_NOT_PREPARE } from './report.constants';
import { GetEntriesQueryDto } from './dto/entry-query.dto';

@Controller('reports')
export class ReportsController {

  constructor(private reportsService: ReportsService) {}
    
  // @ApiOperation({summary: 'Получение всех документов'})
  // @ApiResponse({status: 200, type: [Document]})
  @Roles('ALL')
  @UseGuards(RolesGuard)
  @Get('/query')
  @UsePipes(new ValidationPipe({ transform: true }))
  async getQuery(@Query() query: GetEntriesQueryDto) {
    const req: QuerySimple = {...requestTransform(query)}
    const report = await this.reportsService.getQueryValue(req);
    return report;

  }

  @Roles('ALL')
  @UseGuards(RolesGuard)
  @Get('/priceAndBalance')
  @UsePipes(new ValidationPipe({ transform: true }))
  async getPriceAndBalance(@Query() query: GetEntriesQueryDto) {

    const req: QuerySimple = {...requestTransform(query)}
    const report = await this.reportsService.getPriceAndBalance(req);
    return report;

  }


  @Roles('ALL')
  @UseGuards(RolesGuard)
  @Get('/information')
  @UsePipes(new ValidationPipe({ transform: true }))
  async getInformation(@Query() query: GetEntriesQueryDto) {

    const req: QuerySimple = {...requestTransform(query)}
    const report = await this.reportsService.getInformation(req);

    if (!report) {
      throw new NotFoundException(REPORT_NOT_PREPARE);
    }
    return report;
  }

  @Roles('ALL')
  @UseGuards(RolesGuard)
  @Get('/matOborot')
  @UsePipes(new ValidationPipe({ transform: true }))
  async getMatOtchet(@Query() query: GetEntriesQueryDto) {

    const req: QuerySimple = {...requestTransform(query)}
    const report = await this.reportsService.getMatOtchet(req);

    if (!report) {
      throw new NotFoundException(REPORT_NOT_PREPARE);
    }
    return report;
  }

  @Roles('ALL')
  @UseGuards(RolesGuard)
  @Get('/oborotka')
  @UsePipes(new ValidationPipe({ transform: true }))
  async getOborotka(@Query() query: GetEntriesQueryDto) {

    const req: QuerySimple = {...requestTransform(query)}
    const startTime = Date.now()
    const report = await this.reportsService.getOborotka(req);
    const endTime = Date.now()
    if (report) report.startTime = startTime
    report.endTime = endTime

    if (!report) {
      throw new NotFoundException(REPORT_NOT_PREPARE);
    }
    return report;
  }

  @Roles('ALL')
  @UseGuards(RolesGuard)
  @Get('/analitic')
  @UsePipes(new ValidationPipe({ transform: true }))
  async getAnalitic(@Query() query: GetEntriesQueryDto) {

    const req: QuerySimple = {...requestTransform(query)}
    const report = await this.reportsService.getAnalitic(req);

    if (!report) {
      throw new NotFoundException(REPORT_NOT_PREPARE);
    }
    return report;
  }
}
