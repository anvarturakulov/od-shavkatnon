import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { Entry } from './entry.model';

@Injectable()
export class EntriesService {
    constructor(
        @InjectModel(Entry) private entryRepository: typeof Entry,
    ) {}

    async getAllEntries() {
        const references = await this.entryRepository.findAll()
        return references
    }

}
