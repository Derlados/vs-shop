import { Body, Controller, Delete, Get, Param, Post, Put, Query } from '@nestjs/common';
import { CompleteOrdersDto } from './dto/complete-orders.dto';
import { CreateOrderDto } from './dto/create-order.dto';
import { OrderService } from './orders.service';

@Controller('order')
export class OrderController {

    constructor(private ordersService: OrderService) { }

    @Get()
    getOrders(@Query('startDate') startDate: Date, @Query('endDate') endDate: Date) {
        return this.ordersService.getOrders(startDate, endDate);
    }

    @Get('/:id')
    getOrder(@Param('id') id: number) {
        return this.ordersService.getOrderById(id);
    }

    @Post()
    addOrder(@Body() dto: CreateOrderDto) {
        return this.ordersService.createOrder(dto);
    }

    @Put()
    competeOrders(@Body() dto: CompleteOrdersDto) {
        return this.ordersService.completeOrders(dto);
    }

    @Put(':id')
    editOrder() {

    }

    @Delete(':id')
    deleteOrder(@Param('id') id: number) {
        this.ordersService.deleteOrder(id);
    }
}
