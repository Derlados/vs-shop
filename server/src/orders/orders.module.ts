import { Module } from '@nestjs/common';
import { OrderService } from './orders.service';
import { OrderController } from './orders.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Order } from './models/order.model';
import { OrderProduct } from './models/order-products.model';
import { Product } from 'src/products/models/product.model';

@Module({
    imports: [TypeOrmModule.forFeature([Order, OrderProduct, Product])],
    providers: [OrderService],
    controllers: [OrderController]
})
export class OrderModule { }
