import { AfterLoad, Column, Entity, OneToMany, PrimaryGeneratedColumn } from "typeorm";
import { Image } from "./image.model";
import { Value } from "./value.model";

@Entity()
export class Product {

    @PrimaryGeneratedColumn("increment")
    public id: number;

    @Column({ type: "varchar", length: 200, nullable: false })
    title: string;

    @Column({ type: "decimal", nullable: false })
    price: number;

    @Column({ type: "decimal", nullable: false })
    oldPrice: number;

    @Column({ type: "boolean", nullable: false })
    isNew: number;

    @Column({ type: "int", nullable: false })
    count: number;

    discountPercent: number;

    @AfterLoad()
    getDiscountPercent() {
        this.discountPercent = Math.floor((1 - this.price / this.oldPrice) * 100);
    }

    @OneToMany(() => Image, image => image.product)
    imgs: Image[];

    @OneToMany(() => Value, value => value.attribute)
    values: string[];
}