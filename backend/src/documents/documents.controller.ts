import { Body, Controller, Delete, Get, Param, Patch, Post, Req, UseGuards } from '@nestjs/common';
import { Document } from 'src/documents/document.model';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { Roles } from 'src/auth/roles-auth.decorator';
import { DocumentsService } from './documents.service';
import { RolesGuard } from 'src/auth/roles.guard';
import { DocSTATUS, DocumentType } from 'src/interfaces/document.interface';
import { UpdateCreateDocumentDto } from './dto/updateCreateDocument.dto';
import { Request } from 'express';
// import TelegramBot from 'node-telegram-bot-api';
// import { ReferencesForTelegramMessage, sendMessageToChanel } from './helper/entry/telegramMessage';

@Controller('documents')
export class DocumentsController {

    constructor(private documentsService: DocumentsService) {}
    // public bot = new TelegramBot(`${process.env.BOT_TOKEN}`, { polling: true })
  
    // private sendMessage = async (dto: CreateDocumentDto, newDocument: boolean, messageInDeleting?: string,) => {
        
    //     const user = await this.userService.findUserByName(dto.user);

    //     let sender, receiver, analitic, firstWorker, secondWorker, thirdWorker
    //     if (dto.senderId) sender = await this.referenceService.findById(dto.senderId);
    //     if (dto.receiverId) receiver = await this.referenceService.findById(dto.receiverId);
    //     if (dto.analiticId) analitic = await this.referenceService.findById(dto.analiticId);
    //     if (dto.firstWorkerId) firstWorker = await this.referenceService.findById(dto.firstWorkerId);
    //     if (dto.secondWorkerId) secondWorker = await this.referenceService.findById(dto.secondWorkerId);
    //     if (dto.thirdWorkerId) thirdWorker = await this.referenceService.findById(dto.thirdWorkerId);

    //     let references: ReferencesForTelegramMessage = {
    //         sender,
    //         receiver,
    //         analitic,
    //         firstWorker,
    //         secondWorker,
    //         thirdWorker,
    //     }
    //     sendMessageToChanel(dto, user, references, newDocument, messageInDeleting, this.bot)
    // }

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
        console.time(`Database${documentType}-${dateStart}-${dateEnd}`);
        let documents = this.documentsService.getAllDocumentsByTypeForDate(documentType, dateStart, dateEnd)
        console.timeEnd(`Database${documentType}-${dateStart}-${dateEnd}`);
        console.time(`Processing${documentType}-${dateStart}-${dateEnd}`);
        if (documents) {
            const result = documents.then((value) => {
                const results = value.map((item:Document) =>{
                    item.docStatus == DocSTATUS.DELETED
                })
            })
        }
        console.timeEnd(`Processing${documentType}-${dateStart}-${dateEnd}`);
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
        if (id == 116675) {
            
            // this.documentsService.createMany(docsArray)
            // this.documentsService.pereProvodka()
        }
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
