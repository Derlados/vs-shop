import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from "typeorm";
import { Order } from "../../orders/models/order.model";

@Entity('payments')
export class Payment {
    @PrimaryGeneratedColumn()
    id: number;

    @Column({ type: "varchar", length: 100, nullable: false })
    method: string;

    @OneToMany(() => Order, order => order.payment)
    orders: Order[];
}