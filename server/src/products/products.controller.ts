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
    getProductList(@Req() req) {
        return this.productService.getProducts();
    }

    @Get('category=:category([0-9]+)')
    @UseInterceptors(ClassSerializerInterceptor)
    getProductByCategory(@Param('category') categoryId: number) {
        return this.productService.getProductsByCategory(categoryId);
    }

    @Get('bestsellers')
    @UseInterceptors(ClassSerializerInterceptor)
    getBestsellers() {
        return this.productService.getBestsellers();
    }

    @Get('new')
    @UseInterceptors(ClassSerializerInterceptor)
    getNewProducts() {
        return this.productService.getNewProducts();
    }

    @Get(':id([0-9]+)/count')
    @Roles(RoleValues.SELLER)
    @UseGuards(JwtAuthGuard, RolesGuard)
    @UseInterceptors(ClassSerializerInterceptor)
    getAvailableCount(@Req() req, @Param('id') id: number) {
        return this.productService.getProductCount(req.user.userId, id);
    }

    // @Get('filter')
    // @UseInterceptors(ClassSerializerInterceptor)
    // getFilteredProducts() {
    //     return this.productService.getFilteredProducts(new Map());
    // }

    @Get(':id([0-9]+)')
    @UseInterceptors(ClassSerializerInterceptor)
    getProductInfo(@Param('id') id: number) {
        return this.productService.getProductById(id);
    }

    @Post()
    @Roles(RoleValues.SELLER)
    @UseGuards(JwtAuthGuard, RolesGuard)
    @UseInterceptors(ClassSerializerInterceptor)
    addProduct(@Req() req, @Body() dto: ReqCreateProductDto) {
        return this.productService.createProduct(req.user.userId, dto.product, new Map(Object.entries(dto.attributes)));
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
        dto.deletedImagesId?.map((id, index) => dto.deletedImagesId[index] = Number(id));
        return this.productService.updateImages(id, req.user.userId, dto, images)
    }

    @Put(':id([0-9]+)/bestseller')
    @Roles(RoleValues.SELLER)
    @UseGuards(JwtAuthGuard, RolesGuard)
    setBestsellerStatus(@Req() req, @Param('id') id: number) {
        return this.productService.setBestsellerStatus(id, req.user.userId);
    }

    @Delete(':id([0-9]+)')
    @Roles(RoleValues.SELLER)
    @UseGuards(JwtAuthGuard, RolesGuard)
    deleteProduct(@Req() req, @Param('id') id: number) {
        return this.productService.deleteProduct(id, req.user.userId);
    }

    @Delete(':id([0-9]+)/bestseller')
    @Roles(RoleValues.SELLER)
    @UseGuards(JwtAuthGuard, RolesGuard)
    deleteBestsellerStatus(@Req() req, @Param('id') id: number) {
        return this.productService.deleteBestsellerStatus(id, req.user.userId);
    }
}
