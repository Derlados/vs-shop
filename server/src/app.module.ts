import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ProductsModule } from './products/products.module';
import { UsersModule } from './users/users.module';
import { AuthModule } from './auth/auth.module';
import { Product } from './products/models/product.model';
import { Image } from './products/models/image.model';
import { Attribute } from './products/models/attribute.model';
import { Value } from './products/models/value.model';

@Module({
    imports: [
        TypeOrmModule.forRoot({
            type: 'mysql',
            host: 'localhost',
            port: 3306,
            username: 'root',
            password: '',
            database: 'victory_shop',
            entities: [Product, Image, Attribute, Value],
            synchronize: true,
        }),
        ProductsModule,
        UsersModule,
        AuthModule,
    ],
    controllers: [],
    providers: [],
})
export class AppModule { }
