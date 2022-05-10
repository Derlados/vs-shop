import { Product } from "src/products/models/product.model";
import { Column, Entity, PrimaryColumn, PrimaryGeneratedColumn } from "typeorm";

@Entity('users')
export class User {
    @PrimaryGeneratedColumn()
    id: number;

    @Column({ type: "varchar", length: 50, nullable: false, unique: true })
    username: string;

    @Column({ type: "varchar", length: 255, nullable: false })
    password: string;

    @Column({ type: "varchar", length: 50, nullable: false, unique: true })
    email: string;

    @Column({ type: "varchar", length: 25, nullable: true })
    phone?: string;

    // products: Product[];
}