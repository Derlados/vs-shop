import { Column, Entity, JoinColumn, JoinTable, ManyToOne, PrimaryColumn } from "typeorm";
import { Attribute } from "./attribute.model";
import { Product } from "./product.model";

@Entity()
export class Value {
    @PrimaryColumn({ type: "int", name: "product_id" })
    productId: number;

    @PrimaryColumn({ type: "int", name: "attribute_id" })
    attributeId: number;

    @ManyToOne(() => Product, product => product.values, { onDelete: 'CASCADE', onUpdate: 'CASCADE' })
    @JoinColumn({ name: "product_id", referencedColumnName: "id" })
    product: Product;

    @ManyToOne(() => Attribute, attr => attr.values, { onDelete: 'CASCADE', onUpdate: 'CASCADE' })
    @JoinColumn({ name: "attribute_id" })
    attribute: Attribute;

    @Column({ type: "text", nullable: false })
    value: string;
}