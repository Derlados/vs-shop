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
import { Category } from './category/models/category.model';
import { FilesModule } from './files/files.module';
import { ServeStaticModule } from '@nestjs/serve-static';
import { join } from 'path';
import { ConfigModule } from '@nestjs/config';
import { User } from './users/models/user.model';
import { Filter } from './category/models/filter.model';
import { OrderModule } from './orders/orders.module';
import { Order } from './orders/models/order.model';
import { OrderProduct } from './orders/models/order-products.model';
import { RolesModule } from './roles/roles.module';
import { Role } from './roles/models/role.model';
import { SessionCartModule } from './session-cart/session-cart.module';
import { SessionCart } from './session-cart/model/session-cart.model';
import { SessionCartItem } from './session-cart/model/session-cart-item.model';
import { PaymentsModule } from './payments/payments.module';
import { Payment } from './payments/models/payment.model';
import { ShopModule } from './shop/shop.module';
import { ShopInfo } from './shop/model/shop-info.model';
import { Banner } from './shop/model/banner.model';
import { CatalogsModule } from './catalogs/catalogs.module';
import { Catalog } from './catalogs/models/catalog.model';

@Module({
    imports: [
        ConfigModule.forRoot({
            isGlobal: true,
            envFilePath: `.${process.env.NODE_ENV}.env`
        }),
        TypeOrmModule.forRoot({
            type: 'mysql',
            host: process.env.DB_HOST,
            port: Number(process.env.DB_PORT),
            username: process.env.DB_USER,
            password: process.env.DB_PASSWORD,
            database: process.env.DATABASE,
            entities: [Product, Image, Attribute, Value, Catalog, Category, User, Filter, Order, OrderProduct, Role, SessionCart, SessionCartItem, Payment, ShopInfo, Banner],
            synchronize: true,
        }),
        ServeStaticModule.forRoot({
            rootPath: join(__dirname, '..', 'static'),
            serveRoot: '/images'
        }),
        // ServeStaticModule.forRoot({
        //     rootPath: join(__dirname, '..', 'client'),
        // }),
        ProductsModule,
        UsersModule,
        AuthModule,
        CategoryModule,
        FilesModule,
        OrderModule,
        RolesModule,
        SessionCartModule,
        PaymentsModule,
        ShopModule,
        CatalogsModule,
    ],
    controllers: [],
    providers: [],
})
export class AppModule { }
