import { Exclude } from "class-transformer";
import { Column, Entity, Generated, JoinColumn, JoinTable, ManyToOne, PrimaryColumn, PrimaryGeneratedColumn, Unique } from "typeorm";
import { Attribute } from "./attribute.model";
import { Product } from "./product.model";

@Entity("values")
@Unique(["productId", "attributeId"])
export class Value {
    @PrimaryGeneratedColumn("increment")
    id: number;

    @Column({ type: "int", name: "product_id", nullable: false })
    @Exclude()
    productId: number;

    @Column({ type: "int", name: "attribute_id", nullable: false })
    @Exclude()
    attributeId: number;

    @ManyToOne(() => Product, product => product.values, { onDelete: 'CASCADE', onUpdate: 'CASCADE' })
    @JoinColumn({ name: "product_id" })
    product: Product;

    @ManyToOne(() => Attribute, attr => attr.values, { onDelete: 'CASCADE', onUpdate: 'CASCADE' })
    @JoinColumn({ name: "attribute_id" })
    @Exclude()
    attribute: Attribute;

    @Column({ type: "text", nullable: false })
    name: string;
}