import { Body, ClassSerializerInterceptor, Controller, Delete, Get, Param, Post, Put, UploadedFile, UseInterceptors } from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
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
    @UseInterceptors(ClassSerializerInterceptor, FileInterceptor('image'))
    addLargeBanner(@Body() dto: CreateLargeBannerDto, @UploadedFile() img: Express.Multer.File) {
        return this.shopInfoService.addLargeBanner(dto, img);
    }

    @Put('/banner/:id')
    @UseInterceptors(ClassSerializerInterceptor, FileInterceptor('image'))
    editLargeBanner(@Body() dto: CreateLargeBannerDto, @Param('id') id: number, @UploadedFile() img: Express.Multer.File) {
        return this.shopInfoService.editLargeBanner(id, dto, img);
    }

    @Delete('/banner/:id')
    deleteLargeBanner(@Param('id') id: number) {
        return this.shopInfoService.deleteLargeBanner(id);
    }

    @Put('/small-banner')
    @UseInterceptors(ClassSerializerInterceptor, FileInterceptor('image'))
    editSmallBanner(@UploadedFile() img: Express.Multer.File) {
        return this.shopInfoService.editSmallBanner(img);
    }

    @Put('/contacts')
    editContacts(@Body() dto: EditContactsDto) {
        return this.shopInfoService.updateContacts(dto.contacts);
    }
}
