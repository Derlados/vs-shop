import { type } from "os";
import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from "typeorm";
import { Banner } from "./banner.model";

@Entity("shop-info")
export class ShopInfo {
    @PrimaryGeneratedColumn()
    id: number;

    @Column({ type: 'text', default: '' })
    smallBanner: string;

    @Column({ type: 'simple-json', default: '[]' })
    contacts: ShopInfo.Contact[];

    @OneToMany(() => Banner, b => b.shopInfo)
    banners: Banner[];
}


export namespace ShopInfo {
    export class Contact {
        name: string;
        url: string;
    }
}