import { ForbiddenException, Injectable, InternalServerErrorException, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { FilesService } from 'src/files/files.service';
import { Between, In, Like, Repository } from 'typeorm';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateImagesDto } from './dto/update-images.dto';
import { Attribute } from './models/attribute.model';
import { Image } from './models/image.model';
import { ProductAttribute, Product } from './models/product.model';
import { Value } from './models/value.model';
import cyrillicToTranslit from 'cyrillic-to-translit-js';
import { CreateAttributeDto } from './dto/create-attribute.dto';
import { Range } from 'src/lib/types/Range';
import { QueryDeepPartialEntity } from 'typeorm/query-builder/QueryPartialEntity';
import { FilterProductsQuery } from './query/filter-products.query';

// ЗАМЕТКА
// const products = await this.productRepository.createQueryBuilder("product")
//     .innerJoinAndSelect("product.category", "category")
//     .innerJoinAndSelect("product.values", "values")
//     .innerJoinAndSelect("values.attribute", "attributes")
//     .where("attributes.attribute IN ('attr2', 'attr1')")
//     .getMany();

@Injectable()
export class ProductsService {
    static readonly MAX_PER_PAGE = 20;

    constructor(@InjectRepository(Product) private productRepository: Repository<Product>,
        @InjectRepository(Attribute) private attributeRepository: Repository<Attribute>,
        @InjectRepository(Value) private valuesRepository: Repository<Value>,
        @InjectRepository(Image) private imageRepository: Repository<Image>,
        private fileService: FilesService) {
    }

    async getProducts(): Promise<Product[]> {
        const products = await this.productRepository.find({ relations: ["values", "values.attribute", "images", "category"] });
        return products;
    }

    async getBestsellers(): Promise<Product[]> {
        const products = await this.productRepository.find({ where: { isBestseller: true }, relations: ["images", "category"] });
        return products;
    }

    async getNewProducts(): Promise<Product[]> {
        const products = await this.productRepository.find({ where: { isNew: true }, relations: ["images", "category"] });
        return products;
    }

    async getProductById(id: number): Promise<Product> {
        const product = await this.productRepository.findOne({
            where: { id: id },
            relations: ["values", "values.attribute", "images", "category"]
        });

        if (!product) {
            throw new NotFoundException("Товар не найден");
        }

        return product;
    }

    async getProductsByCategory(categoryId: number, filters: FilterProductsQuery, ignorePages: boolean = false, onlyIds: boolean = false): Promise<Product[] | number[]> {
        const productsQuery = this.productRepository.createQueryBuilder("product")
            .select("product.id as id")
            .addSelect("COUNT(*) as count_matches")
            .innerJoin("product.category", "category")
            .innerJoin("product.values", "values")
            .innerJoin("values.attribute", "attributes")
            .innerJoin("product.images", "images")
            .where("category.id = :categoryId", { categoryId: categoryId })
            .andWhere("product.price BETWEEN :min AND :max", { min: filters.minPrice ?? 0, max: filters.maxPrice ?? Number.MAX_VALUE })
            .groupBy("product.id")


        if (!ignorePages) {
            productsQuery
                .limit(ProductsService.MAX_PER_PAGE)
                .offset(filters.page ? filters.page * ProductsService.MAX_PER_PAGE : 0);

        }

        if (filters.search) {
            productsQuery.andWhere(`(product.title LIKE :text OR product.brand LIKE :text)`, { text: `%${filters.search}%` })
        }

        if (filters.brands) {
            productsQuery.andWhere("product.brand IN (:...brands)", { brands: filters.brands })
        }

        if (filters.filter) {
            const allValues = [];
            Array.from(filters.filter).map(([_, value]) => {
                allValues.push(...value);
            });

            const valueNames = (await this.valuesRepository.find({
                id: In(allValues)
            })).map(v => v.name);


            if (valueNames.length != 0) {
                productsQuery.andWhere("values.name IN (:...valIds)", { valIds: valueNames })
                productsQuery.having("count_matches >= :countMatches", { countMatches: filters.filter.size });
            }
        }

        // TODO придумать что то нормальнее
        const products = await productsQuery.getRawMany();

        if (onlyIds) {
            console.log(products.map(p => p.id));
            return products.map(p => p.id);
        }

        console.log("full");
        return this.productRepository.find({ where: { id: In(products.map(p => p.id)) }, relations: ["images", "category"] });
    }

    async getProductsByText(text: string): Promise<Product[]> {
        return this.productRepository.find({
            where: [{ title: Like(`%${text}%`) }, { brand: Like(`%${text}%`) }],
            relations: ["values", "values.attribute", "images", "category"]
        });
    }

    async getProductCount(userId: number, productId: number) {
        const product = await this.productRepository.findOne({ id: productId, userId: userId });
        return product.count;
    }

    async createProduct(userId: number, dto: CreateProductDto): Promise<Product> {
        const { attributes, image, ...product } = dto;

        const result = await this.productRepository.insert({ ...product, userId: userId });
        const insertId = result.raw.insertId;

        if (image) {
            await this.imageRepository.insert({ filename: image, productId: insertId, isMain: true });
        }


        await this.addAttributes(insertId, attributes);
        return this.getProductById(insertId);
    }

    /**
     * Обновление продукта. Основные данные обновляются, а значени аттрибутов обновляются удалением и вставкой
     * @param id - id продукта
     * @param dto - основные данные
     * @param attributes - аттрибути
     * @returns {Promise<Product>} обновленный объект 
     */
    async updateProduct(id: number, userId: number, dto: CreateProductDto): Promise<Product> {
        const { attributes, ...product } = dto;

        const result = await this.productRepository.update({ id: id, userId: userId }, product);
        if (result.affected == 0) {
            throw new NotFoundException("Товар не найден");
        }

        await this.valuesRepository.delete({ productId: id });
        await this.addAttributes(id, attributes);
        return this.getProductById(id);
    }

    /**
     * Обновление изображений:
     * 1. Удаление изображение
     * 2. Проверка, если одно из существующих изображений стало главным - меняется флаг по id, если главное изображение
     *    новое, то флаг снимается со всех существующих изображений
     * 3. Добавление новых изображений
     * @param productId - id продукта
     * @param newImages - новые изображение продукта
     * @param deletedImagesId - удаленные изображения, если они есть
     * @param newMainImageId - id нового изображения, если его нету, то главным будет выбрано из новых
     */
    async updateImages(productId: number, userId: number, dto: UpdateImagesDto, newImages?: Express.Multer.File[]) {
        const product = await this.productRepository.findOne({ where: { id: productId, userId: userId }, relations: ["images"] });
        if (!product) {
            throw new NotFoundException("Продукт не найден")
        }

        if (dto.deletedImagesId) {
            const existImageIds = product.images.map(img => img.id)
            if (dto.deletedImagesId.some((id) => !existImageIds.includes(id))) {
                throw new ForbiddenException("Вы не имеет права удалить эти изображения")
            }

            await this.imageRepository.delete({ id: In(dto.deletedImagesId) })
        }

        if (dto.newMainImageId) {
            await this.imageRepository.update({ productId: productId }, { isMain: () => `id = ${dto.newMainImageId}` });
        } else {
            await this.imageRepository.update({ productId: productId }, { isMain: false });
        }

        if (newImages) {
            await this.addImages(productId, newImages, dto.newMainImageId == undefined)
        }

        return this.imageRepository.find({ productId: productId })
    }

    async setBestsellerStatus(productId: number, userId: number) {
        await this.productRepository.update({ id: productId, userId: userId }, { isBestseller: true })
    }

    async deleteProduct(id: number, userId: number) {
        const result = await this.productRepository.delete({ id: id, userId: userId });
        if (result.affected == 0) {
            throw new NotFoundException("Товар не найден");
        }
    }

    async deleteBestsellerStatus(productId: number, userId: number) {
        await this.productRepository.update({ id: productId, userId: userId }, { isBestseller: false })
    }

    //TODO можно оптимизировать
    private async addAttributes(productId: number, attributes: CreateAttributeDto[]) {
        const valuesToInsert: Map<number, string> = new Map();

        // Добавление новых атрибутов
        for (const attribute of attributes) {
            const selectedAttr = await this.attributeRepository.findOne({ name: attribute.name });

            if (!selectedAttr) {
                const result = await this.attributeRepository.insert({ name: attribute.name });
                valuesToInsert.set(result.raw.insertId, attribute.value.name);
            } else {
                valuesToInsert.set(selectedAttr.id, attribute.value.name);
            }
        }

        // Добавление значений аттрибутов
        const values: any[] = [];
        for (const [attributeId, value] of valuesToInsert.entries()) {
            values.push({ productId: productId, attributeId: attributeId, name: value });
        }

        await this.valuesRepository.insert(values);
    }

    /**
     * Создание и добавление ссылок на изображения
     * @param productId - id продукта
     * @param images - изображения, первое изображение считается главным
     * @param isFirstMain - по умолчанию, первое добавляемое изображение всегда главное
     */
    private async addImages(productId: number, images: Express.Multer.File[], isFirstMain: boolean = true) {
        if (images.length == 0) {
            return;
        }

        const productImages = await this.fileService.createFiles(images);
        const newImages = [{ productId: productId, filename: productImages.shift(), isMain: isFirstMain }];
        for (const image of productImages) {
            newImages.push({
                productId: productId,
                filename: image,
                isMain: false
            });
        }

        await this.imageRepository.insert(newImages);
    }
}
