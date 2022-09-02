import { Product } from "src/products/models/product.model";
import { Column, Entity, JoinColumn, JoinTable, ManyToMany, ManyToOne, OneToMany, PrimaryColumn, PrimaryGeneratedColumn } from "typeorm";
import { SessionCartItem } from "./session-cart-item.model";

@Entity('session-cart')
export class SessionCart {
    @PrimaryGeneratedColumn({ name: "session_cart_id", type: "int" })
    id: number;

    @Column({ name: "created_at", type: "datetime", default: () => "CURRENT_TIMESTAMP()" })
    createdAt: Date;

    @Column({ name: "modified_at", type: "datetime", default: () => "CURRENT_TIMESTAMP()" })
    modifiedAt: Date;

    @OneToMany(() => SessionCartItem, item => item.cart)
    products: SessionCartItem[];
}