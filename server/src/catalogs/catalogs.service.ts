import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateCatalogDto } from './dto/create-catalog.dto';
import { Catalog } from './models/catalog.model';

@Injectable()
export class CatalogsService {

    constructor(@InjectRepository(Catalog) private catalogRepository: Repository<Catalog>) { }

    async getAll() {
        return this.catalogRepository.find({ relations: ["categories", "categories.filters", "categories.filters.attribute", "categories.products"] });
    }

    async getById(id: number) {
        return this.catalogRepository.findOne({ where: { id: id }, relations: ["categories"] });
    }

    async addCatalog(dto: CreateCatalogDto) {
        const insertedId = (await this.catalogRepository.save({ ...dto })).id;
        return this.getById(insertedId)
    }

    async editCatalog(id: number, dto: CreateCatalogDto) {
        return await this.catalogRepository.save({ id: id, ...dto });
    }

    async deleteCatalog(id: number) {
        await this.catalogRepository.delete({ id: id });
    }
}
