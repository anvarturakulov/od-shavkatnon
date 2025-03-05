import { Controller, Get, NotFoundException, Req, UseGuards } from '@nestjs/common';
import { ReportsService } from './reports.service';
import { Roles } from 'src/auth/roles-auth.decorator';
import { RolesGuard } from 'src/auth/roles.guard';
import { QuerySimple } from 'src/interfaces/report.interface';
import { Request } from 'express';
import { requestTransform } from './querys/requestTransform';
import { REPORT_NOT_PREPARE } from './report.constants';

@Controller('reports')
export class ReportsController {

  constructor(private reportsService: ReportsService) {}
    
  // @ApiOperation({summary: 'Получение всех документов'})
  // @ApiResponse({status: 200, type: [Document]})
  @Roles('ALL')
  @UseGuards(RolesGuard)
  @Get('/query')
  async getQuery(@Req() request: Request) {

    const req: QuerySimple = {...requestTransform(request)}
    const report = await this.reportsService.getQueryValue(req);
    return report;

  }

  @Roles('ALL')
  @UseGuards(RolesGuard)
  @Get('/priceAndBalance')
  async getPriceAndBalance(@Req() request: Request) {

    const req: QuerySimple = {...requestTransform(request)}
    const report = await this.reportsService.getPriceAndBalance(req);
    return report;

  }


  @Roles('ALL')
  @UseGuards(RolesGuard)
  @Get('/information')
  async getInformation(@Req() request: Request) {

    const req: QuerySimple = {...requestTransform(request)}
    const report = await this.reportsService.getInformation(req);

    if (!report) {
      throw new NotFoundException(REPORT_NOT_PREPARE);
    }
    return report;
  }

  @Roles('ALL')
  @UseGuards(RolesGuard)
  @Get('/matOborot')
  async getMatOtchet(@Req() request: Request) {

    const req: QuerySimple = {...requestTransform(request)}
    const report = await this.reportsService.getMatOtchet(req);

    if (!report) {
      throw new NotFoundException(REPORT_NOT_PREPARE);
    }
    return report;
  }

  @Roles('ALL')
  @UseGuards(RolesGuard)
  @Get('/oborotka')
  async getOborotka(@Req() request: Request) {

    const req: QuerySimple = {...requestTransform(request)}
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
  async getAnalitic(@Req() request: Request) {

    const req: QuerySimple = {...requestTransform(request)}
    const report = await this.reportsService.getAnalitic(req);

    if (!report) {
      throw new NotFoundException(REPORT_NOT_PREPARE);
    }
    return report;
  }
}
