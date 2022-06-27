import { observer } from 'mobx-react-lite';
import React, { FC } from 'react'
import CartButton from '../../../../components/CartButton';
import cart from '../../../../store/cart';
import { ProductCardProps } from './Product';
import '../../../../styles/product/product-card-large.scss';
import { SpecSymbols } from '../../../../values/specSymbols';
import { NavLink } from 'react-router-dom';

const ProductLargeCard: FC<ProductCardProps> = observer(({ product, urlFull, addToCart, onOpenQuickView, getMainImage }) => {
    return (
        <div className='product-card-large rlt'>
            <NavLink to={urlFull}>
                <div className='product-card-large__img-container'>
                    <img className='product-card__img product-card-large__img' alt='' src={getMainImage(product)?.url ?? require('../../../../assets/images/no-photos.png')} />
                    <div className='product-card__labels product-card__labels_large ccc'>
                        {product.isNew && <div className='product-card__label product-card__label_green'>New</div>}
                        {product.discountPercent !== 0 && <div className='product-card__label product-card__label_red'>-{product.discountPercent} %</div>}
                    </div>
                    <div className='product-card__actions ccc'>
                        <div className='product-card__action-mask' onClick={() => onOpenQuickView(product)}>
                            <div className='product-card__quick-view'></div>
                        </div>
                    </div>
                </div>
            </NavLink>
            <div className='product-card-large__info clt'>
                <NavLink to={urlFull}>
                    <span className='product-card__name product-card-large__title'>{product.title}</span>
                </NavLink>
                <span className='product-card__brand'>STUDIO DESIGN</span>
                <div className='product-card__price rlc'>
                    {product.discountPercent !== 0 && <span className='product-card__old-price  product-card-large__price'>{product.oldPrice}{SpecSymbols.NBSP}₴</span>}
                    <span className='product-card__current-price  product-card-large__price'>{product.price}{SpecSymbols.NBSP}₴</span>
                </div>
                <div className='product-card-large__desc'>Lorem ipsum dolor sit amet, consetetur sadipscing elitr, sed diam nonumy eirmod tempor invidunt ut labore et dolore magna aliquyam erat, sed diam voluptua. Phasellus id nisi quis justo tempus mollis sed et dui. In hac habitasse platea dictumst. Suspendisse ultrices mauris diam. Nullam sed aliquet elit.</div>
                <div className='rlc'>
                    <CartButton color="primary" isActive={cart.findById(product.id) === undefined} onClick={() => addToCart(product)} />
                </div>
            </div>
        </div>
    )
});

export default ProductLargeCard