import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { DocHamir, Hamir } from './models/hamir.model';
import { Model } from 'mongoose';
import { CreateHamirDto } from './dto/hamir.create.dto';

@Injectable()
export class HamirService {
  constructor(
    @InjectModel(Hamir.name) private hamirModel: Model<DocHamir>
  ) { }

  async createHamir(dto: CreateHamirDto): Promise<Hamir> {
    const newHamir = new this.hamirModel(dto);
    return newHamir.save()
  }

  async getAllHamirsForDate(date: string): Promise<Hamir[]> {
    
    let dateStartInNumber = Date.parse(date)
    let dateEndInNumber = Date.parse(date) + 86399999

    let hamirs = this.hamirModel.find().exec()
    return (await hamirs).filter((item: Hamir) => {
      return (item.date >= dateStartInNumber && item.date <= dateEndInNumber)
    })
  }

  async getAllHamirs(): Promise<Hamir[]> {
    let hamirs = this.hamirModel.find().exec()
    return hamirs
  }

  async getByTypeForDateHamir(dateStart: number, dateEnd: number): Promise<Hamir[]> {
    return this.hamirModel.find({ date: { $gte: dateStart, $lte: dateEnd } }).exec()
  }

  async getHamirsByUserToDate(dto: CreateHamirDto): Promise<Hamir[]> {

    let date = new Date(dto.date);
    let dateStr = date.toISOString().split('T')[0]

    let dateStartInNumber = Date.parse(dateStr)
    let dateEndInNumber = Date.parse(dateStr) + 86399999

    let hamirs = this.hamirModel.find().exec()
    return (await hamirs).filter((item: Hamir) => {
      return (
        (item.date >= dateStartInNumber && item.date <= dateEndInNumber)
        && item.user == dto.user
        && String(item.sectionId) == dto.sectionId
        )
    })
  }

  async setProvodka(id: string, count: number, analiticId) {
    const hamir: CreateHamirDto = await this.hamirModel.findOne({ _id: id })
    if (hamir.proveden) {
      throw new NotFoundException('Проведен булган хамирни узгартириш');
    }
    return this.hamirModel.updateOne({ _id: id }, { $set: { proveden: true, zuvala: count, analiticId: analiticId } })
  }

  
}
