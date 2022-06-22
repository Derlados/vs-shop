import { BadRequestException, Body, ClassSerializerInterceptor, Controller, Delete, Get, Param, Post, Put, Query, Req, Request, UploadedFile, UploadedFiles, UseGuards, UseInterceptors } from '@nestjs/common';
import { FileFieldsInterceptor, FileInterceptor, FilesInterceptor } from '@nestjs/platform-express';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';
import { Roles } from 'src/roles/roles.decorator';
import { RoleValues } from 'src/roles/roles.enum';
import { RolesGuard } from 'src/roles/roles.guard';
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

    @Get('category=:category([0-9]+)')
    @UseInterceptors(ClassSerializerInterceptor)
    getProductByCategory(@Param('category') categoryId: number) {
        return this.productService.getProductsByCategory(categoryId);
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

    @Get('customer')
    @Roles(RoleValues.SELLER)
    @UseGuards(JwtAuthGuard, RolesGuard)
    @UseInterceptors(ClassSerializerInterceptor)
    getSellerProducts(@Req() req) {
        return this.productService.getProductsBySeller(req.user.userId);
    }

    @Post()
    @Roles(RoleValues.SELLER)
    @UseGuards(JwtAuthGuard, RolesGuard)
    @UseInterceptors(ClassSerializerInterceptor, FilesInterceptor('images'))
    addProduct(@Req() req, @Body() dto: ReqCreateProductDto, @UploadedFiles() images: Express.Multer.File[]) {
        if (!images) {
            throw new BadRequestException("Не загружены изображения");
        }
        return this.productService.createProduct(req.user.userId, dto.product, new Map(Object.entries(dto.attributes)), images);
    }

    @Put(':id([0-9]+)')
    @Roles(RoleValues.SELLER)
    @UseGuards(JwtAuthGuard, RolesGuard)
    @UseInterceptors(ClassSerializerInterceptor)
    updateProduct(@Req() req, @Param('id') id: number, @Body() dto: ReqCreateProductDto) {
        return this.productService.updateProduct(id, req.user.userId, dto.product, new Map(Object.entries(dto.attributes)));
    }

    @Put(':id/images')
    @Roles(RoleValues.SELLER)
    @UseGuards(JwtAuthGuard, RolesGuard)
    @UseInterceptors(FilesInterceptor('images'))
    updateImages(@Req() req, @Param('id') id: number, @Body() dto: UpdateImagesDto, @UploadedFiles() images: Express.Multer.File[]) {
        return this.productService.updateImages(id, req.user.userId, dto, images)
    }

    @Delete(':id([0-9]+)')
    @Roles(RoleValues.SELLER)
    @UseGuards(JwtAuthGuard, RolesGuard)
    deleteProduct(@Req() req, @Param('id') id: number) {
        return this.productService.deleteProduct(id, req.user.userId);
    }
}
