import { Product } from "src/products/models/product.model";
import { Column, Entity, ManyToOne, OneToMany, PrimaryGeneratedColumn } from "typeorm";

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

    @OneToMany((type) => Product, (product) => product.category)
    products: Product[]
}