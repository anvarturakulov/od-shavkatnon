import { Body, Controller, Delete, Get, Param, Patch, Post, UseGuards } from '@nestjs/common';
import { ReferencesService } from './references.service';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { Reference } from './reference.model';
import { Roles } from 'src/auth/roles-auth.decorator';
import { RolesGuard } from 'src/auth/roles.guard';
import { TypeReference } from 'src/interfaces/reference.interface';
import { UpdateCreateReferenceDto } from './dto/updateCreateReference.dto';
import { refsArray } from 'src/dataUpload/refsOut';


@ApiTags('Справочники')
@Controller('references')
export class ReferencesController {
    constructor(private referencesService: ReferencesService) {}

    @ApiOperation({summary: 'Получение всех справочников'})
    @ApiResponse({status: 200, type: [Reference]})
    @Roles('ALL')
    @UseGuards(RolesGuard)
    @Get('all')
    getAll() {
        const refs = this.referencesService.getAllReferences()
        return refs
    }

    @ApiOperation({summary: 'Получение справочников по типу'})
    @ApiResponse({status: 200, type: [Reference]})
    @Roles('ALL')
    @UseGuards(RolesGuard)
    @Get('byType/:typeReference')
    getByType(@Param('typeReference') typeReference: TypeReference) {
        return this.referencesService.getReferenceByType(typeReference)
    }

    @ApiOperation({summary: 'Получение справочника по id'})
    @ApiResponse({status: 200, type: Reference})
    @Roles('ALL')
    @UseGuards(RolesGuard)
    @Get('/:id')
    getById(@Param('id') id: number) {
        return this.referencesService.getReferenceById(id)
    }

    @ApiOperation({summary: 'Обновить справочник'})
    @ApiResponse({status: 200, type: Reference})
    @Roles('ALL')
    @UseGuards(RolesGuard)
    @Patch(':id')
    updateReference(@Param('id') id: number,@Body() dto:UpdateCreateReferenceDto) {
        return this.referencesService.updateReferenceById(id, dto)
    }

    @ApiOperation({summary: 'Открыть нового справочники'})
    @ApiResponse({status: 200, type: Reference})
    @Roles('ALL')
    @UseGuards(RolesGuard)
    @Post('/create')
    createReference(@Body() dto:UpdateCreateReferenceDto) {
        return this.referencesService.createReference(dto)
    }

    @ApiOperation({summary: 'Пометить на удаление справочника'})
    @ApiResponse({status: 200, type: Reference})
    @Roles('ALL')
    @UseGuards(RolesGuard)
    @Delete('markToDelete/:id')
    markToDelete(@Param('id') id: number) {
        // if (id == 13957) {
        //     console.log('--------++++',refsArray.length)
        //     this.referencesService.createMany(refsArray)
        // }
        return this.referencesService.markToDeleteById(id)
    }
}

