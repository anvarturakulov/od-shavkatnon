import { HttpException, HttpStatus, Injectable, OnModuleInit } from '@nestjs/common';
import { Reference } from './reference.model';
import { InjectModel } from '@nestjs/sequelize';
import { TypeReference } from 'src/interfaces/reference.interface';
import { RefValues } from 'src/refvalues/refValues.model';
import { UpdateCreateReferenceDto } from './dto/updateCreateReference.dto';
import { convertJsonRef } from './helpers/convertJsonRef';

@Injectable()
export class ReferencesService implements OnModuleInit {
  public refList: Reference[] = []; // Публичное свойство для кэша

  constructor(
    @InjectModel(Reference) private referenceRepository: typeof Reference,
    @InjectModel(RefValues) private refValuesRepository: typeof RefValues,
  ) {}

  // Инициализация при старте приложения
  async onModuleInit() {
    await this.updateRefList();
  }

  // Обновление кэша
  private async updateRefList() {
    console.time('UpdateRefList');
    this.refList = await this.referenceRepository.findAll({ include: [RefValues] });
    console.timeEnd('UpdateRefList');
  }

  // Получение всех references из кэша
  async getAllReferences(): Promise<Reference[]> {
    return this.refList;
  }

  // Получение всех references
  async getAllReferencesForOrders(): Promise<Reference[]> {
    const references = await this.referenceRepository.findAll({ include: [RefValues] });
    return references
  }

  // Получение deliverys из кэша
  async getDeliverys(): Promise<Reference[]> {
    return this.refList.filter(ref => ref.refValues?.typeSection === 'DELIVERY');
  }

  // Остальные методы остаются без изменений, но обновляют кэш при необходимости
  async getReferenceByType(typeReference: TypeReference) {
    const references = await this.referenceRepository.findAll({
      where: { typeReference },
      include: [RefValues],
    });
    return references;
  }

  async getReferenceById(id: number) {
    const reference = await this.referenceRepository.findOne({
      where: { id },
      include: [RefValues],
    });
    return reference;
  }

  async getWorker(telegramId: string) {
    const reference = await this.referenceRepository.findOne({
      where: {},
      include: [{
        model: RefValues,
        where: {
          telegramId: telegramId
        },
        required: true}]
    });
    return reference;
  }

  async updateReferenceById(id: number, dto: UpdateCreateReferenceDto) {
    const reference = await this.referenceRepository.findOne({
      where: { id },
      include: [RefValues],
    });
    const { name, typeReference } = dto;

    if (reference) {
      reference.name = name;
      reference.typeReference = typeReference;
      if (!reference.refValues) {
        reference.refValues = await this.refValuesRepository.create({ referenceId: reference.id });
      } else {
        await reference.refValues.update({ ...dto.refValues });
      }
      await reference.save();
      await this.updateRefList(); // Обновляем кэш после изменения
      return reference;
    }
    throw new HttpException('Пользователь не нашёлся', HttpStatus.NOT_FOUND);
  }

  async createReference(dto: UpdateCreateReferenceDto) {
    const reference = await this.referenceRepository.create({
      name: dto.name,
      typeReference: dto.typeReference,
    });

    if (reference) {
      reference.refValues = await this.refValuesRepository.create({ referenceId: reference.id });
      await reference.refValues.update({ ...dto.refValues });
      await this.updateRefList(); // Обновляем кэш после создания
      return reference;
    }
    throw new HttpException('Пользователь не нашёлся', HttpStatus.NOT_FOUND);
  }

  async markToDeleteById(id: number) {
    const reference = await this.referenceRepository.findOne({
      where: { id },
      include: [RefValues],
    });

    if (reference) {
      reference.refValues.markToDeleted = !reference.refValues.markToDeleted;
      await reference.refValues.save();
      await this.updateRefList(); // Обновляем кэш после изменения
      return reference;
    }
    throw new HttpException('Пользователь не нашёлся', HttpStatus.NOT_FOUND);
  }

  async createMany(list: any) {
    if (list && list.length) {
      for (const item of list) {
        let element = convertJsonRef(item);
        const dto = { ...element };
        try {
          const reference = await this.referenceRepository.create({
            name: dto.name,
            typeReference: dto.typeReference,
            oldId: dto.oldId,
          });

          if (reference) {
            reference.refValues = await this.refValuesRepository.create({
              referenceId: reference.id,
            });
            const dtoRefV = { ...dto.refValues };
            delete dtoRefV.referenceId;
            await reference.refValues.update({ ...dtoRefV });
          }
        } catch (err) {
          throw new Error(`Failed to create documents: ${err.message} ffff ${dto.name}`);
        }
      }
      await this.updateRefList(); // Обновляем кэш после массового создания
    }
  }
}