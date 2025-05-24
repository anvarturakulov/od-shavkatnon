import { Body, Controller, Delete, Get, HttpException, HttpStatus, NotFoundException, Param, Patch, Post, Req, UseGuards } from '@nestjs/common';
import { Document } from 'src/documents/document.model';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { Roles } from 'src/auth/roles-auth.decorator';
import { DocumentsService } from './documents.service';
import { RolesGuard } from 'src/auth/roles.guard';
import { DocSTATUS, DocumentType, SendingHamir } from 'src/interfaces/document.interface';
import { UpdateCreateDocumentDto } from './dto/updateCreateDocument.dto';
import { Request } from 'express';
import * as TelegramBot from 'node-telegram-bot-api';
import { ReferencesForTelegramMessage, sendMessageToChanel } from './helper/entry/telegramMessage';
import { UsersService } from 'src/users/users.service';
import { ReferencesService } from 'src/references/references.service';
import { DOCUMENT_NOT_FOUND_ERROR } from './document.constants';
import { sendMessage } from './helper/entry/sendMessage';
import { BackupService } from 'src/backup/backup.service';
import { DuplicateDocs } from './dto/duplicateDocs.dto';

@Controller('documents')
export class DocumentsController {

    constructor(
        private documentsService: DocumentsService,
        private usersService: UsersService,
        private referencesService: ReferencesService,
        private backupService: BackupService
    ) {}

    
    public bot = new TelegramBot(`${process.env.BOT_TOKEN}`, { polling: true });
    
    

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
        let documents = this.documentsService.getAllDocumentsByTypeForDate(documentType, dateStart, dateEnd)
        // if (documents) {
        //     const result = documents.then((value) => {
        //         const results = value.map((item:Document) =>{
        //             item.docStatus == DocSTATUS.DELETED
        //         })
        //     })
        // }
        return documents
    }

    @ApiOperation({summary: 'Получение документов по типу и по дате'})
    @ApiResponse({status: 200, type: [Document]})
    @Roles('ALL')
    @UseGuards(RolesGuard)
    @Get('byOrderDocumentsForDate')
    getOrderDocumentsForDate(@Req() request: Request) {
        let order = request.query?.order == 'true' ? true : false 
        let dateStart = request.query?.dateStart ? +request.query?.dateStart : 0
        let dateEnd = request.query?.dateEnd ? +request.query?.dateEnd : 0
        let documents = this.documentsService.getAllOrdersForDate(order, dateStart, dateEnd)
        return documents
    }

    @ApiOperation({summary: 'Получение документов по типу и по дате'})
    @ApiResponse({status: 200, type: [Document]})
    @Roles('ALL')
    @UseGuards(RolesGuard)
    @Get('byDate')
    getAllDocsByDate(@Req() request: Request) {
        let dateStart = request.query?.dateStart ? +request.query?.dateStart : 0
        let dateEnd = request.query?.dateEnd ? +request.query?.dateEnd : 0
        let documents = this.documentsService.getAllDocsByDate(dateStart, dateEnd)
        return documents
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
    async updateDocument(@Param('id') id: number,@Body() dto:UpdateCreateDocumentDto) {
        const updatedDocument = await this.documentsService.updateDocumentById(id, dto);
        
        if (!updatedDocument) {
            throw new NotFoundException(DOCUMENT_NOT_FOUND_ERROR);
        }
        
        if (updatedDocument) sendMessage(dto, false, this.usersService, this.referencesService, this.bot)
        return updatedDocument;
    }

    @ApiOperation({summary: 'Открыть новый документ'})
    @ApiResponse({status: 200, type: Document})
    @Roles('ALL')
    @UseGuards(RolesGuard)
    @Post('/create')
    async createDocument(@Body() dto:UpdateCreateDocumentDto) {
        let newDoc = this.documentsService.createDocument(dto, this.usersService, this.referencesService, this.bot);
        if ((await newDoc) && (await newDoc).docStatus == DocSTATUS.PROVEDEN) {
            sendMessage(dto, true, this.usersService, this.referencesService, this.bot)
        }
    }

    @ApiOperation({summary: 'Пометить на удаление документа'})
    @ApiResponse({status: 200, type: Document})
    @Roles('ALL')
    @UseGuards(RolesGuard)
    @Delete('markToDelete/:id')
    async markToDelete(@Param('id') id: number) {
        
        const markedDoc = await this.documentsService.markToDeleteById(id, this.bot);

        if (!markedDoc) {
        throw new HttpException(DOCUMENT_NOT_FOUND_ERROR, HttpStatus.NOT_FOUND);
        }

        const document = await this.documentsService.getDocumentById(id);
        
        let newDto = { ...JSON.parse(JSON.stringify(document)) }
        let messageIndeleting = newDto.docStatus == DocSTATUS.DELETED ? 'ЧЕК УЧИРИЛДИ' : 'ЧЕК ТИКЛАНДИ'
        try {
            await sendMessage(newDto, false, this.usersService, this.referencesService, this.bot, messageIndeleting);
        } catch (error) {
            console.error(`Error in sendMessage: ${error.message}`);
        }

        // sendMessage(newDto, false, this.usersService, this.referencesService, this.bot, messageIndeleting)
        return markedDoc
    }

    @ApiOperation({summary: 'Пометить на удаление документа'})
    @ApiResponse({status: 200, type: Document})
    @Roles('ALL')
    @UseGuards(RolesGuard)
    @Delete('deleteComeProducts')
    async deleteComeProduct(@Req() request: Request) {
        const dateStart = request.query?.dateStart ? +request.query?.dateStart : 0
        const dateEnd = request.query?.dateEnd ? +request.query?.dateEnd : 0
        const documents = await this.documentsService.deleteComeProduct(dateStart, dateEnd);
        return documents
    }

    @ApiOperation({summary: 'Дать проводку на документ'})
    @ApiResponse({status: 200, type: Document})
    @Roles('ALL')
    @UseGuards(RolesGuard)
    @Patch('setProvodka/:id')
    async setProvodka(@Param('id') id: number) {
        const docForProvodka = await this.documentsService.setProvodka(id);
        const document = await this.documentsService.getDocumentById(id);

        let newDto = { ...JSON.parse(JSON.stringify(document)) }

        if (!docForProvodka) {
            throw new NotFoundException(DOCUMENT_NOT_FOUND_ERROR);
        }
        if (docForProvodka) sendMessage(newDto, true, this.usersService, this.referencesService, this.bot)
        return docForProvodka;

    }

    @ApiOperation({summary: 'Открыть новый документ'})
    @ApiResponse({status: 200, type: Document})
    @Roles('ALL')
    @UseGuards(RolesGuard)
    @Post('/createhamirs')
    async createHamirs(@Body() dto:UpdateCreateDocumentDto) {
        const sectionId = dto.docValues.senderId
        const senderSection = await this.referencesService.getReferenceById(sectionId)
        
        let newRecieverId
        if (senderSection) newRecieverId = Number(senderSection.refValues.comment)

        dto = {
            ...dto,
            docValues: {
                ...dto.docValues,
                receiverId: newRecieverId
            }
        }

        if (!dto.docValues.senderId || !dto.docValues.receiverId ) return
        
        for (let i = 1; i < 31; i++) {
            let newDto = {
                ...dto,
                docValues: {
                    ...dto.docValues,
                    comment: String(i) + ' - зувала'    
                }
            }
            
            const newDoc = this.documentsService.createDocument(newDto, this.usersService, this.referencesService, this.bot);
        }
        return true

    }

    @ApiOperation({summary: 'Открыть новый документ'})
    @ApiResponse({status: 200, type: Document})
    @Roles('ALL')
    @UseGuards(RolesGuard)
    @Post('/duplicateDocsByTypeForDate')
    async duplicateDocsByTypeForDate(@Body() dto:DuplicateDocs) {
        const newDocs = this.documentsService.duplicateDocsByTypeForDate(dto);
        return newDocs
    }

    @ApiOperation({summary: 'Дать проводку на документ'})
    @ApiResponse({status: 200, type: Document})
    @Roles('ALL')
    @UseGuards(RolesGuard)
    @Patch('sendhamirs/:id')
    async sendHamirs(@Param('id') id: number, @Body() dto:SendingHamir) {
        const count = dto.count | 0 
        const analiticId = dto.analiticId | 0 
        
        if (count && analiticId) {
            const doc = await this.documentsService.updateHamirsById(id, count, analiticId)
            console.log('analiticId --', doc.docValues.analiticId, '----', 'count --', doc.docValues.count)

            const docForProvodka = await this.documentsService.setProvodka(id);
            
            let newDto = { ...JSON.parse(JSON.stringify(doc)) }
            if (!docForProvodka) {
                throw new NotFoundException(DOCUMENT_NOT_FOUND_ERROR);
            }
    
            if (docForProvodka) sendMessage(newDto, true, this.usersService, this.referencesService, this.bot)
            return docForProvodka;
        }

        return 

    }

    
}
