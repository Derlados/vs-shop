import { type } from "os";
import { AfterLoad, Column, Entity, OneToMany, PrimaryGeneratedColumn } from "typeorm";
import { Banner } from "./banner.model";
import { Contact } from "./contact.model";

@Entity("shop-info")
export class ShopInfo {
    @PrimaryGeneratedColumn()
    id: number;

    @Column({ type: 'text' })
    smallBanner: string;

    @Column({ type: 'simple-json' })
    contacts: Contact[];

    @OneToMany(() => Banner, b => b.shopInfo)
    banners: Banner[];

    @AfterLoad()
    getSmallBanner() {
        this.smallBanner = `${process.env.STATIC_API}/${this.smallBanner}`
    }
}


