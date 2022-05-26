import { Body, Controller, Delete, Get, Param, Post, Put, Query, UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';
import { Roles } from 'src/roles/roles.decorator';
import { RoleValues } from 'src/roles/roles.enum';
import { RolesGuard } from 'src/roles/roles.guard';
import { CompleteOrdersDto } from './dto/complete-orders.dto';
import { CreateOrderDto } from './dto/create-order.dto';
import { OrderService } from './orders.service';

@Controller('orders')
export class OrderController {

    constructor(private ordersService: OrderService) { }

    @Get()
    @Roles(RoleValues.SELLER)
    @UseGuards(JwtAuthGuard, RolesGuard)
    getOrders(@Query('startDate') startDate: Date, @Query('endDate') endDate: Date) {
        return this.ordersService.getOrders(startDate, endDate);
    }

    @Get('/:id')
    @Roles(RoleValues.SELLER)
    @UseGuards(JwtAuthGuard, RolesGuard)
    getOrder(@Param('id') id: number) {
        return this.ordersService.getOrderById(id);
    }

    @Post()
    addOrder(@Body() dto: CreateOrderDto) {
        return this.ordersService.createOrder(dto);
    }

    @Put('/complete')
    @Roles(RoleValues.SELLER)
    @UseGuards(JwtAuthGuard, RolesGuard)
    competeOrders(@Body() dto: CompleteOrdersDto) {
        return this.ordersService.completeOrders(dto);
    }

    //TODO
    @Put(':id')
    @Roles(RoleValues.SELLER)
    @UseGuards(JwtAuthGuard, RolesGuard)
    editOrder(@Param('id') id: number) {
        // this.ordersService.deleteOrders([id]);
    }

    @Delete(':id')
    @Roles(RoleValues.SELLER)
    @UseGuards(JwtAuthGuard, RolesGuard)
    deleteOrder(@Param('id') id: number) {
        this.ordersService.deleteOrders([id]);
    }
}
