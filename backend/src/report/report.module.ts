import { Module } from '@nestjs/common';
import { ReportController } from './report.controller';
import { ReportService } from './report.service';
import { DocumentModule } from 'src/document/document.module';
import { ReferenceModule } from 'src/reference/reference.module';
import { HamirModule } from 'src/hamir/hamir.module';


@Module({
  imports: [DocumentModule, ReferenceModule, HamirModule],
  controllers: [ReportController],
  providers: [ReportService],
  exports: [ReportService]
})
export class ReportModule {}
