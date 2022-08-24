import { Exclude } from "class-transformer";
import cyrillicToTranslit from "cyrillic-to-translit-js";
import { Category } from "src/category/models/category.model";
import { AvailableStatus } from "src/constants/AvailabilityStatus";
import { OrderProduct } from "src/orders/models/order-products.model";
import { SessionCartItem } from "src/session-cart/model/session-cart-item.model";
import { User } from "src/users/models/user.model";
import { AfterLoad, Column, Entity, JoinColumn, ManyToOne, OneToMany, PrimaryGeneratedColumn } from "typeorm";
import { Image } from "./image.model";
import { Value } from "./value.model";

@Entity("products")
export class Product {
    @PrimaryGeneratedColumn("increment")
    id: number;

    @Column({ type: "varchar", length: 200, nullable: false })
    title: string;

    @Column({ type: "varchar", length: 200, nullable: false })
    brand: string;

    @Column({ type: "text", nullable: false })
    description: string;

    @Column({ type: "decimal", precision: 10, scale: 2, nullable: false })
    price: number;

    @Column({ type: "decimal", precision: 10, scale: 2, nullable: false })
    oldPrice: number;

    @Column({ type: "boolean", nullable: false, default: false })
    isNew: boolean;

    @Column({ type: "int", nullable: false })
    @Exclude()
    count: number;

    @Column({ name: "max_by_order", type: "int", default: 1 })
    maxByOrder: number;

    @Column({ name: "is_bestseller", type: "boolean", default: false })
    isBestseller: boolean;

    @Column({ name: "category_id", type: "number", nullable: false })
    categoryId: number;

    @Column({ name: "user_id", type: "number", nullable: false })
    userId: number;

    url: string;

    availability: AvailableStatus;

    discountPercent: number;

    attributes: ProductAttribute[];

    @ManyToOne(() => Category, (category) => category.products, { onDelete: "CASCADE", onUpdate: "CASCADE" })
    @JoinColumn({ name: "category_id" })
    @Exclude()
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
    getUrl() {
        if (this.category) {
            this.url = `/${cyrillicToTranslit().transform(this.title.toLowerCase(), "_")}/${this.id}`;
        }
    }

    @AfterLoad()
    getAvailability() {
        if (this.count > this.maxByOrder * 2) {
            this.availability = AvailableStatus.IN_STOCK;
        } else if (this.count > 0 && this.count <= this.maxByOrder * 2) {
            this.availability = AvailableStatus.IN_STOKE_FEW;
        } else {
            this.availability = AvailableStatus.OUT_OF_STOCK;
        }
    }

    @AfterLoad()
    getDiscountPercent() {
        this.discountPercent = Math.floor((1 - this.price / this.oldPrice) * 100);
    }

    @AfterLoad()
    getAttributes() {
        this.attributes = [];
        if (!this.values) {
            return;
        }

        for (const value of this.values) {
            this.attributes.push({ ...value.attribute, value: value })
        }
    }

    @AfterLoad()
    convertToNumber() {
        this.price = Number(this.price);
        this.oldPrice = Number(this.oldPrice);
    }
}

export class ProductAttribute {
    id: number;
    name: string;
    value: Value;
}