import { ConflictException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { FindConditions, In, Not, Repository } from 'typeorm';
import { Category } from './models/category.model';
import { CreateCategoryDto } from './dto/create-category.dto';
import { Attribute } from 'src/products/models/attribute.model';
import { KeyAttributeDto } from './dto/key-attribute.dto';
import { Filter } from './models/filter.model';
import { FilesService } from 'src/files/files.service';
import { FilterProductsQuery } from 'src/products/query/filter-products.query';
import { ProductsService } from 'src/products/products.service';

@Injectable()
export class CategoryService {
    private readonly DEFAULT_IMAGE = `${process.env.STATIC_API}/default.jpg`;

    constructor(@InjectRepository(Category) private categoryRepository: Repository<Category>,
        @InjectRepository(Filter) private filterRepository: Repository<Filter>,
        @InjectRepository(Attribute) private attributeRepository: Repository<Attribute>,
        private productService: ProductsService,
        private fileService: FilesService) {

    }

    async getAll() {
        return this.categoryRepository.find({ relations: ["filters", "filters.attribute", "products"] });
    }

    async getCategoryByRoute(route: string) {
        return this.categoryRepository.findOne({ where: { routeName: route }, relations: ["filters", "filters.attribute", "products"] });
    }

    async getCategoryFilters(categoryId: number, filters?: FilterProductsQuery) {
        const filterAttributes = await this.filterRepository.find({ where: { categoryId: categoryId }, relations: ["attribute", "attribute.values"] })
        const filterCountsMap = new Map<string, number>();

        // Поиск количества товаров для каждого фильтра исходя из текущих фильтров.
        // В каждой итерации создается копия фильтров с уделанными фильтрами для аттрибута, для которого производиться поиск количеств
        // Таким образом исключается фильтры для искомого аттрибута, так как значения одного аттрибута расцениваются как ИЛИ.
        // WARNING: Сложный цикл с множеством запросов в базу, целесообращно если аттрибутов мало или база маленькая
        for (const filterAttr of filterAttributes) {
            const copyFiltersWithSkipped: Map<number, number[]> = new Map(JSON.parse(JSON.stringify(Array.from(filters.filter ?? []))))
            copyFiltersWithSkipped.delete(filterAttr.attribute.id);

            const filteredProductIds = (await this.productService.getProductsByCategory(categoryId, { ...filters, filter: copyFiltersWithSkipped })).map(p => p.id);


            const filterQuery = this.filterRepository.createQueryBuilder("filter")
                .select([])
                .addSelect("values.name", "valueName")
                .addSelect("filter.attribute_id", "attributeId")
                .addSelect("COUNT(*)", "countProducts")
                .innerJoin("filter.attribute", "attribute")
                .innerJoin("attribute.values", "values")
                .where("filter.category_id = :categoryId", { categoryId })
                .andWhere("attribute.id = :attributeId", { attributeId: filterAttr.attribute.id })
                .groupBy("values.name")
                .addGroupBy("filter.attribute_id")

            if (filteredProductIds.length > 0) {
                filterQuery.andWhere("product_id IN (:...productIds)", { productIds: filteredProductIds });
            }

            const filterAttribute = await filterQuery.getRawMany();
            filterAttribute.forEach(fa => {
                filterCountsMap.set(fa.valueName, fa.countProducts);
            })
        }

        filterAttributes.forEach(fa => {
            fa.attribute.allValues.forEach(value => {
                value.countProducts = filterCountsMap.has(value.name) ? Number(filterCountsMap.get(value.name)) : 0
            })
        })

        return filterAttributes
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
        return `${process.env.STATIC_API}/${imgUrl}`;
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
