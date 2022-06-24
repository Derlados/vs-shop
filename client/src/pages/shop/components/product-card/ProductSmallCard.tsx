import { observer } from 'mobx-react-lite'
import React, { FC } from 'react'
import CartButton from '../../../../components/CartButton';
import cart from '../../../../store/cart';
import { ProductCardProps } from './Product';
import '../../../../styles/product/product-card.scss';
import { SpecSymbols } from '../../../../values/specSymbols';
import { IProduct } from '../../../../types/IProduct';
import { IImage } from '../../../../types/IImage';

const ProductSmallCard: FC<ProductCardProps> = observer(({ product, addToCart, openFullView, onOpenQuickView, getMainImage }) => {

    return (
        <div className='product-card ccc'>
            <div className='product-card__labels ccc'>
                {product.isNew && <div className='product-card__label product-card__label_green'>New</div>}
                {product.discountPercent !== 0 && <div className='product-card__label product-card__label_red'>{product.discountPercent} %</div>}
            </div>
            <div className='product-card__actions ccc'>
                <div className='product-card__action-mask' onClick={() => onOpenQuickView(product)}>
                    <div className='product-card__quick-view'></div>
                </div>
            </div>

            <img className='product-card__img' alt='' src={getMainImage(product).url} onClick={() => openFullView(product)} />
            <span className='product-card__brand'>STUDIO DESIGN</span>
            <span className='product-card__name' onClick={() => openFullView(product)}>{product.title}</span>
            <div className='product-card__price rlc'>
                {product.oldPrice !== product.price && <span className='product-card__old-price'>{product.oldPrice}{SpecSymbols.NBSP}₴</span>}
                <span className='product-card__current-price'>{product.price}{SpecSymbols.NBSP}₴</span>
            </div>
            <CartButton isActive={cart.findById(product.id) === undefined} onClick={() => addToCart(product)} />
        </div>
    )
});

export default ProductSmallCard