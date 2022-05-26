import { Exclude } from "class-transformer";
import { Product } from "src/products/models/product.model";
import { AfterLoad, Column, Entity, ManyToOne, OneToMany, PrimaryGeneratedColumn } from "typeorm";
import { RelationCountAttribute } from "typeorm/query-builder/relation-count/RelationCountAttribute";
import { Filter } from "./filter.model";

@Entity()
export class Category {
    @PrimaryGeneratedColumn()
    id: number;

    @Column({ type: "varchar", length: 200, nullable: false, unique: true })
    name: string;

    @Column({ type: "text", nullable: true })
    img: string;

    @Column({ type: "varchar", length: 250, nullable: false, unique: true })
    routeName: string;

    @OneToMany(() => Product, (product) => product.category)
    products: Product[]

    @OneToMany(() => Filter, filter => filter.category)
    filters: Filter[];
}