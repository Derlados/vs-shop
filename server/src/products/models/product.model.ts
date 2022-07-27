import { Exclude } from "class-transformer";
import { Category } from "src/category/models/category.model";
import { OrderProduct } from "src/orders/models/order-products.model";
import { SessionCartItem } from "src/session-cart/model/session-cart-item.model";
import { User } from "src/users/models/user.model";
import { AfterLoad, Column, Entity, JoinColumn, JoinTable, ManyToOne, OneToMany, PrimaryGeneratedColumn } from "typeorm";
import { Image } from "./image.model";
import { Value } from "./value.model";

@Entity("product")
export class Product {

    @PrimaryGeneratedColumn("increment")
    id: number;

    @Column({ type: "varchar", length: 200, nullable: false })
    title: string;

    @Column({ type: "text", nullable: false })
    description: string;

    @Column({ type: "decimal", precision: 10, scale: 2, nullable: false })
    price: number;

    @Column({ type: "decimal", precision: 10, scale: 2, nullable: false })
    oldPrice: number;

    @Column({ type: "boolean", nullable: false, default: false })
    isNew: boolean;

    @Column({ type: "int", nullable: false })
    count: number;

    @Column({ type: "int", default: 0 })
    sold: number;

    @Column({ type: "boolean", default: false })
    isBestseller: boolean;

    @Column({ name: "category_id", type: "number", nullable: false })
    categoryId: number;

    @Column({ name: "user_id", type: "number", nullable: false })
    userId: number;

    discountPercent: number;

    attributes: Object;

    @ManyToOne(() => Category, (category) => category.products, { onDelete: "CASCADE", onUpdate: "CASCADE" })
    @JoinColumn({ name: "category_id" })
    category: Category;

    @ManyToOne(() => User, (user) => user.products, { onDelete: "CASCADE", onUpdate: "CASCADE" })
    @JoinColumn({ name: "user_id" })
    user: User;

    @OneToMany(() => Image, image => image.product)
    images: Image[];

    @OneToMany(() => Value, value => value.product)
    @Exclude()
    values: Value[];

    @OneToMany(() => OrderProduct, op => op.product)
    @Exclude()
    orderProducts: OrderProduct[]

    @OneToMany(() => SessionCartItem, cartItem => cartItem.product)
    @Exclude()
    sessionCartItems: SessionCartItem[]

    @AfterLoad()
    getDiscountPercent() {
        this.discountPercent = Math.floor((1 - this.price / this.oldPrice) * 100);
    }

    @AfterLoad()
    getAttributes() {
        if (!this.values) {
            this.attributes = [];
            return;
        }

        const mapAttr = new Map<string, string>();
        for (const value of this.values) {
            mapAttr.set(value.attribute.name, value.value);
        }

        this.attributes = Object.fromEntries(mapAttr);
    }

    @AfterLoad()
    convertToNumber() {
        this.price = Number(this.price);
        this.oldPrice = Number(this.oldPrice);
    }
}