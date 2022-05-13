import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import e from 'express';
import { Product } from 'src/products/models/product.model';
import { Between, In, LessThan, Repository } from 'typeorm';
import { CompleteOrdersDto } from './dto/complete-orders.dto';
import { CreateOrderDto } from './dto/create-order.dto';
import { OrderProductDto } from './dto/order-product.dto';
import { OrderProduct } from './models/order-products.model';
import { Order } from './models/order.model';

@Injectable()
export class OrderService {
    constructor(@InjectRepository(Order) private orderRepository: Repository<Order>,
        @InjectRepository(OrderProduct) private orderProductsRepository: Repository<OrderProduct>,
        @InjectRepository(Product) private productsRepository: Repository<Product>) {

    }

    async getOrderById(id: number) {
        return this.orderRepository.find({ where: { id: id }, relations: ["orderProducts"] });
    }

    async getOrders(startDate?: Date, endDate?: Date) {
        if (!startDate || !endDate) {
            return this.orderRepository.find({ relations: ["orderProducts"] });
        } else {
            return this.orderRepository.find({ where: { createdAt: Between(startDate, endDate) }, relations: ["orderProducts"] })
        }
    }

    async createOrder(dto: CreateOrderDto) {
        const insertId = (await this.orderRepository.insert({ ...dto, orderProducts: [] })).raw.insertId;
        await this.addOrderProducts(insertId, dto.orderProducts);
        return this.getOrderById(insertId);
    }

    async completeOrders(dto: CompleteOrdersDto) {
        try {
            await this.orderRepository.update({ id: In(dto.orderIds) }, { isComplete: true });
        } catch (e) {
            throw new NotFoundException("Заказ не найден")
        }
    }

    async deleteOrders(orderIds: number[]) {
        this.orderRepository.delete({ id: In(orderIds) });
        //TODO
    }

    private async addOrderProducts(orderId: number, orderProducts: OrderProductDto[]) {
        const orderisValid = await this.validateOrderProducts(orderProducts);
        if (!orderisValid) {
            throw new NotFoundException("Данный заказ невозможно выполнить. Нету необходимого товара")
        }

        const products: any[] = [];
        for (const orderProduct of orderProducts) {
            products.push({
                orderId: orderId,
                productId: orderProduct.id,
                count: orderProduct.count
            })
            await this.productsRepository.update({ id: orderProduct.id }, { count: () => `count - ${orderProduct.count}` })
        }

        return this.orderProductsRepository.insert(products);
    }

    private async validateOrderProducts(orderProducts: OrderProductDto[]) {
        const products = await this.productsRepository.find({ id: In(orderProducts.map(op => op.id)) })
        if (products.length != orderProducts.length) {
            return false;
        }

        for (const product of products) {
            if (orderProducts.find(op => op.id == product.id).count > product.count) {
                return false
            }
        }

        return true;
    }
}
