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
import { SendMailDto } from './dto/send-mail.dto';
import { createTransport, Transporter } from 'nodemailer';

@Injectable()
export class ShopService {
    private readonly SHOP_INFO_ID: number = 1;
    private readonly mailTransporter: Transporter;

    constructor(@InjectRepository(ShopInfo) private shopInfoRepository: Repository<ShopInfo>,
        @InjectRepository(Banner) private bannerRepository: Repository<Banner>,
        private fileService: FilesService) {

        this.mailTransporter = createTransport({
            host: process.env.SMTP_HOST,
            port: Number(process.env.SMTP_PORT),
            secure: true,
            auth: {
                user: process.env.SMTP_USER,
                pass: process.env.SMTP_PASSWORD,
            }
        });
    }

    async getShopInfo() {
        return this.shopInfoRepository.findOne({ where: { id: this.SHOP_INFO_ID }, relations: ["banners"] });
    }

    async sendMail(dto: SendMailDto) {
        const htmlPath = path.join(__dirname, 'static', 'mail-template.html')
        let html = fs.readFileSync(htmlPath).toString();
        html = html.replace('{{name}}', dto.name);
        html = html.replace('{{email}}', dto.email);
        html = html.replace('{{subject}}', dto.subject);
        html = html.replace('{{message}}', dto.message);

        await this.mailTransporter.sendMail({
            from: `${process.env.ORGANIZATION} '${dto.name}' <yfibltnb@gmail.com>`,
            to: "derladoshome@gmail.com",
            subject: dto.subject,
            text: '',
            html: html,
        })
    }

    async addBanner(dto: CreateLargeBannerDto, img: Express.Multer.File): Promise<Banner> {
        const imgUrl = await this.fileService.createFile(img);
        return this.bannerRepository.save({ ...dto, shopInfoId: this.SHOP_INFO_ID, img: imgUrl })
    }

    async editBanner(id: number, dto: CreateLargeBannerDto, img?: Express.Multer.File): Promise<Banner> {
        if (img) {
            const imgUrl = await this.fileService.createFile(img);
            return this.bannerRepository.save({ ...dto, id: id, img: imgUrl })
        }

        await this.bannerRepository.update({ id: id }, { ...dto })
        return this.bannerRepository.findOne({ id: id });
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
