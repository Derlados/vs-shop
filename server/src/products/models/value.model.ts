import { Column, Entity, JoinColumn, ManyToOne, PrimaryColumn } from "typeorm";
import { Attribute } from "./attribute.model";
import { Product } from "./product.model";

@Entity()
export class Value {
    @PrimaryColumn()
    product_id: string;

    @PrimaryColumn()
    attribute_id: number;

    @ManyToOne(() => Product, product => product.values, { onDelete: 'CASCADE', onUpdate: 'CASCADE' })
    @JoinColumn({ name: "product_id" })
    product: Product;

    @ManyToOne(() => Attribute, attr => attr.values, { onDelete: 'CASCADE', onUpdate: 'CASCADE' })
    @JoinColumn({ name: "attribute_id" })
    attribute: Attribute;

    @Column({ type: "text", nullable: false })
    value: string;
}