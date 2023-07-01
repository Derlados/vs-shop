import React, { FC } from 'react'
import { IProduct } from '../../../types/IProduct'
import './checkout-product.scss'

interface CheckoutProps {
    product: IProduct;
    quantity: number;

    onProductQuantityChanged: (productId: number, quantity: number) => void;
}

const CheckoutProduct: FC<CheckoutProps> = ({ product, quantity, onProductQuantityChanged }) => {

    const onIncreaseQuantity = () => {
        onProductQuantityChanged(product.id, quantity + 1)
    }

    const onDecreaseQuantity = () => {
        onProductQuantityChanged(product.id, quantity - 1)
    }

    return (
        <li className='checkout-product rlt'>
            <div className='checkout-product__info rlt'>
                <img className='checkout-product__image' src={product.images.find(img => img.isMain)?.url} />
                <div className='checkout-product__desc clt'>
                    <div className='checkout-product__title'>{product.title}</div>
                    <div className='checkout-product__brand'>{product.brand}</div>
                    <div className='checkout-product__remove'>Видалити</div>
                </div>
            </div>

            <div className='checkout-product__prices rlc'>
                <div className='checkout-product__prices-block ccc'>
                    <div className='checkout-product__prices-subtitle'>Ціна</div>
                    <div className='checkout-product__price'>{product.price} ₴</div>
                </div>
                <div className='checkout-product__prices-block ccc'>
                    <div className='checkout-product__prices-subtitle'>Сума</div>
                    <div className='checkout-product__quantity-counter rlt'>
                        <div className='checkout-product__quantity-action' onClick={onDecreaseQuantity}>-</div>
                        <div className='checkout-product__quantity'>{quantity}</div>
                        <div className='checkout-product__quantity-action' onClick={onIncreaseQuantity}>+</div>
                    </div>
                </div>

                <div className='checkout-product__prices-block ccc'>
                    <div className='checkout-product__prices-subtitle'>Сума</div>
                    <div className='checkout-product__price'>{product.price * quantity} ₴</div>
                </div>
            </div>

        </li>
    )
}

export default CheckoutProduct