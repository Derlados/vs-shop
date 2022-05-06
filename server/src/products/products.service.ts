import { Injectable, InternalServerErrorException, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateProductDto } from './dto/create-product.dto';
import { Attribute } from './models/attribute.model';
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
        @InjectRepository(Value) private valuesRepository: Repository<Value>) {

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

    async createProduct(dto: CreateProductDto, attributes: Map<string, string>): Promise<Product> {
        try {
            const result = await this.productRepository.insert(dto);
            const insertId = result.raw.insertId;
            await this.addAttributes(insertId, attributes);

            return this.getProductById(insertId);
        } catch (e) {
            throw new InternalServerErrorException();
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

        await this.valuesRepository.createQueryBuilder()
            .insert()
            .values([...values])
            .execute();
    }
}
