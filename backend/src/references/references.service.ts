import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { Reference } from './reference.model';
import { InjectModel } from '@nestjs/sequelize';
import { TypeReference } from 'src/interfaces/reference.interface';
import { RefValues } from 'src/refvalues/refValues.model';
import { UpdateCreateReferenceDto } from './dto/updateCreateReference.dto';
import { convertJsonRef } from './helpers/convertJsonRef';

@Injectable()
export class ReferencesService {
    constructor(
        @InjectModel(Reference) private referenceRepository: typeof Reference,
        @InjectModel(RefValues) private refValuesRepository: typeof RefValues
    ) {}

    async getAllReferences() {
        const references = await this.referenceRepository.findAll({include: [RefValues]})
        return references
    }

    async getDeliverys() {
        const references = await this.referenceRepository.findAll({include: [RefValues]})
        
        if (references) {
            
        }
        return references
    }
    

    async getReferenceByType(typeReference: TypeReference) {
        const references = await this.referenceRepository.findAll({where: {typeReference}, include: [RefValues]})
        return references
    }

    async getReferenceById(id: number) {
        const reference = await this.referenceRepository.findOne({where: {id}, include: [RefValues]})
        return reference
    }

    async updateReferenceById(id: number, dto:UpdateCreateReferenceDto) {
            const reference = await this.referenceRepository.findOne({where: {id}, include: [RefValues]})
            const { name, typeReference } = dto

            if (reference) {
                reference.name = name
                reference.typeReference = typeReference
                if (!reference.refValues) {
                    reference.refValues = await this.refValuesRepository.create({referenceId: reference.id})
                } else {
                    // // reference.refValues.comment = dto.refValues?.comment || ''
                    await reference.refValues.update({...dto.refValues})
                }
                
                await reference.save()
                return reference
            }
            throw new HttpException('Пользователь не нашлась', HttpStatus.NOT_FOUND)
        }
    
    async createReference(dto:UpdateCreateReferenceDto) {

        const reference = await this.referenceRepository.create(
            {name:dto.name, typeReference:dto.typeReference}
        )

        if (reference) {
            reference.refValues = await this.refValuesRepository.create({referenceId: reference.id})
            await reference.refValues.update({...dto.refValues})
            return reference
        }
        throw new HttpException('Пользователь не нашлась', HttpStatus.NOT_FOUND)
    }

    async markToDeleteById(id: number) {
        const reference = await this.referenceRepository.findOne({where: {id}, include: [RefValues]})

        if (reference) {
            reference.refValues.markToDeleted = ! reference.refValues.markToDeleted
            await reference.refValues.save()
            return reference
        }
        throw new HttpException('Пользователь не нашлась', HttpStatus.NOT_FOUND)
    }

    async createMany(list: any) {
            
        if (list && list.length) {
            for (const item of list) {
                let element = convertJsonRef(item)
                const dto = {...element}
                try {
                    const reference = await this.referenceRepository.create(
                        {name:dto.name, typeReference:dto.typeReference, oldId: dto.oldId}
                    )
            
                    if (reference) {
                        reference.refValues = await this.refValuesRepository.create({referenceId: reference.id})
                        const dtoRefV = {...dto.refValues}
                        delete dtoRefV.referenceId
                        await reference.refValues.update({...dtoRefV})
                    }        
                    // await transaction.commit();
        
                } catch (err) {

                    // await transaction.rollback();
                    throw new Error(`Failed to create documents: ${err.message} ffff ${dto.name}`);

                }
            }
        }

        
    }

}
