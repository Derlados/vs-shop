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
import { ServeStaticModule } from '@nestjs/serve-static';
import { join } from 'path';
import { ConfigModule } from '@nestjs/config';
import { User } from './users/user.model';

@Module({
    imports: [
        ConfigModule.forRoot({
            envFilePath: `${process.env.NODE_ENV}.env`
        }),
        TypeOrmModule.forRoot({
            type: 'mysql',
            host: process.env.DB_HOST,
            port: 3306,
            username: process.env.DB_USER,
            password: process.env.DB_PASSWORD,
            database: 'victory_shop',
            entities: [Product, Image, Attribute, Value, Category, User],
            synchronize: true,
        }),
        ServeStaticModule.forRoot({
            rootPath: join(__dirname, 'static'),
            serveRoot: '/static'
        }),
        // ServeStaticModule.forRoot({
        //     rootPath: join(__dirname, 'client'),
        // }),
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
