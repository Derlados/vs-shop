import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Category } from 'src/category/models/category.model';
import { FilesModule } from 'src/files/files.module';
import { FilesService } from 'src/files/files.service';
import { Attribute } from './models/attribute.model';
import { Image } from './models/image.model';
import { Product } from './models/product.model';
import { Value } from './models/value.model';
import { ProductsController } from './products.controller';
import { ProductsService } from './products.service';

@Module({
    imports: [TypeOrmModule.forFeature([Product, Attribute, Value, Category, Image]), FilesModule],
    controllers: [ProductsController],
    providers: [ProductsService]
})
export class ProductsModule { }
