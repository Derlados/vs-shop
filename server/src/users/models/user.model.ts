import { Product } from "src/products/models/product.model";
import { Role } from "src/roles/models/role.model";
import { Column, Entity, JoinTable, ManyToMany, OneToMany, PrimaryColumn, PrimaryGeneratedColumn } from "typeorm";

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

    @ManyToMany(() => Role, role => role.users)
    @JoinTable()
    roles: Role[];

    @OneToMany(() => Product, product => product.user)
    @JoinTable()
    products: Product[];
}