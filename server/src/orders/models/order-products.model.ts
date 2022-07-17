import { Exclude } from "class-transformer";
import { Product } from "src/products/models/product.model";
import { Column, Entity, JoinColumn, ManyToOne, PrimaryColumn } from "typeorm";
import { Order } from "./order.model";

@Entity('order_products')
export class OrderProduct {
    @PrimaryColumn({ name: "order_id", type: "int", nullable: false })
    @Exclude()
    orderId: number;

    @PrimaryColumn({ name: "product_id", type: "int", nullable: false })
    @Exclude()
    productId: number;

    @Column({ type: "int", nullable: false })
    count: number;

    @ManyToOne(() => Order, order => order.orderProducts, { onUpdate: "CASCADE", onDelete: "CASCADE" })
    @JoinColumn({ name: "order_id" })
    order: Order;

    @ManyToOne(() => Product, product => product.orderProducts, { onUpdate: "CASCADE", onDelete: "CASCADE" })
    @JoinColumn({ name: "product_id" })
    product: Product;
}