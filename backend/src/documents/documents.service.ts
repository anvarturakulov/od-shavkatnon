import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { Document } from './document.model';
import { InjectModel } from '@nestjs/sequelize';
import { DocValues } from 'src/docValues/docValues.model';
import { DocTableItems } from 'src/docTableItems/docTableItems.model';
import { DocumentType } from 'src/interfaces/document.interface';
import { UpdateCreateDocumentDto } from './dto/updateCreateDocument.dto';
const { Op } = require('sequelize');

@Injectable()
export class DocumentsService {


    constructor(
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
        const reference = await this.documentRepository.findOne({where: {id}, include: [DocValues, DocTableItems]})
        return reference
    }

    async updateDocumentById(id: number, dto:UpdateCreateDocumentDto) {
            const reference = await this.documentRepository.findOne({where: {id}, include: [DocValues, DocTableItems]})
            // const { name, typeReference } = dto

            // if (reference) {
            //     reference.name = name
            //     reference.typeReference = typeReference
            //     if (!reference.refValues) {
            //         reference.refValues = await this.refValuesRepository.create({referenceId: reference.id})
            //     } else {
            //         // // reference.refValues.comment = dto.refValues?.comment || ''
            //         await reference.refValues.update({...dto.refValues})
            //     }
                
            //     await reference.save()
            //     return reference
            // }
            throw new HttpException('Документ не нашелься', HttpStatus.NOT_FOUND)
        }
    
    async createDocument(dto:UpdateCreateDocumentDto) {

        // const reference = await this.documentRepository.create(
        //     {name:dto.name, typeReference:dto.typeReference}
        // )

        // if (reference) {
        //     reference.refValues = await this.refValuesRepository.create({referenceId: reference.id})
        //     await reference.refValues.update({...dto.refValues})
        //     return reference
        // }
        throw new HttpException('Пользователь не нашлась', HttpStatus.NOT_FOUND)
    }

    async markToDeleteById(id: number) {
        // const reference = await this.documentRepository.findOne({where: {id}, include: [DocValues, DocTableItems]})

        // if (reference) {
        //     reference.refValues.markToDeleted = ! reference.refValues.markToDeleted
        //     await reference.refValues.save()
        //     return reference
        // }
        throw new HttpException('Пользователь не нашлась', HttpStatus.NOT_FOUND)
    }

}
