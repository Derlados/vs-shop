import { Exclude } from "class-transformer";
import { AfterLoad, Column, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn } from "typeorm";
import { Product } from "./product.model";

@Entity("images")
export class Image {

    @PrimaryGeneratedColumn("increment")
    id: number;

    @Column({ type: 'text', nullable: false })
    @Exclude()
    filename: string;

    @Column({ type: "boolean", default: false })
    isMain: boolean;

    @Column({ type: "int", name: "product_id", nullable: false })
    @Exclude()
    productId: number;

    @ManyToOne(() => Product, product => product.images, { onDelete: 'CASCADE', onUpdate: 'CASCADE' })
    @JoinColumn({ name: 'product_id' })
    product: Product;

    url: string;

    @AfterLoad()
    getUrl() {
        this.url = `${process.env.STATIC_API}/${this.filename}`
    }
}