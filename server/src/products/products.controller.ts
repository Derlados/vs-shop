import { BadRequestException, Body, ClassSerializerInterceptor, Controller, Delete, Get, Param, Patch, Post, Put, Query, Req, Request, UploadedFile, UploadedFiles, UseGuards, UseInterceptors } from '@nestjs/common';
import { FileFieldsInterceptor, FileInterceptor, FilesInterceptor } from '@nestjs/platform-express';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';
import { Roles } from 'src/roles/roles.decorator';
import { RoleValues } from 'src/roles/roles.enum';
import { RolesGuard } from 'src/roles/roles.guard';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateImagesDto } from './dto/update-images.dto';
import { FilterOptions, ProductsService } from './products.service';
import { FilterProductsQuery } from './query/filter-products.query';
import { SearchProductsQuery } from './query/search-products.query';

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
    getProductByCategory(@Param('category') categoryId: number, @Query() query: FilterProductsQuery) {
        return this.productService.getProductsByCategory(categoryId, this.parseFiltersQuery(query));
    }

    @Get('search')
    @UseInterceptors(ClassSerializerInterceptor)
    getProductByText(@Query() query: SearchProductsQuery) {
        return this.productService.getProductsByText(query.text);
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

    @Get(':id([0-9]+)')
    @UseInterceptors(ClassSerializerInterceptor)
    getProductInfo(@Param('id') id: number) {
        return this.productService.getProductById(id);
    }

    @Post()
    @Roles(RoleValues.SELLER)
    @UseGuards(JwtAuthGuard, RolesGuard)
    @UseInterceptors(ClassSerializerInterceptor)
    addProduct(@Req() req, @Body() dto: CreateProductDto) {
        return this.productService.createProduct(req.user.userId, dto);
    }

    @Put(':id([0-9]+)')
    @Roles(RoleValues.SELLER)
    @UseGuards(JwtAuthGuard, RolesGuard)
    @UseInterceptors(ClassSerializerInterceptor)
    updateProduct(@Req() req, @Param('id') id: number, @Body() dto: CreateProductDto) {
        return this.productService.updateProduct(id, req.user.userId, dto);
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

    private parseFiltersQuery(filterQuery: FilterProductsQuery): FilterOptions {
        const brands = filterQuery.brands?.map(b => decodeURI(b));
        const filters = new Map<number, number[]>();
        filterQuery.attributes?.forEach(f => {
            const [attrId, value] = f.split('-').map(elem => Number(elem));
            if (!filters.has(attrId)) {
                filters.set(attrId, []);
            }

            filters.get(attrId).push(value);
        })


        return {
            limit: filterQuery.limit ? Number(filterQuery.limit) : null,
            brands: brands,
            priceRange: {
                min: filterQuery.minPrice ? Number(filterQuery.minPrice) : 0,
                max: filterQuery.maxPrice ? Number(filterQuery.maxPrice) : Number.MAX_VALUE
            },
            filters: filterQuery.attributes ? filters : null
        }
    }
}
