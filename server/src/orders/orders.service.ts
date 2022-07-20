import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { OrderSorts } from 'src/constants/OrderSrots';
import { PageElements } from 'src/lib/types/PageElements';
import { Product } from 'src/products/models/product.model';
import { Between, FindConditions, In, LessThanOrEqual, Like, MoreThanOrEqual, Raw, Repository } from 'typeorm';
import { ChangeStatusDto } from './dto/change-status-order.dto';
import { CreateOrderDto } from './dto/create-order.dto';
import { GetOrdersQuery } from './dto/get-orders-query.dto';
import { OrderProductDto } from './dto/order-product.dto';
import { OrderProduct } from './models/order-products.model';
import { Order } from './models/order.model';

@Injectable()
export class OrderService {
    private readonly ITEMS_PER_PAGE = 7;

    constructor(@InjectRepository(Order) private orderRepository: Repository<Order>,
        @InjectRepository(OrderProduct) private orderProductsRepository: Repository<OrderProduct>,
        @InjectRepository(Product) private productsRepository: Repository<Product>) {

    }

    async getOrderById(id: number) {
        return this.orderRepository.find({ where: { id: id }, relations: ["orderProducts"] });
    }

    async getOrders(query: GetOrdersQuery): Promise<PageElements<Order>> {
        let whereOrStatements: FindConditions<Order>[] = [];
        let whereAndStatement: FindConditions<Order> = {};

        if (query.startDate && query.endDate) {
            // Необходимо брать для последнего дня полночь следующего за ним
            const nextEndDate = new Date(query.endDate);
            nextEndDate.setDate(nextEndDate.getDate() + 1)

            whereAndStatement.createdAt = Between(query.startDate, nextEndDate)
        }

        if (query.search) {
            whereOrStatements.push({ address: Like(`%${query.search}%`) });
            whereOrStatements.push({ client: Like(`%${query.search}%`) });
            whereOrStatements.push({ email: Like(`%${query.search}%`) });
            whereOrStatements.push({ phone: Like(`%${query.search}%`) });
            // whereStatement.payment = { method: Like(`%${query.search}%`) };
        }

        const whereStatement = whereOrStatements.length !== 0 ? whereOrStatements.map(w => { return { ...w, ...whereAndStatement } }) : whereAndStatement;

        let orderStatement = {};
        if (query.sort) {
            switch (query.sort) {
                case OrderSorts.DATE_ASC:
                    orderStatement = { createdAt: 'ASC' }
                    break;
                case OrderSorts.DATE_DESC:
                    orderStatement = { createdAt: 'DESC' }
                    break;
                case OrderSorts.PRICE_ASC:
                    orderStatement = { totalPrice: 'ASC' }
                    break;
                case OrderSorts.PRICE_DESC:
                    orderStatement = { totalPrice: 'DESC' }
                    break;
            }
        }

        const selectedPage = query.page ?? 1;

        const ordersPromise = this.orderRepository.find({
            where: whereStatement,
            order: orderStatement,
            take: this.ITEMS_PER_PAGE,
            skip: this.ITEMS_PER_PAGE * (selectedPage - 1),
            relations: ["orderProducts", "payment", "orderProducts.product"]
        })
        const countPromise = this.orderRepository.count({ where: whereOrStatements, order: orderStatement })

        const [orders, count] = [await ordersPromise, await countPromise];
        const maxPages = count % this.ITEMS_PER_PAGE == 0 ? count / this.ITEMS_PER_PAGE : Math.floor(count / this.ITEMS_PER_PAGE) + 1;

        return {
            elements: orders,
            maxElements: count,
            currentPage: selectedPage,
            maxPages: maxPages
        }
    }

    async createOrder(dto: CreateOrderDto) {
        const { payment, ...order } = dto;
        const insertId = (await this.orderRepository.insert({ ...order, paymentId: payment.id, orderProducts: [] })).raw.insertId;
        await this.addOrderProducts(insertId, dto.orderProducts);
        return this.getOrderById(insertId);
    }

    async changeStatus(id: number, dto: ChangeStatusDto) {
        try {
            await this.orderRepository.update({ id: id }, { status: dto.newStatus });
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
