import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Category } from './category.model';
import { CreateCategoryDto } from './dto/create-category.dto';

@Injectable()
export class CategoryService {

    constructor(@InjectRepository(Category) private categoryRepository: Repository<Category>) { }

    async getCategories() {
        return this.categoryRepository.find();
    }

    async addCategory(dto: CreateCategoryDto) {
        const result = await this.categoryRepository.insert(dto);
        const insertId = result.raw.insertId;
        return this.categoryRepository.find({ id: insertId })
    }
}
