import classNames from 'classnames';
import { observer, useLocalObservable } from 'mobx-react-lite';
import React, { FC, useRef } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import cart from '../store/cart';
import '../styles/header/cart-quick.scss';
import { IProduct } from '../types/types';

interface CartQuickViewProps {
    isOpen: boolean;
    onClose: () => void;
}

const CartQuickView: FC<CartQuickViewProps> = observer(({ isOpen, onClose }) => {
    const navigation = useNavigate();
    const wrapperRef = useRef(null);

    const onDeleteProduct = (product: IProduct) => {
        cart.deleteFromCart(product.id);
    }

    const handleClickOutside = (event: React.MouseEvent) => {
        if (wrapperRef.current && !(wrapperRef.current as any).contains(event.target)) {
            onClose();
        }
    }

    const openCheckout = () => {
        navigation('/checkout');
        onClose();
    }

    const openProductInfo = (product: IProduct) => {
        navigation(`/product/${product.id}`);
        onClose();
    }

    return (
        <div className={classNames("cart-quick", {
            "cart-quick_hide": !isOpen
        })} onClick={handleClickOutside}>
            <div className='cart-quick__container' ref={wrapperRef} >
                <div className='cart-quick__head rcc'>
                    <div className='cart-quick__head-text'>Кошик</div>
                    <div className='cart-quick__close cart-quick__close_anim' onClick={onClose}></div>
                </div>
                {cart.cartProducts.length != 0
                    ?
                    <div className='cart-quick__content'>
                        <ul className='cart-quick__product-list'>
                            {cart.cartProducts.map(cp => (
                                <li key={cp.product.id} className='cart-quick__product rlt'>
                                    <img className='cart-quick__product-img' src={cp.product.imgs[0]} onClick={() => openProductInfo(cp.product)} />
                                    <div className='cart-quick__product-desc'>
                                        <div className='cart-quick__product-head rcc'>
                                            <div className='cart-quick__product-title' onClick={() => openProductInfo(cp.product)}>{cp.product.title}</div>
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
                        <div className='cart-quick__checkout ccc' onClick={openCheckout}>CHECKOUT</div>
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