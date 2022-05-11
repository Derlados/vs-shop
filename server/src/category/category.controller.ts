import { Body, ClassSerializerInterceptor, Controller, Get, Param, Post, Put, UseGuards, UseInterceptors } from '@nestjs/common';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';
import { Roles } from 'src/roles/roles.decorator';
import { RoleValue } from 'src/roles/roles.enum';
import { RolesGuard } from 'src/roles/roles.guard';
import { CategoryService } from './category.service';
import { CreateCategoryDto } from './dto/create-category.dto';
import { EditFiltersDto } from './dto/edit-filters.dto';

@Controller('categories')
export class CategoryController {
    constructor(private categoryService: CategoryService) { }

    @Get()
    getAllCategories() {
        return this.categoryService.getCategories();
    }

    @Get(':id/filters')
    @UseInterceptors(ClassSerializerInterceptor)
    getCategoryFilters(@Param('id') id: number) {
        return this.categoryService.getCategoryFilters(id);
    }

    @Put(':id/filters')
    @Roles(RoleValue.ADMIN)
    @UseGuards(JwtAuthGuard, RolesGuard)
    @UseInterceptors(ClassSerializerInterceptor)
    editFilters(@Param('id') id: number, @Body() dto: EditFiltersDto) {
        return this.categoryService.editFilters(id, dto);
    }

    @Post()
    @Roles(RoleValue.ADMIN)
    @UseGuards(JwtAuthGuard, RolesGuard)
    addCategory(@Body() dto: CreateCategoryDto) {
        return this.categoryService.addCategory(dto);
    }

}
