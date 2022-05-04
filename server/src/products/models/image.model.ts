import { Column, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn } from "typeorm";
import { Product } from "./product.model";

@Entity()
export class Image {

    @PrimaryGeneratedColumn("increment")
    id: number;

    @Column({ type: 'text', nullable: false })
    url: string;

    @Column({ type: "boolean", default: false })
    isMain: boolean;

    @ManyToOne(() => Product, product => product.imgs, { onDelete: 'CASCADE', onUpdate: 'CASCADE' })
    @JoinColumn({ name: "product_id" })
    product: Product;
}