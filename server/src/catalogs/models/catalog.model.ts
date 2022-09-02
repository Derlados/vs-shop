import { Category } from "src/category/models/category.model";
import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from "typeorm";

@Entity()
export class Catalog {
    @PrimaryGeneratedColumn()
    id: number;

    @Column({ type: "varchar", length: 50, unique: true })
    name: string;

    @OneToMany(() => Category, category => category.catalog)
    categories: Category[];
}