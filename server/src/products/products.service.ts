import { BadRequestException, Injectable, InternalServerErrorException, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { LessThan, MoreThan, Repository } from 'typeorm';
import { CreateProductDto } from './dto/create-product.dto';
import { ReqCreateProductDto } from './dto/req-create-product.dto';
import { Attribute } from './models/attribute.model';
import { Product } from './models/product.model';
import { Value } from './models/value.model';

@Injectable()
export class ProductsService {

    constructor(@InjectRepository(Product) private productRepository: Repository<Product>,
        @InjectRepository(Attribute) private attributeRepository: Repository<Attribute>,
        @InjectRepository(Value) private valuesRepository: Repository<Value>) {

    }

    async getProducts() {
        const products = await this.productRepository.find({ relations: ["values", "values.attribute"] });
        return products;
    }

    async getProductById(id: number) {
        const product = await this.productRepository.findOne({ where: { id: id }, relations: ["values", "values.attribute"] });
        if (!product) {
            throw new NotFoundException("Товар не найден");
        }

        return product;
    }

    async createProduct(dto: CreateProductDto, attributes: Map<string, string>) {
        try {
            const result = await this.productRepository.insert(dto);
            const insertId = result.raw.insertId;
            await this.addAttributes(insertId, attributes);

            return this.getProductById(insertId);
        } catch (e) {
            throw new InternalServerErrorException();
        }
    }

    async updateProduct(id: number, dto: CreateProductDto, attributes: Map<string, string>) {
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
