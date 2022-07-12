import { Body, ClassSerializerInterceptor, Controller, Delete, Get, Param, Post, Put, Req, UseGuards, UseInterceptors } from '@nestjs/common';
import { Request } from 'express';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';
import { Roles } from 'src/roles/roles.decorator';
import { RoleValues } from 'src/roles/roles.enum';
import { RolesGuard } from 'src/roles/roles.guard';
import { CreateCartItemDto } from './dto/create-cart-item.dto';
import { SessionCartService } from './session-cart.service';

@Controller('session-cart')
export class SessionCartController {

    constructor(private sessionCartService: SessionCartService) { }

    @Get('/:id')
    @UseInterceptors(ClassSerializerInterceptor)
    getCart(@Param('id') id: number) {
        return this.sessionCartService.getCartProducts(id);
    }

    @Post()
    createCart() {
        return this.sessionCartService.createCart();
    }

    @Post('/:id/products')
    @UseInterceptors(ClassSerializerInterceptor)
    addProduct(@Param('id') id: number, @Body() dto: CreateCartItemDto) {
        return this.sessionCartService.addProduct(id, dto);
    }

    @Put('/:id/products')
    @UseInterceptors(ClassSerializerInterceptor)
    editProduct(@Param('id') id: number, @Body() dto: CreateCartItemDto) {
        return this.sessionCartService.editProduct(id, dto.productId, dto);
    }

    @Delete('/:id/products/:productId([0-9]+)')
    deleteProduct(@Param('id') id: number, @Param('productId') productId: number) {
        return this.sessionCartService.deleteProduct(id, productId);
    }

    @Delete('/:id/products/clear')
    clearCart(@Param('id') id: number) {
        return this.sessionCartService.clearCart(id);
    }

    @Delete('/old-sessions')
    @Roles(RoleValues.ADMIN)
    @UseGuards(JwtAuthGuard, RolesGuard)
    deleteOldCarts() {
        return this.sessionCartService.deleteOldCarts();
    }
}
