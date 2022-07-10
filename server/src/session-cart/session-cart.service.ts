import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import AESEncryptor from 'src/helpers/AESEncryptor';
import { LessThan, Repository } from 'typeorm';
import { CreateCartItemDto } from './dto/create-cart-item.dto';
import { SessionCartItem } from './model/session-cart-item.model';
import { SessionCart } from './model/session-cart.model';

@Injectable()
export class SessionCartService {
    private readonly EXPIRE_TIME = 7 * 24 * 60 * 60 * 1000;

    constructor(@InjectRepository(SessionCart) private sessionCartRepository: Repository<SessionCart>,
        @InjectRepository(SessionCartItem) private sessionCartItemRepository: Repository<SessionCartItem>) { }

    async createCart() {
        const result = await this.sessionCartItemRepository.insert({});
        return AESEncryptor.encrypt(result.raw.insertId);
    }

    async getCartProducts(cartId: number) {
        const cart = await this.sessionCartRepository.findOne({ where: { id: cartId }, relations: ["products", "products.values", "products.values.attribute", "products.images"] });
        return cart.products;
    }

    async addProduct(cartId: number, dto: CreateCartItemDto) {
        const product = await this.sessionCartItemRepository.save({ cartId: cartId, ...dto })
        return product;
    }

    async editProduct(cartId: number, productId: number, dto: CreateCartItemDto) {
        const product = await this.sessionCartItemRepository.save({ cartId: cartId, productId: productId, ...dto })
        return product;
    }

    async deleteProduct(cartId: number, productId: number) {
        await this.sessionCartItemRepository.delete({ cartId: cartId, productId: productId })
    }

    async deleteOldCarts() {
        await this.sessionCartRepository.delete({ modifiedAt: LessThan(Date.now() - this.EXPIRE_TIME) })
    }
}
