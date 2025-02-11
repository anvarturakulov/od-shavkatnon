import { Body, Controller, Get, NotFoundException, Post, Req, UseGuards, UsePipes, ValidationPipe } from '@nestjs/common';
import { ReportService } from './report.service';
import { ReportOptionsDto } from './dto/report.options.dto';
import { REPORT_NOT_PREPARE } from './report.constants';
import { JwtAuthGuard } from 'src/auth/guards/jwt.guard';
import { Request } from 'express';
import { QueryAnalitic, QueryInformation, QueryMatOtchet, QueryObject, QueryOborotka } from 'src/interfaces/report.interface';


@Controller('report')
export class ReportController {
  constructor(
    private readonly reportService: ReportService,
  ) { }
  currentUserForInform: string = ''
  
  @UseGuards(JwtAuthGuard)
  @UsePipes(new ValidationPipe())
  @Get('/entrys')
  async get() {
    const report = await this.reportService.getEntrysJournal();
    if (!report) {
      throw new NotFoundException(REPORT_NOT_PREPARE);
    }
    return report;
  }



  @UseGuards(JwtAuthGuard)
  @UsePipes(new ValidationPipe())
  @Get('/query')
  async getQuery(@Req() request: Request) {
    
    const queryObject: QueryObject = {
      typeQuery: `${request.query?.typeQuery}`,
      schet: `${request.query?.schet}`,
      startDate: +request.query?.startDate,
      endDate: +request.query?.endDate,
      firstSubcontoId: `${request.query?.firstSubcontoId}`,
      secondSubcontoId: `${request.query?.secondSubcontoId}`
    }

    const report = await this.reportService.getQueryValue(queryObject);
    
    return report;
  }


  @UseGuards(JwtAuthGuard)
  @UsePipes(new ValidationPipe())
  @Get('/priceAndBalance')
  async getPriceAndBalance(@Req() request: Request) {

    const queryObject: QueryObject = {
      schet: `${request.query?.schet}`,
      endDate: +request.query?.endDate,
      firstSubcontoId: `${request.query?.firstSubcontoId}`,
      secondSubcontoId: `${request.query?.secondSubcontoId}`
    }

    const report = await this.reportService.getPriceAndBalance(queryObject);

    return report;
  }


  @UseGuards(JwtAuthGuard)
  @UsePipes(new ValidationPipe())
  @Get('/information')
  async getInformation(@Req() request: Request) {
    
    const queryInformation: QueryInformation = {
      startDate: +request.query?.startDate,
      endDate: +request.query?.endDate,
      reportType: `${request.query?.reportType}`,
      foydaPrice: {
        first: + request.query?.firstPrice,
        second: + request.query?.secondPrice
      }
    }

    // выдаем активного пользователя кто хочет забрать отчет
    // и блокируем другого пользователя на получение отчета
    if (this.currentUserForInform.length > 0) {
      return {
        user: this.currentUserForInform
      }
    }

    // назначаем активного пользователья кто хочет забрать отчет
    this.currentUserForInform = `${request.query?.user}`
    // console.log('currentUser---'+this.currentUserForInform)
    
    const report = await this.reportService.getInformation(queryInformation);
    
    // так как сформировалься отчет, удаляем активного пользователя 
    this.currentUserForInform = ''

    if (!report) {
      throw new NotFoundException(REPORT_NOT_PREPARE);
    }
    return report;
  }

  @UseGuards(JwtAuthGuard)
  @UsePipes(new ValidationPipe())
  @Get('/matOborot')
  async getMatOtchet(@Req() request: Request) {

    const queryMatOtchet: QueryMatOtchet = {
      startDate: +request.query?.startDate,
      endDate: +request.query?.endDate,
      section: String(request.query.section),
    }

    const report = await this.reportService.getMatOtchet(queryMatOtchet);

    if (!report) {
      throw new NotFoundException(REPORT_NOT_PREPARE);
    }
    return report;
  }

  @UseGuards(JwtAuthGuard)
  @UsePipes(new ValidationPipe())
  @Get('/oborotka')
  async getOborotka(@Req() request: Request) {

    const queryOborotka: QueryOborotka = {
      startDate: +request.query?.startDate,
      endDate: +request.query?.endDate,
      schet: String(request.query.schet),
    }
    const startTime = Date.now()

    const report = await this.reportService.getOborotka(queryOborotka);

    const endTime = Date.now()
    if (report) report.startTime = startTime
    report.endTime = endTime

    if (!report) {
      throw new NotFoundException(REPORT_NOT_PREPARE);
    }
    console.log(report)
    return report;
  }

  @UseGuards(JwtAuthGuard)
  @UsePipes(new ValidationPipe())
  @Get('/analitic')
  async getAnalitic(@Req() request: Request) {

    const queryAnalitic: QueryAnalitic = {
      startDate: +request.query?.startDate,
      endDate: +request.query?.endDate,
      schet: String(request.query.schet),
      firstSubcontoId: String(request.query.firstSubcontoId),
      secondSubcontoId: String(request.query.secondSubcontoId),
      dk: String(request.query.dk)
    }

    const report = await this.reportService.getAnalitic(queryAnalitic);

    if (!report) {
      throw new NotFoundException(REPORT_NOT_PREPARE);
    }
    return report;
  }

}
