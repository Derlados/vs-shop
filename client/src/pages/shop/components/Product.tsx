import { observer } from 'mobx-react-lite';
import React, { FC } from 'react'
import { IProduct } from '../../../types/types'

interface ProductProps {
    product: IProduct;
}

const Product: FC<ProductProps> = observer(({ product }) => {

    const openFullView = () => {

    }

    const openQuickView = () => {

    }

    const addToCart = () => {

    }

    const addToFavorite = () => {

    }

    return (
        <div className='product ccc'>
            <div className='product__labels ccc'>
                {product.isNew && <div className='product__label product__label_green'>New</div>}
                {product.discountPercent != 0 && <div className='product__label product__label_red'>-{product.discountPercent} %</div>}
            </div>
            <div className='product__actions ccc'>
                <div className='product__action-mask'>
                    <div className='product__quick-view' onClick={openQuickView}></div>
                </div>
                <div className='product__action-mask'>
                    <div className='product__favorite' onClick={addToFavorite}></div>
                </div>
            </div>

            <img className='product__img' src={product.img} onClick={openFullView} />
            <span className='product__brand'>STUDIO DESIGN</span>
            <span className='product__name' onClick={openFullView}>{product.title}</span>
            <div className='product__price rlc'>
                {product.discountPercent != 0 && <span className='product__old-price'>{product.oldPrice} ₴</span>}
                <span className='product__current-price'>{product.price} ₴</span>
            </div>
            <div className='product__cart rlc' onClick={addToCart}>
                <div className='product__cart-img' ></div>
                <span className='product__cart-btn'>ADD TO CART</span>
            </div>
        </div>
    )
});

export default Product