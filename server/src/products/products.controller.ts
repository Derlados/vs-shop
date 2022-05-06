import { Body, ClassSerializerInterceptor, Controller, Delete, Get, Param, Post, Put, UseInterceptors } from '@nestjs/common';
import { get } from 'http';
import { CreateProductDto } from './dto/create-product.dto';
import { ReqCreateProductDto } from './dto/req-create-product.dto';
import { ProductsService } from './products.service';

@Controller('products')
export class ProductsController {
    constructor(private productService: ProductsService) { }

    @Get()
    @UseInterceptors(ClassSerializerInterceptor)
    getProductList() {
        return this.productService.getProducts();
    }

    @Get('category=:category([a-z]+|[0-9]+)')
    @UseInterceptors(ClassSerializerInterceptor)
    getProductByCategory(@Param('category') category: string) {
        return this.productService.getProductsByCategory(category);
    }

    @Get('filter')
    @UseInterceptors(ClassSerializerInterceptor)
    getFilteredProducts() {
        return this.productService.getFilteredProducts(new Map());
    }

    @Get(':id([0-9]+)')
    @UseInterceptors(ClassSerializerInterceptor)
    getProductInfo(@Param('id') id: number) {
        return this.productService.getProductById(id);
    }

    @Post()
    @UseInterceptors(ClassSerializerInterceptor)
    addProduct(@Body() dto: ReqCreateProductDto) {
        return this.productService.createProduct(dto.product, new Map(Object.entries(dto.attributes)));
    }

    @Put(':id')
    @UseInterceptors(ClassSerializerInterceptor)
    updateProduct(@Param('id') id: number, @Body() dto: ReqCreateProductDto) {
        return this.productService.updateProduct(id, dto.product, new Map(Object.entries(dto.attributes)));
    }

    @Delete(':id')
    deleteProduct(@Param('id') id: number) {
        return this.productService.deleteProduct(id);
    }
}
