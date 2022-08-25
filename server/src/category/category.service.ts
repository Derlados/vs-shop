import { ConflictException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { FindConditions, In, Not, Repository } from 'typeorm';
import { Category } from './models/category.model';
import { CreateCategoryDto } from './dto/create-category.dto';
import { Attribute } from 'src/products/models/attribute.model';
import { KeyAttributeDto } from './dto/key-attribute.dto';
import { Filter } from './models/filter.model';
import { FilesService } from 'src/files/files.service';

@Injectable()
export class CategoryService {
    private readonly DEFAULT_IMAGE = `${process.env.STATIC_API}/default.jpg`;


    constructor(@InjectRepository(Category) private categoryRepository: Repository<Category>,
        @InjectRepository(Filter) private filterRepository: Repository<Filter>,
        @InjectRepository(Attribute) private attributeRepository: Repository<Attribute>,
        private fileService: FilesService) {

    }

    async getAll() {
        return this.categoryRepository.find({ relations: ["filters", "filters.attribute", "products"] });
    }

    async getCategoryByRoute(route: string) {
        return this.categoryRepository.findOne({ where: { routeName: route }, relations: ["filters", "filters.attribute", "products"] });
    }

    async getCategoryFilters(categoryId: number) {
        return this.filterRepository.find({ where: { categoryId: categoryId }, relations: ["attribute", "attribute.values"] })
    }

    async addCategory(dto: CreateCategoryDto) {
        const existCategory = await this.categoryRepository.findOne({ name: dto.name })
        if (existCategory) {
            throw new ConflictException("Category with this name already exist");
        }

        const category = await this.categoryRepository.save({ ...dto, img: this.DEFAULT_IMAGE });
        await this.editFilters(category.id, dto.attributes);
        return this.getCategoryByRoute(category.routeName);
    }

    async editCategory(id: number, dto: CreateCategoryDto) {
        const category = await this.categoryRepository.findOne({ id: id });
        if (!category) {
            throw new NotFoundException();
        }

        const updatedCategory = await this.categoryRepository.save({ ...category, ...dto });
        await this.editFilters(id, dto.attributes);
        return this.getCategoryByRoute(updatedCategory.routeName);
    }

    async editImage(id: number, image: Express.Multer.File) {
        const imgUrl = await this.fileService.createFile(image);
        await this.categoryRepository.update({ id: id }, { img: imgUrl });
        return imgUrl;
    }

    async deleteCategory(id: number) {
        return this.categoryRepository.delete({ id: id });
    }

    private async addFilters(categoryId: number, newKeyAttributes: KeyAttributeDto[]) {
        const attributesToInsert = newKeyAttributes.map(attr => { return { name: attr.name } });
        await this.attributeRepository.upsert(attributesToInsert, { conflictPaths: ["name"], skipUpdateIfNoValuesChanged: true });
        const attributes = await this.attributeRepository.find({ name: In(newKeyAttributes.map(attr => attr.name)) })

        const filterValues = [];
        for (const newAttr of newKeyAttributes) {
            filterValues.push({
                categoryId: categoryId,
                attributeId: attributes.find(attr => attr.name == newAttr.name).id,
                isRange: newAttr.isRange,
                step: newAttr.step ?? 1
            })
        }

        await this.filterRepository.createQueryBuilder()
            .insert()
            .values(filterValues)
            .orIgnore()
            .execute()


        return this.getCategoryFilters(categoryId);
    }

    private async deleteFilters(categoryId: number, deleteKeyAttributesIds: number[]) {
        return this.filterRepository.delete({ categoryId: categoryId, attributeId: In(deleteKeyAttributesIds) });
    }

    private async editFilters(categoryId: number, attributes: KeyAttributeDto[]) {
        await this.addFilters(categoryId, attributes);
        const filtersToDelete = await this.filterRepository.find({ where: { categoryId: categoryId, attribute: { name: Not(In(attributes.map(a => a.name))) } }, relations: ["attribute"] });
        await this.deleteFilters(categoryId, filtersToDelete.map(f => f.attributeId));
        return this.filterRepository.find({ where: { categoryId: categoryId }, relations: ["attribute", "attribute.values"] });
    }
}
