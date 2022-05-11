import { Body, Controller, Delete, Get, Param, Post, Put, Query, UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';
import { Roles } from 'src/roles/roles.decorator';
import { RoleValue } from 'src/roles/roles.enum';
import { RolesGuard } from 'src/roles/roles.guard';
import { CompleteOrdersDto } from './dto/complete-orders.dto';
import { CreateOrderDto } from './dto/create-order.dto';
import { OrderService } from './orders.service';

@Controller('order')
export class OrderController {

    constructor(private ordersService: OrderService) { }

    @Get()
    @Roles(RoleValue.CUSTOMER)
    @UseGuards(JwtAuthGuard, RolesGuard)
    getOrders(@Query('startDate') startDate: Date, @Query('endDate') endDate: Date) {
        return this.ordersService.getOrders(startDate, endDate);
    }

    @Get('/:id')
    @Roles(RoleValue.CUSTOMER)
    @UseGuards(JwtAuthGuard, RolesGuard)
    getOrder(@Param('id') id: number) {
        return this.ordersService.getOrderById(id);
    }

    @Post()
    addOrder(@Body() dto: CreateOrderDto) {
        return this.ordersService.createOrder(dto);
    }

    @Put()
    @Roles(RoleValue.CUSTOMER)
    @UseGuards(JwtAuthGuard, RolesGuard)
    competeOrders(@Body() dto: CompleteOrdersDto) {
        return this.ordersService.completeOrders(dto);
    }

    //TODO
    @Put(':id')
    @Roles(RoleValue.CUSTOMER)
    @UseGuards(JwtAuthGuard, RolesGuard)
    editOrder() {

    }

    @Delete(':id')
    @Roles(RoleValue.CUSTOMER)
    @UseGuards(JwtAuthGuard, RolesGuard)
    deleteOrder(@Param('id') id: number) {
        this.ordersService.deleteOrder(id);
    }
}
