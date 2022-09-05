import { Exclude } from "class-transformer";
import { Catalog } from "src/catalogs/models/catalog.model";
import { Product } from "src/products/models/product.model";
import { AfterLoad, Column, Entity, JoinColumn, ManyToMany, ManyToOne, OneToMany, PrimaryGeneratedColumn } from "typeorm";
import { IKeyAttribute } from "../types/IKeyAttribute";
import { Filter } from "./filter.model";

@Entity()
export class Category {
    @PrimaryGeneratedColumn()
    id: number;

    @Column({ name: "catalog_id", type: "int", nullable: false })
    catalogId: number;

    @Column({ type: "varchar", length: 200, nullable: false, unique: true })
    name: string;

    @Column({ type: "text", nullable: true })
    img: string;

    @Column({ type: "varchar", length: 250, nullable: false, unique: true })
    routeName: string;

    @Column({ name: "is_new", type: "boolean", nullable: false, default: false })
    isNew: boolean;

    @ManyToOne(() => Catalog, catalog => catalog.categories, { onDelete: "CASCADE", onUpdate: "CASCADE" })
    @JoinColumn({ name: "catalog_id" })
    @Exclude()
    catalog: Catalog;

    @OneToMany(() => Product, product => product.category)
    @Exclude()
    products: Product[]

    @OneToMany(() => Filter, filter => filter.category)
    @Exclude()
    filters: Filter[];

    keyAttributes: IKeyAttribute[];

    productsCount: number;

    allBrands: string[];

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

    @AfterLoad()
    getAllBrands() {
        if (this.products) {
            const brands = new Set(this.products.map(p => p.brand));
            this.allBrands = Array.from(brands);
        }
    }
}