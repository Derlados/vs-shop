import { Body, ClassSerializerInterceptor, Controller, Delete, Get, Param, Post, Put, UseGuards, UseInterceptors } from '@nestjs/common';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';
import { Roles } from 'src/roles/roles.decorator';
import { RoleValues } from 'src/roles/roles.enum';
import { RolesGuard } from 'src/roles/roles.guard';
import { CatalogsService } from './catalogs.service';
import { CreateCatalogDto } from './dto/create-catalog.dto';

@Controller('catalogs')
export class CatalogsController {

    constructor(private catalogsService: CatalogsService) { }

    @Get()
    @UseInterceptors(ClassSerializerInterceptor)
    getAll() {
        return this.catalogsService.getAll();
    }

    @Get(':id')
    @UseInterceptors(ClassSerializerInterceptor)
    getById(@Param('id') id: number) {
        return this.catalogsService.getById(id);
    }

    @Post()
    @Roles(RoleValues.ADMIN)
    @UseGuards(JwtAuthGuard, RolesGuard)
    @UseInterceptors(ClassSerializerInterceptor)
    createCatalog(@Body() dto: CreateCatalogDto) {
        return this.catalogsService.addCatalog(dto);
    }

    @Put(':id')
    @Roles(RoleValues.ADMIN)
    @UseGuards(JwtAuthGuard, RolesGuard)
    @UseInterceptors(ClassSerializerInterceptor)
    editCatalog(@Param('id') id: number, @Body() dto: CreateCatalogDto) {
        return this.catalogsService.editCatalog(id, dto);
    }

    @Delete(':id')
    @Roles(RoleValues.ADMIN)
    @UseGuards(JwtAuthGuard, RolesGuard)
    deleteCatalog(@Param('id') id: number) {
        return this.catalogsService.deleteCatalog(id);
    }
}
