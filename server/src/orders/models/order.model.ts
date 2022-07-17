import { Product } from "src/products/models/product.model";
import { Column, Entity, JoinColumn, ManyToOne, OneToMany, PrimaryGeneratedColumn } from "typeorm";
import { Payment } from "../../payments/models/payment.model";
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

    @Column({ name: "payment_id", type: 'number', nullable: false })
    paymentId: number;

    @Column({ type: "decimal", nullable: false })
    totalPrice: number;

    @Column({ type: "varchar", length: 100, default: 'Не оброблено' })
    status: string;

    @Column({ name: "created_at", type: "datetime", default: () => "CURRENT_TIMESTAMP()" })
    createdAt: Date;

    @OneToMany(() => OrderProduct, op => op.order)
    orderProducts: Product[];

    @ManyToOne(() => Payment, payment => payment.orders)
    @JoinColumn({ name: "payment_id" })
    payment: Payment;
}