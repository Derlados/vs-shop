import { Exclude } from "class-transformer";
import { Attribute } from "src/products/models/attribute.model";
import { Column, Entity, JoinColumn, ManyToOne, PrimaryColumn } from "typeorm";
import { Category } from "./category.model";

@Entity()
export class Filter {

    @PrimaryColumn({ name: "category_id", type: "int", nullable: false })
    @Exclude()
    categoryId: number;

    @PrimaryColumn({ name: "attribute_id", type: "int", nullable: false })
    @Exclude()
    attributeId: number;

    @ManyToOne(() => Category, category => category.filters, { onDelete: "CASCADE", onUpdate: "CASCADE" })
    @JoinColumn({ name: "category_id" })
    category: Category;

    @ManyToOne(() => Attribute, attribute => attribute.filters, { onDelete: "CASCADE", onUpdate: "CASCADE" })
    @JoinColumn({ name: "attribute_id" })
    attribute: Attribute;

    @Column({ type: "boolean", default: false })
    isRange: boolean;

    @Column({ type: "int", default: 1 })
    step: number;

    @Column({ name: "count_products", type: "int", select: false })
    countProduct: number;
}