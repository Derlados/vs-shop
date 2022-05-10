import { BadRequestException, Body, ClassSerializerInterceptor, Controller, Delete, Get, Param, Post, Put, UploadedFile, UploadedFiles, UseGuards, UseInterceptors } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { FileFieldsInterceptor, FileInterceptor, FilesInterceptor } from '@nestjs/platform-express';
import { get } from 'http';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';
import { CreateProductDto } from './dto/create-product.dto';
import { ReqCreateProductDto } from './dto/req-create-product.dto';
import { UpdateImagesDto } from './dto/update-images.dto';
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
    @UseGuards(JwtAuthGuard)
    @UseInterceptors(ClassSerializerInterceptor, FilesInterceptor('images'))
    addProduct(@Body() dto: ReqCreateProductDto, @UploadedFiles() images: Express.Multer.File[]) {
        if (!images) {
            throw new BadRequestException("Не загружены изображения");
        }
        return this.productService.createProduct(dto.product, new Map(Object.entries(dto.attributes)), images);
    }

    @Put(':id')
    @UseGuards(JwtAuthGuard)
    @UseInterceptors(ClassSerializerInterceptor)
    updateProduct(@Param('id') id: number, @Body() dto: ReqCreateProductDto) {
        return this.productService.updateProduct(id, dto.product, new Map(Object.entries(dto.attributes)));
    }

    @Put(':id/images')
    @UseGuards(JwtAuthGuard)
    @UseInterceptors(FilesInterceptor('images'))
    updateImages(@Param('id') id: number, @Body() dto: UpdateImagesDto, @UploadedFiles() images: Express.Multer.File[]) {
        return this.productService.updateImages(id, dto, images)
    }

    @Delete(':id')
    @UseGuards(JwtAuthGuard)
    deleteProduct(@Param('id') id: number) {
        return this.productService.deleteProduct(id);
    }
}
