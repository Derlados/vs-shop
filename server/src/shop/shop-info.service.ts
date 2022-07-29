import { Injectable, NotFoundException } from '@nestjs/common';
import uuid from 'uuid';
import * as path from 'path';
import * as fs from 'fs';
import { resolve } from 'path';
import { FilesService } from 'src/files/files.service';
import { CreateLargeBannerDto } from './dto/create-large-banner.dto';
import { Repository } from 'typeorm';
import { ShopInfo } from './model/shop-info.model';
import { InjectRepository } from '@nestjs/typeorm';
import { Banner } from './model/banner.model';
import { Contact } from './model/contact.model';

@Injectable()
export class ShopInfoService {
    private readonly SHOP_INFO_ID: number = 1;

    constructor(@InjectRepository(ShopInfo) private shopInfoRepository: Repository<ShopInfo>,
        @InjectRepository(Banner) private bannerRepository: Repository<Banner>,
        private fileService: FilesService) { }

    async getShopInfo() {
        return this.shopInfoRepository.findOne({ where: { id: this.SHOP_INFO_ID }, relations: ["banners"] });
    }

    async addLargeBanner(dto: CreateLargeBannerDto, img: Express.Multer.File): Promise<Banner> {
        const imgUrl = await this.fileService.createFile(img);
        return this.bannerRepository.save({ ...dto, shopInfoId: this.SHOP_INFO_ID, img: imgUrl })
    }

    async editLargeBanner(id: number, dto: CreateLargeBannerDto, img: Express.Multer.File): Promise<Banner> {
        const imgUrl = await this.fileService.createFile(img);
        return this.bannerRepository.save({ ...dto, id: id, img: imgUrl })
    }

    async deleteLargeBanner(id: number) {
        const res = await this.bannerRepository.delete({ id: id });
        if (res.affected == 0) {
            throw new NotFoundException();
        }
    }

    async editSmallBanner(newBanner: Express.Multer.File) {
        const imgUrl = await this.fileService.createFile(newBanner);
        await this.shopInfoRepository.update({ id: this.SHOP_INFO_ID }, { smallBanner: imgUrl });
        return imgUrl;
    }

    async updateContacts(newContacts: Contact[]) {
        await this.shopInfoRepository.update({ id: this.SHOP_INFO_ID }, { contacts: newContacts });
        return newContacts;
    }
}
