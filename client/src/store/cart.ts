import { makeAutoObservable } from "mobx";
import { IProduct } from "../types/types";

interface ICartProduct {
    product: IProduct;
    count: number;
}

class Cart {
    cartProducts: ICartProduct[];

    constructor() {
        makeAutoObservable(this);
        this.cartProducts = [
            {
                product: {
                    id: 1,
                    isNew: true,
                    title: "Originals Kaval Windbr",
                    img: 'https://template.hasthemes.com/melani/melani/assets/img/product/product-9.jpg',
                    price: 18.99,
                    oldPrice: 19.99,
                    discountPercent: 5
                },
                count: 2
            },
            {
                product: {
                    id: 2,
                    isNew: true,
                    title: "Originals Kaval Windbr",
                    img: 'https://template.hasthemes.com/melani/melani/assets/img/product/product-9.jpg',
                    price: 18.99,
                    oldPrice: 19.99,
                    discountPercent: 5
                },
                count: 1
            },
            {
                product: {
                    id: 3,
                    isNew: true,
                    title: "Originals Kaval Windbr",
                    img: 'https://template.hasthemes.com/melani/melani/assets/img/product/product-9.jpg',
                    price: 18.99,
                    oldPrice: 19.99,
                    discountPercent: 5
                },
                count: 4
            }
        ];
    }

    get totalPrice(): number {
        let totalPrice = 0;
        for (const products of this.cartProducts) {
            totalPrice += products.product.price * products.count;
        }

        return totalPrice;
    }

    addToCart(product: IProduct, count: number) {
        this.cartProducts.push({ product: product, count: count });
    }

    deleteFromCart(id: number) {
        this.cartProducts = this.cartProducts.filter(cp => cp.product.id != id);

    }

    findById(id: number) {
        return this.cartProducts.find(cp => cp.product.id == id);
    }

}

export default new Cart();