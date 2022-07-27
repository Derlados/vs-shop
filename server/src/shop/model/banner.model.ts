import { Column, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn } from "typeorm";
import { ShopInfo } from "./shop-info.model";

@Entity("banner")
export class Banner {
    @PrimaryGeneratedColumn()
    id: number;

    @Column({ name: 'shop_info_id', type: 'int' })
    shopInfoId: number;

    @Column({ type: 'text' })
    img: string;

    @Column({ type: 'varchar', length: 200 })
    title: string;

    @Column({ type: 'varchar', length: 200 })
    subtitle: string;

    @Column({ type: 'text' })
    link: string;

    @ManyToOne(() => ShopInfo, si => si.banners)
    @JoinColumn({ name: 'shop_info_id' })
    shopInfo: ShopInfo;
}
