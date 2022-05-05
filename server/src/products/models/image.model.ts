import { Column, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn } from "typeorm";
import { Product } from "./product.model";

@Entity("images")
export class Image {

    @PrimaryGeneratedColumn("increment")
    id: number;

    @Column({ type: 'text', nullable: false })
    url: string;

    @Column({ type: "boolean", default: false })
    isMain: boolean;

    @ManyToOne(() => Product, product => product.images, { onDelete: 'CASCADE', onUpdate: 'CASCADE' })
    product: Product;
}