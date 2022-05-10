import { Product } from "src/products/models/product.model";
import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from "typeorm";
import { OrderProduct } from "./order-products.model";

@Entity('orders')
export class Order {
    @PrimaryGeneratedColumn()
    id: number;

    @Column({ type: "varchar", length: 100, nullable: false })
    client: string;

    @Column({ type: "varchar", length: 20, nullable: false })
    phone: string;

    @Column({ type: "varchar", length: 50, nullable: false })
    email: string;

    @Column({ type: "varchar", length: 200, nullable: false })
    address: string;

    @Column({ type: "text", nullable: true })
    additionalInfo?: string;

    @Column({ type: "decimal", nullable: false })
    totalPrice: number;

    @Column({ type: "boolean", default: false })
    isComplete: boolean;

    @Column({ type: "datetime", default: () => "CURRENT_TIMESTAMP()" })
    createdAt: Date;

    @OneToMany(() => OrderProduct, op => op.order)
    orderProducts: Product[];
}