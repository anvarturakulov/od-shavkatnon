import { Body, Controller, Delete, Get, Param, Patch, Post, Req, UseGuards } from '@nestjs/common';
import { Document } from 'src/documents/document.model';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { Roles } from 'src/auth/roles-auth.decorator';
import { DocumentsService } from './documents.service';
import { RolesGuard } from 'src/auth/roles.guard';
import { DocumentType } from 'src/interfaces/document.interface';
import { UpdateCreateDocumentDto } from './dto/updateCreateDocument.dto';
import { Request } from 'express';

@Controller('documents')
export class DocumentsController {

    constructor(private documentsService: DocumentsService) {}

    @ApiOperation({summary: 'Получение всех документов'})
    @ApiResponse({status: 200, type: [Document]})
    @Roles('ALL')
    @UseGuards(RolesGuard)
    @Get('all')
    getAll() {
        return this.documentsService.getAllDocuments()
    }

    @ApiOperation({summary: 'Получение всех документов по типу'})
    @ApiResponse({status: 200, type: [Document]})
    @Roles('ALL')
    @UseGuards(RolesGuard)
    @Get('byType/:typeDocument')
    getAllByType(@Param('typeDocument') typeDocument: DocumentType) {
        return this.documentsService.getAllDocumentsByType(typeDocument)
    }

    @ApiOperation({summary: 'Получение документов по типу и по дате'})
    @ApiResponse({status: 200, type: [Document]})
    @Roles('ALL')
    @UseGuards(RolesGuard)
    @Get('byTypeForDate')
    getByTypeForDate(@Req() request: Request) {
        let documentType = request.query?.documentType ? request.query?.documentType : '' 
        let dateStart = request.query?.dateStart ? +request.query?.dateStart : 0
        let dateEnd = request.query?.dateEnd ? +request.query?.dateEnd : 0
        console.log('datas', dateStart, '  dateEnd', dateEnd)
        return this.documentsService.getAllDocumentsByTypeForDate(documentType, dateStart, dateEnd)
    }

    @ApiOperation({summary: 'Получение документа по id'})
    @ApiResponse({status: 200, type: Document})
    @Roles('ALL')
    @UseGuards(RolesGuard)
    @Get('/:id')
    getById(@Param('id') id: number) {
        return this.documentsService.getDocumentById(id)
    }

    @ApiOperation({summary: 'Обновить документ'})
    @ApiResponse({status: 200, type: Document})
    @Roles('ALL')
    @UseGuards(RolesGuard)
    @Patch('update/:id')
    updateDocument(@Param('id') id: number,@Body() dto:UpdateCreateDocumentDto) {
        return this.documentsService.updateDocumentById(id, dto)
    }

    @ApiOperation({summary: 'Открыть новый документ'})
    @ApiResponse({status: 200, type: Document})
    @Roles('ALL')
    @UseGuards(RolesGuard)
    @Post('/create')
    createDocument(@Body() dto:UpdateCreateDocumentDto) {
        return this.documentsService.createDocument(dto)
    }

    @ApiOperation({summary: 'Пометить на удаление документа'})
    @ApiResponse({status: 200, type: Document})
    @Roles('ALL')
    @UseGuards(RolesGuard)
    @Delete('markToDelete/:id')
    markToDelete(@Param('id') id: number) {
        return this.documentsService.markToDeleteById(id)
    }

    @ApiOperation({summary: 'Дать проводку на документ'})
    @ApiResponse({status: 200, type: Document})
    @Roles('ALL')
    @UseGuards(RolesGuard)
    @Patch('setProvodka/:id')
    setProvodka(@Param('id') id: number) {
        return this.documentsService.setProvodka(id)
    }
    
}
