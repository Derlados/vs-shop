import { Injectable, InternalServerErrorException, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { FilesService } from 'src/files/files.service';
import { In, Repository } from 'typeorm';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateImagesDto } from './dto/update-images.dto';
import { Attribute } from './models/attribute.model';
import { Image } from './models/image.model';
import { Product } from './models/product.model';
import { Value } from './models/value.model';

// ЗАМЕТКА
// const products = await this.productRepository.createQueryBuilder("product")
//     .innerJoinAndSelect("product.category", "category")
//     .innerJoinAndSelect("product.values", "values")
//     .innerJoinAndSelect("values.attribute", "attributes")
//     .where("attributes.attribute IN ('attr2', 'attr1')")
//     .getMany();


@Injectable()
export class ProductsService {

    constructor(@InjectRepository(Product) private productRepository: Repository<Product>,
        @InjectRepository(Attribute) private attributeRepository: Repository<Attribute>,
        @InjectRepository(Value) private valuesRepository: Repository<Value>,
        @InjectRepository(Image) private imageRepository: Repository<Image>,
        private fileService: FilesService) {

    }

    async getProducts(): Promise<Product[]> {
        const products = await this.productRepository.find({ relations: ["values", "values.attribute"] });
        return products;
    }

    async getProductById(id: number): Promise<Product> {
        const product = await this.productRepository.findOne({ where: { id: id }, relations: ["values", "values.attribute"] });
        if (!product) {
            throw new NotFoundException("Товар не найден");
        }

        return product;
    }

    async getProductsByCategory(category: string) {
        return this.productRepository.find({ where: { category: { routeName: category } }, relations: ["category", "values", "values.attribute"] });
    }

    /** TODO: Если работа на клиенте будет неоптимальной - фильтровать будет сервер */
    async getFilteredProducts(attributes: Map<string, string[]>) {
        attributes = new Map([
            ["attr1", ["val1", "val3", "val4"]],
            ["attr2", ["val1", "val3", "val4"]],
        ])

        const products = this.productRepository.find({ relations: ["category", "values", "values.attribute"] });


        return products;
    }

    async createProduct(dto: CreateProductDto, attributes: Map<string, string>, images: Express.Multer.File[]): Promise<Product> {
        try {
            const result = await this.productRepository.insert(dto);
            const insertId = result.raw.insertId;

            await this.addAttributes(insertId, attributes);
            await this.addImages(insertId, images);

            return this.getProductById(insertId);
        } catch (e) {
            throw new InternalServerErrorException(e);
        }
    }


    /**
     * Обновление продукта. Основные данные обновляются, а значени аттрибутов обновляются удалением и вставкой
     * @param id - id продукта
     * @param dto - основные данные
     * @param attributes - аттрибути
     * @returns {Promise<Product>} обновленный объект 
     */
    async updateProduct(id: number, dto: CreateProductDto, attributes: Map<string, string>): Promise<Product> {
        const result = await this.productRepository.update({ id: id }, dto);
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
    async updateImages(productId: number, dto: UpdateImagesDto, newImages?: Express.Multer.File[]) {
        if (dto.deletedImagesId) {
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

    async deleteProduct(id: number) {
        const result = await this.productRepository.delete({ id: id });
        if (result.affected == 0) {
            throw new NotFoundException("Товар не найден");
        }
    }

    private async addAttributes(productId: number, attributes: Map<string, string>) {
        const valuesToInsert: Map<number, string> = new Map();

        // Добавление новых атрибутов
        for (const [attribute, value] of attributes.entries()) {
            const selectedAttr = await this.attributeRepository.findOne({ attribute: attribute });

            if (!selectedAttr) {
                const result = await this.attributeRepository.insert({ attribute: attribute });
                valuesToInsert.set(result.raw.insertId, value);
            } else {
                valuesToInsert.set(selectedAttr.id, value);
            }
        }

        // Добавление значений аттрибутов
        const values: any[] = [];
        for (const [attributeId, value] of valuesToInsert.entries()) {
            values.push({ productId: productId, attributeId: attributeId, value: value });
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
        const newImages = [{ productId: productId, name: productImages[0], isMain: isFirstMain }];
        for (const image of productImages.slice(0, -1)) {
            newImages.push({
                productId: productId,
                name: image,
                isMain: false
            });
        }

        await this.imageRepository.insert(newImages);
    }
}
