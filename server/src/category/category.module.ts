import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CategoryController } from './category.controller';
import { Category } from './models/category.model';
import { CategoryService } from './category.service';
import { Attribute } from 'src/products/models/attribute.model';
import { Filter } from './models/filter.model';
import { FilesModule } from 'src/files/files.module';
import { ProductsModule } from 'src/products/products.module';

@Module({
    imports: [TypeOrmModule.forFeature([Category, Attribute, Filter]), FilesModule, ProductsModule],
    controllers: [CategoryController],
    providers: [CategoryService]
})
export class CategoryModule { }
