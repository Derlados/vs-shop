import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ProductsModule } from './products/products.module';
import { UsersModule } from './users/users.module';
import { AuthModule } from './auth/auth.module';
import { Product } from './products/models/product.model';
import { Image } from './products/models/image.model';
import { Attribute } from './products/models/attribute.model';
import { Value } from './products/models/value.model';
import { CategoryModule } from './category/category.module';
import { Category } from './category/category.model';
import { FilesModule } from './files/files.module';

@Module({
    imports: [
        TypeOrmModule.forRoot({
            type: 'mysql',
            host: 'localhost',
            port: 3306,
            username: 'root',
            password: '',
            database: 'victory_shop',
            entities: [Product, Image, Attribute, Value, Category],
            synchronize: true,
        }),
        ProductsModule,
        UsersModule,
        AuthModule,
        CategoryModule,
        FilesModule,
    ],
    controllers: [],
    providers: [],
})
export class AppModule { }
