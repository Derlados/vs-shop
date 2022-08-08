import { Body, ClassSerializerInterceptor, Controller, Delete, Get, Param, Post, Put, UploadedFile, UseInterceptors } from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { Roles } from 'src/roles/roles.decorator';
import { RoleValues } from 'src/roles/roles.enum';
import { CreateLargeBannerDto } from './dto/create-large-banner.dto';
import { EditContactsDto } from './dto/edit-contacts.dto';
import { SendMailDto } from './dto/send-mail.dto';
import { ShopService } from './shop.service';

@Controller('shop')
export class ShopController {
    constructor(private shopService: ShopService) { }

    @Get('/all-info')
    getShopInfo() {
        return this.shopService.getShopInfo();
    }

    @Post('/banner')
    @Roles(RoleValues.ADMIN)
    @UseInterceptors(ClassSerializerInterceptor, FileInterceptor('image'))
    addLargeBanner(@Body() dto: CreateLargeBannerDto, @UploadedFile() img: Express.Multer.File) {
        return this.shopService.addBanner(dto, img);
    }

    @Post('/email')
    sendMail(@Body() dto: SendMailDto) {
        return this.shopService.sendMail(dto);
    }

    @Put('/banner/:id')
    @Roles(RoleValues.ADMIN)
    @UseInterceptors(ClassSerializerInterceptor, FileInterceptor('image'))
    editBanner(@Body() dto: CreateLargeBannerDto, @Param('id') id: number, @UploadedFile() img?: Express.Multer.File) {
        return this.shopService.editBanner(id, dto, img);
    }

    @Delete('/banner/:id')
    @Roles(RoleValues.ADMIN)
    deleteBanner(@Param('id') id: number) {
        return this.shopService.deleteLargeBanner(id);
    }

    @Put('/small-banner')
    @Roles(RoleValues.ADMIN)
    @UseInterceptors(ClassSerializerInterceptor, FileInterceptor('image'))
    editSmallBanner(@UploadedFile() img: Express.Multer.File) {
        return this.shopService.editSmallBanner(img);
    }

    @Put('/contacts')
    @Roles(RoleValues.ADMIN)
    editContacts(@Body() dto: EditContactsDto) {
        return this.shopService.updateContacts(dto.contacts);
    }
}
