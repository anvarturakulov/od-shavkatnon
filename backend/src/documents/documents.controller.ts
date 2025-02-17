import { Body, Controller, Post, UseGuards } from '@nestjs/common';
import { Document } from 'src/documents/document.model';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { Roles } from 'src/auth/roles-auth.decorator';
import { CreateDocumentDto } from './dto/createDocument.dto';
import { DocumentsService } from './documents.service';
import { RolesGuard } from 'src/auth/roles.guard';

@Controller('documents')
export class DocumentsController {

    constructor(private documentsService: DocumentsService) {}

    @ApiOperation({summary: 'Создать новый документ'})
    @ApiResponse({status: 200, type: Document})
    @Roles('USER')
    @UseGuards(RolesGuard)
    // @UsePipes(ValidationPipe)
    @Post('/create')
    addRole(@Body() dto:CreateDocumentDto) {
        return this.documentsService
    }
}
