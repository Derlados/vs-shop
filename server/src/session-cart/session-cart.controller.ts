import { Body, Controller, Delete, Get, Param, Post, Put, UseGuards } from '@nestjs/common';
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
    getCart(@Param('id') id: number) {
        return this.sessionCartService.getCartProducts(id);
    }

    @Post('/new-cart')
    createCart() {
        return this.sessionCartService.createCart();
    }

    @Post('/:id/products')
    addProduct(@Param('id') id: number, @Body() dto: CreateCartItemDto) {
        return this.sessionCartService.addProduct(id, dto);
    }

    @Put('/:id/products')
    editProduct(@Param('id') id: number, @Body() dto: CreateCartItemDto) {
        return this.sessionCartService.editProduct(id, dto.productId, dto);
    }

    @Delete('/:id/products/:productId([0-9]+)')
    deleteProduct(@Param('id') id: number, @Param('productId') productId: number) {
        return this.deleteProduct(id, productId);
    }

    @Delete('/old-sessions')
    @Roles(RoleValues.ADMIN)
    @UseGuards(JwtAuthGuard, RolesGuard)
    deleteOldCarts() {
        return this.sessionCartService.deleteOldCarts();
    }
}
