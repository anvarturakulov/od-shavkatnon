import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { Document } from './document.model';
import { InjectModel } from '@nestjs/sequelize';
import { DocValues } from 'src/docValues/docValues.model';
import { DocTableItems } from 'src/docTableItems/docTableItems.model';
import { DocSTATUS, DocumentType } from 'src/interfaces/document.interface';
import { UpdateCreateDocumentDto } from './dto/updateCreateDocument.dto';
import { Sequelize } from 'sequelize-typescript';
const { Op } = require('sequelize');

@Injectable()
export class DocumentsService {


    constructor(
        private readonly sequelize: Sequelize,
        @InjectModel(Document) private documentRepository: typeof Document,
        @InjectModel(DocValues) private docValuesRepository: typeof DocValues,
        @InjectModel(DocTableItems) private docTableItemsRepository: typeof DocTableItems
    ) {}

    async getAllDocuments() {
        const documents = await this.documentRepository.findAll({include: [DocValues, DocTableItems ]})
        return documents
    }

    async getAllDocumentsByType(documentType: DocumentType) {
        const documents = await this.documentRepository.findAll({where: {documentType}, include: [DocValues, DocTableItems]})
        return documents
    }

    async getAllDocumentsByTypeForDate(documentType, dateStart: number, dateEnd: number) {
        const documents = await this.documentRepository.findAll(
            {
                where: {
                        documentType, 
                        date: { 
                            [Op.gte]: dateStart,
                            [Op.lte]: dateEnd
                        },
                    }, 
                include: [DocValues, DocTableItems]
            }
        )
        return documents 
    }

    async getDocumentById(id: number) {
        const document = await this.documentRepository.findOne({where: {id}, include: [DocValues, DocTableItems]})
        return document
    }

    async updateDocumentById(id: number, dto:UpdateCreateDocumentDto) {
        const document = await this.documentRepository.findOne({where: {id}, include: [DocValues, DocTableItems]})
    
        const transaction = await this.sequelize.transaction();
        try {
            if (document) {
                document.date = dto.date
                if (document.docValues) {
                    await document.docValues.update({...dto.docValues})
                }
                await document.save()
                await this.docTableItemsRepository.destroy({where: {docId:document.id}})

                const items = [...dto.docTableItems]

                if (items && items.length > 0 && items[0].analiticId != -1 ) {
                    for (const item of items) {
                        const docTableItem = await this.docTableItemsRepository.create({
                            ...item,
                            docId: document.id
                        })
                    }
                }

            }

            await transaction.commit();
            return document

        } catch (error) {
            await transaction.rollback();
            throw error;
        }
    }

    async createDocument(dto:UpdateCreateDocumentDto) {
        
        const transaction = await this.sequelize.transaction();
        try {
            const document = await this.documentRepository.create({
                date:dto.date, 
                documentType: dto.documentType, 
                docStatus: DocSTATUS.OPEN,
                userId: dto.userId
            })

            const docValues = await this.docValuesRepository.create({
                ...dto.docValues,
                docId: document.id
            })

            const items = [...dto.docTableItems]

            if (items && items.length > 0 && items[0].analiticId != -1 ) {
                for (const item of items) {
                    const docTableItem = await this.docTableItemsRepository.create({
                        ...item,
                        docId: document.id
                    })
                }
            }

            await transaction.commit();
            return document

        } catch (error) {
            await transaction.rollback();
            throw error;
        }

    }

    async markToDeleteById(id: number) {
        const document = await this.documentRepository.findOne({where: {id}, include: []})
        let newStatus: DocSTATUS = DocSTATUS.DELETED
        if (document) {
            if (document.docStatus == DocSTATUS.DELETED) newStatus = DocSTATUS.OPEN
            if (document.docStatus == DocSTATUS.OPEN) newStatus = DocSTATUS.DELETED
            if (document.docStatus == DocSTATUS.PROVEDEN) newStatus = DocSTATUS.DELETED
                            
            // Anvar Bu erda Entrys ni uchirish kodini ham yozish kerak
            document.docStatus = newStatus
            await document.save()
            return document
        }
        throw new HttpException('Документ не найден', HttpStatus.NOT_FOUND)
    }

    async setProvodka(id: number) {
        
        const document = await this.documentRepository.findOne({where: {id}, include: []})
        let newStatus: DocSTATUS = DocSTATUS.DELETED
        if (document && document.docStatus == DocSTATUS.OPEN) {
                            
            // Anvar Bu erda yangi provodkalar tuzish kodi kerak
            document.docStatus = DocSTATUS.PROVEDEN
            await document.save()
            return document
        }
        throw new HttpException('Документ не найден', HttpStatus.NOT_FOUND)
    }

}
