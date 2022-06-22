import { BadRequestException, Body, ClassSerializerInterceptor, Controller, Delete, Get, Param, Post, Put, UploadedFile, UseGuards, UseInterceptors } from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { validate } from 'class-validator';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';
import { Roles } from 'src/roles/roles.decorator';
import { RoleValues } from 'src/roles/roles.enum';
import { RolesGuard } from 'src/roles/roles.guard';
import { CategoryService } from './category.service';
import { CreateCategoryDto } from './dto/create-category.dto';

@Controller('categories')
export class CategoryController {
    constructor(private categoryService: CategoryService) { }

    @Get()
    @UseInterceptors(ClassSerializerInterceptor)
    getAllCategories() {
        return this.categoryService.getCategories();
    }

    @Get('/category=:category')
    @UseInterceptors(ClassSerializerInterceptor)
    getCategoryByName(@Param('category') categoryName: string) {
        return this.categoryService.getCategoryByRoute(categoryName);
    }

    @Get(':id/filters')
    @UseInterceptors(ClassSerializerInterceptor)
    getCategoryFilters(@Param('id') id: number) {
        return this.categoryService.getCategoryFilters(id);
    }

    @Post()
    @Roles(RoleValues.ADMIN)
    @UseGuards(JwtAuthGuard, RolesGuard)
    addCategory(@Body() dto: CreateCategoryDto) {
        return this.categoryService.addCategory(dto);
    }

    @Put(':id([0-9]+)/image')
    @Roles(RoleValues.ADMIN)
    @UseGuards(JwtAuthGuard, RolesGuard)
    @UseInterceptors(ClassSerializerInterceptor, FileInterceptor('image'))
    editImage(@Param('id') id: number, @UploadedFile() image: Express.Multer.File) {
        return this.categoryService.editImage(id, image);
    }

    @Put(':id([0-9]+)')
    @Roles(RoleValues.ADMIN)
    @UseGuards(JwtAuthGuard, RolesGuard)
    editCategory(@Param('id') id: number, @Body() dto: CreateCategoryDto) {
        return this.categoryService.editCategory(id, dto);
    }

    @Delete(':id([0-9]+)')
    @Roles(RoleValues.ADMIN)
    @UseGuards(JwtAuthGuard, RolesGuard)
    deleteCategory(@Param('id') id: number) {
        return this.categoryService.deleteCategory(id);
    }
}
