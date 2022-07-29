import { type } from "os";
import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from "typeorm";
import { Banner } from "./banner.model";
import { Contact } from "./contact.model";

@Entity("shop-info")
export class ShopInfo {
    @PrimaryGeneratedColumn()
    id: number;

    @Column({ type: 'text', default: '' })
    smallBanner: string;

    @Column({ type: 'simple-json', default: '[]' })
    contacts: Contact[];

    @OneToMany(() => Banner, b => b.shopInfo)
    banners: Banner[];
}


