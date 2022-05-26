import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { In, Repository } from 'typeorm';
import { Category } from './models/category.model';
import { CreateCategoryDto } from './dto/create-category.dto';
import { Attribute } from 'src/products/models/attribute.model';
import { KeyAttributeDto } from './dto/key-attribute.dto';
import { Filter } from './models/filter.model';
import { EditFiltersDto } from './dto/edit-filters.dto';

@Injectable()
export class CategoryService {

    constructor(@InjectRepository(Category) private categoryRepository: Repository<Category>,
        @InjectRepository(Filter) private filterRepository: Repository<Filter>,
        @InjectRepository(Attribute) private attributeRepository: Repository<Attribute>,) {

    }

    async getCategories() {
        return this.categoryRepository.createQueryBuilder("category")
            .loadRelationCountAndMap("category.products", "category.products")
            .getMany();
    }

    async getCategoryByName(name: string) {
        return this.categoryRepository.findOne({ routeName: name });
    }

    async getCategoryFilters(categoryId: number) {
        return this.filterRepository.find({ where: { categoryId: categoryId }, relations: ["attribute", "attribute.values"] })
    }

    async addFilters(categoryId: number, newKeyAttributes: KeyAttributeDto[]) {
        const attributesToInsert = newKeyAttributes.map(attr => { return { name: attr.attribute } });
        await this.attributeRepository.upsert(attributesToInsert, { conflictPaths: ["id"], skipUpdateIfNoValuesChanged: true });
        const attributes = await this.attributeRepository.find({ name: In(newKeyAttributes.map(attr => attr.attribute)) })

        const filterValues = [];
        for (const newAttr of newKeyAttributes) {
            filterValues.push({
                attributeId: attributes.find(attr => attr.name == newAttr.attribute).id,
                categoryId: categoryId,
                isRange: newAttr.isRange,
                step: newAttr.step
            })
        }

        await this.filterRepository.createQueryBuilder()
            .insert()
            .values(filterValues)
            .orIgnore()
            .execute()

        return this.getCategoryFilters(categoryId);
    }

    async deleteFilters(categoryId: number, deleteKeyAttributesIds: number[]) {
        return this.filterRepository.delete({ categoryId: categoryId, attributeId: In(deleteKeyAttributesIds) });
    }

    async editFilters(categoryId: number, dto: EditFiltersDto) {
        await this.deleteFilters(categoryId, dto.deleteKeyAttributesIds);
        await this.addFilters(categoryId, dto.newKeyAttributes);
        return this.filterRepository.find({ where: { categoryId: categoryId }, relations: ["attribute", "attribute.values"] });
    }

    async addCategory(dto: CreateCategoryDto) {
        return this.categoryRepository.save(dto);
    }
}
