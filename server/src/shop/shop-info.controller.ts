import { Body, ClassSerializerInterceptor, Controller, Delete, Get, Param, Post, Put, UploadedFile, UseInterceptors } from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { Roles } from 'src/roles/roles.decorator';
import { RoleValues } from 'src/roles/roles.enum';
import { CreateLargeBannerDto } from './dto/create-large-banner.dto';
import { EditContactsDto } from './dto/edit-contacts.dto';
import { ShopInfoService } from './shop-info.service';

@Controller('shop-info')
export class ShopInfoController {
    constructor(private shopInfoService: ShopInfoService) { }

    @Get()
    getShopInfo() {
        return this.shopInfoService.getShopInfo();
    }

    @Post('/banner')
    @Roles(RoleValues.ADMIN)
    @UseInterceptors(ClassSerializerInterceptor, FileInterceptor('image'))
    addLargeBanner(@Body() dto: CreateLargeBannerDto, @UploadedFile() img: Express.Multer.File) {
        return this.shopInfoService.addBanner(dto, img);
    }

    @Put('/banner/:id')
    @Roles(RoleValues.ADMIN)
    @UseInterceptors(ClassSerializerInterceptor, FileInterceptor('image'))
    editBanner(@Body() dto: CreateLargeBannerDto, @Param('id') id: number, @UploadedFile() img?: Express.Multer.File) {
        return this.shopInfoService.editBanner(id, dto, img);
    }

    @Delete('/banner/:id')
    @Roles(RoleValues.ADMIN)
    deleteBanner(@Param('id') id: number) {
        return this.shopInfoService.deleteLargeBanner(id);
    }

    @Put('/small-banner')
    @Roles(RoleValues.ADMIN)
    @UseInterceptors(ClassSerializerInterceptor, FileInterceptor('image'))
    editSmallBanner(@UploadedFile() img: Express.Multer.File) {
        return this.shopInfoService.editSmallBanner(img);
    }

    @Put('/contacts')
    @Roles(RoleValues.ADMIN)
    editContacts(@Body() dto: EditContactsDto) {
        return this.shopInfoService.updateContacts(dto.contacts);
    }
}
