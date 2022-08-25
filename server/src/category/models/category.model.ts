import { Exclude } from "class-transformer";
import { Product } from "src/products/models/product.model";
import { AfterLoad, Column, Entity, OneToMany, PrimaryGeneratedColumn } from "typeorm";
import { IKeyAttribute } from "../types/IKeyAttribute";
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

    @Column({ name: "is_new", type: "boolean", nullable: false, default: false })
    isNew: boolean;

    @OneToMany(() => Product, product => product.category)
    @Exclude()
    products: Product[]

    @OneToMany(() => Filter, filter => filter.category)
    @Exclude()
    filters: Filter[];

    keyAttributes: IKeyAttribute[];

    productsCount: number;



    @AfterLoad()
    getImg() {
        this.img = `${process.env.STATIC_API}/${this.img}`
    }

    @AfterLoad()
    getKeyAttributes() {
        if (this.filters) {
            this.keyAttributes = this.filters.map(filter => {
                return {
                    id: filter.attribute.id,
                    name: filter.attribute.name,
                    isRange: filter.isRange,
                    step: filter.step
                }
            })
        }
    }

    @AfterLoad()
    getCountProducts() {
        if (this.products) {
            this.productsCount = this.products.length;
        }
    }
}