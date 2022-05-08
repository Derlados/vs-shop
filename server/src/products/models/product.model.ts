import { Exclude } from "class-transformer";
import { Category } from "src/category/category.model";
import { AfterLoad, Column, Entity, JoinColumn, JoinTable, ManyToOne, OneToMany, PrimaryGeneratedColumn } from "typeorm";
import { Image } from "./image.model";
import { Value } from "./value.model";

@Entity("product")
export class Product {

    @PrimaryGeneratedColumn("increment")
    id: number;

    @Column({ type: "varchar", length: 200, nullable: false })
    title: string;

    @Column({ type: "text", nullable: false })
    description: string;

    @Column({ type: "decimal", nullable: false })
    price: number;

    @Column({ type: "decimal", nullable: false })
    oldPrice: number;

    @Column({ type: "boolean", nullable: false, default: false })
    isNew: boolean;

    @Column({ type: "int", nullable: false })
    count: number;

    @Column({ name: "category_id", type: "number", nullable: false })
    categoryId: number;

    discountPercent: number;

    attributes: Object;

    @ManyToOne((type) => Category, (category) => category.products, { onDelete: "CASCADE", onUpdate: "CASCADE" })
    @JoinColumn({ name: "category_id" })
    category: Category;

    @OneToMany(() => Image, image => image.product)
    images: Image[];

    @OneToMany(() => Value, value => value.product)
    @Exclude()
    values: Value[];

    @AfterLoad()
    getDiscountPercent() {
        this.discountPercent = Math.floor((1 - this.price / this.oldPrice) * 100);
    }

    @AfterLoad()
    getAttributes() {
        const mapAttr = new Map<string, string>();
        for (const value of this.values) {
            mapAttr.set(value.attribute.attribute, value.value);
        }

        this.attributes = Object.fromEntries(mapAttr);
    }
}