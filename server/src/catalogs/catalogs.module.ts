import { Module } from '@nestjs/common';
import { CatalogsService } from './catalogs.service';
import { CatalogsController } from './catalogs.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Category } from 'src/category/models/category.model';
import { Catalog } from './models/catalog.model';

@Module({
    imports: [TypeOrmModule.forFeature([Catalog, Category])],
    providers: [CatalogsService],
    controllers: [CatalogsController]
})
export class CatalogsModule { }
