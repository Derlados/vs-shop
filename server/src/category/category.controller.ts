import { Body, Controller, Get, Post } from '@nestjs/common';
import { CategoryService } from './category.service';
import { CreateCategoryDto } from './dto/create-category.dto';

@Controller('categories')
export class CategoryController {
    constructor(private categoryService: CategoryService) { }

    @Get()
    getAllCategories() {
        return this.categoryService.getCategories();
    }

    @Post()
    addCategory(@Body() dto: CreateCategoryDto) {
        return this.categoryService.addCategory(dto);
    }

}
