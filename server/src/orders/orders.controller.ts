import { Body, ClassSerializerInterceptor, Controller, Delete, Get, Param, Post, Put, Query, UseGuards, UseInterceptors } from '@nestjs/common';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';
import { Roles } from 'src/roles/roles.decorator';
import { RoleValues } from 'src/roles/roles.enum';
import { RolesGuard } from 'src/roles/roles.guard';
import { ChangeStatusDto } from './dto/change-status-order.dto';
import { CreateOrderDto } from './dto/create-order.dto';
import { OrderService } from './orders.service';

@Controller('orders')
export class OrderController {

    constructor(private ordersService: OrderService) { }

    @Get([
        'page=:page;date-period=:startDate,:endDate',
        'date-period=:startDate,:endDate',
        'page=:page',
        'page=:page;date-period=:startDate,:endDate/search',
        'date-period=:startDate,:endDate/search',
        'page=:page/search',
        ''
    ])
    @Roles(RoleValues.SELLER)
    @UseGuards(JwtAuthGuard, RolesGuard)
    @UseInterceptors(ClassSerializerInterceptor)
    getOrders(@Param('startDate') startDate?: Date, @Param('endDate') endDate?: Date, @Param('page') page?: number, @Query('text') searchText?: string) {
        return this.ordersService.getOrders(page, startDate, endDate, searchText);
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

    @Put(':id/complete')
    @Roles(RoleValues.SELLER)
    @UseGuards(JwtAuthGuard, RolesGuard)
    changeStatus(@Param('id') id: number, @Body() dto: ChangeStatusDto) {
        return this.ordersService.changeStatus(id, dto);
    }


    @Delete(':id')
    @Roles(RoleValues.SELLER)
    @UseGuards(JwtAuthGuard, RolesGuard)
    deleteOrder(@Param('id') id: number) {
        this.ordersService.deleteOrders([id]);
    }
}
