import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Attribute } from './models/attribute.model';
import { Product } from './models/product.model';
import { Value } from './models/value.model';
import { ProductsController } from './products.controller';
import { ProductsService } from './products.service';

@Module({
    imports: [TypeOrmModule.forFeature([Product, Attribute, Value])],
    controllers: [ProductsController],
    providers: [ProductsService]
})
export class ProductsModule { }
