import { Injectable } from '@nestjs/common';
import { CreateDocumentDto } from './dto/createDocument.dto';
import { Document } from './document.model';
import { InjectModel } from '@nestjs/sequelize';

@Injectable()
export class DocumentsService {


    // @InjectModel(UserRoles) private userRolesRepository: typeof UserRoles,
    // @InjectModel(Role) private rolesRepository: typeof Role,
    // private roleService: RolesService

    constructor(@InjectModel(Document) private documentRepository: typeof Document ) {}

    async createDocument(dto: CreateDocumentDto) {
        const user = await this.documentRepository.create(dto)
        // const role = await this.roleService.getRoleByValue("USER")
        // if (role) {
        //     await user.$set('roles', [role.id])
        //     user.roles = [role]
        // }
        return user;

    }

}
