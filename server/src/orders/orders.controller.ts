import { Body, ClassSerializerInterceptor, Controller, Delete, Get, Param, Post, Put, Query, UseGuards, UseInterceptors } from '@nestjs/common';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';
import { OrderSorts } from 'src/constants/OrderSrots';
import { Roles } from 'src/roles/roles.decorator';
import { RoleValues } from 'src/roles/roles.enum';
import { RolesGuard } from 'src/roles/roles.guard';
import { ChangeStatusDto } from './dto/change-status-order.dto';
import { CreateOrderDto } from './dto/create-order.dto';
import { EditSelectedOrdersDto } from './dto/edit-selected-orders.dto';
import { GetOrdersQuery } from './dto/get-orders-query.dto';
import { OrderService } from './orders.service';

@Controller('orders')
export class OrderController {

    constructor(private ordersService: OrderService) { }

    @Get()
    @Roles(RoleValues.SELLER)
    @UseGuards(JwtAuthGuard, RolesGuard)
    @UseInterceptors(ClassSerializerInterceptor)
    getOrders(@Query() query: GetOrdersQuery) {
        if (query.search) {
            query.search = decodeURI(query.search);
        }

        return this.ordersService.getOrders(query);
    }


    @Get(':id')
    @Roles(RoleValues.SELLER)
    @UseGuards(JwtAuthGuard, RolesGuard)
    getOrder(@Param('id') id: number) {
        return this.ordersService.getOrderById(id);
    }

    @Post()
    addOrder(@Body() dto: CreateOrderDto) {
        return this.ordersService.createOrder(dto);
    }

    @Put()
    @Roles(RoleValues.SELLER)
    @UseGuards(JwtAuthGuard, RolesGuard)
    editSelectedOrders(@Body() dto: EditSelectedOrdersDto) {
        if (dto.toDeleteIds) {
            return this.ordersService.deleteOrders(dto.toDeleteIds)
        }
    }

    @Put(':id/status')
    @Roles(RoleValues.SELLER)
    @UseGuards(JwtAuthGuard, RolesGuard)
    changeStatus(@Param('id') id: number, @Body() dto: ChangeStatusDto) {
        return this.ordersService.changeStatus(id, dto);
    }
}
