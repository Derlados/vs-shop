import classNames from 'classnames';
import { observer, useLocalObservable } from 'mobx-react-lite';
import React, { FC } from 'react';
import cart from '../store/cart';
import '../styles/header/cart-quick.scss';
import { IProduct } from '../types/types';

interface CartQuickViewProps {
    isOpen: boolean;
    onClose: () => void;
}

const CartQuickView: FC<CartQuickViewProps> = observer(({ isOpen, onClose }) => {

    const onDeleteProduct = (product: IProduct) => {
        cart.deleteFromCart(product.id);
    }

    return (
        <div className={classNames("cart-quick", {
            "cart-quick_hide": !isOpen
        })}>
            <div className='cart-quick__container'>
                <div className='cart-quick__head rcc'>
                    <div className='cart-quick__head-text'>Кошик</div>
                    <div className='cart-quick__close cart-quick__close_anim' onClick={onClose}></div>
                </div>
                {cart.cartProducts.length != 0
                    ?
                    <div className='cart-quick__content'>
                        <ul className='cart-quick__product-list'>
                            {cart.cartProducts.map(cp => (
                                <li className='cart-quick__product rlt'>
                                    <img className='cart-quick__product-img' src={cp.product.img} />
                                    <div className='cart-quick__product-desc'>
                                        <div className='cart-quick__product-head rcc'>
                                            <div className='cart-quick__product-title'>{cp.product.title}</div>
                                            <div className='cart-quick__close cart-quick__close_delete' onClick={() => onDeleteProduct(cp.product)}></div>
                                        </div>
                                        <span className='cart-quick__product-count' >{cp.count} x <span className='cart-quick__product-price'>{cp.product.price} ₴</span></span>
                                    </div>
                                </li>
                            ))}
                        </ul>
                        <div className='cart-quick__price rcc'>
                            <div className='cart-quick__price-text'>Total</div>
                            <div className='cart-quick__price-text'>{Number(cart.totalPrice).toFixed(2)} ₴</div>
                        </div>
                        <div className='cart-quick__checkout ccc'>CHECKOUT</div>
                    </div>
                    :
                    <div className='cart-quick__empty ccc'>
                        <div className='cart-quick__cart-img'></div>
                        <div className='cart-quick__no-products'>{"Ваш кошик порожній :("}</div>
                    </div>
                }

            </div>

        </div>
    )
});

export default CartQuickView