import { observer } from 'mobx-react-lite'
import { FC } from 'react'
import CartButton from '../../../../components/cart/CartButton';
import cart from '../../../../store/cart';
import { ProductCardProps } from './Product';
import '../../../../styles/product/product-card.scss';
import { SpecSymbols } from '../../../../values/specSymbols';
import { NavLink } from 'react-router-dom';
import "aos/dist/aos.css";

const ProductSmallCard: FC<ProductCardProps> = observer(({ containerSize = 'default', urlFull, product, addToCart, onOpenQuickView, getMainImage }) => {

    return (
        <div className='product-card ccc'>
            <div className='product-card__labels ccc'>
                {product.isNew && <div className='product-card__label product-card__label_green'>New</div>}
                {product.discountPercent !== 0 && <div className='product-card__label product-card__label_red'>- {product.discountPercent} %</div>}
            </div>
            <div className='product-card__actions ccc'>
                <div className='product-card__action-mask' onClick={() => onOpenQuickView(product)}>
                    <div className='product-card__quick-view'></div>
                </div>
            </div>
            <NavLink className='product-card__img-cont' to={`${urlFull}`}>
                <img className='product-card__img' alt='' src={getMainImage(product)?.url ?? require('../../../../assets/images/no-photos.png')} />
            </NavLink>
            <div className='product-card__line'></div>
            <div className='product-card__desc'>
                <div className='product-card__title product-card__title_gray rlc'>Intel corp</div>
                <NavLink className='product-card__title-cont ccc' to={`${urlFull}`}>
                    <div className='product-card__title'>Steampunk Coffee Grinder nice tool</div>
                </NavLink>
                <div className={`product-card__price-and-btn ${containerSize == 'default' ? 'rlc' : 'ccc'}`}>
                    <div className={`product-card__prices ${containerSize == 'default' ? '' : 'product-card__prices_margin'} rlc`}>
                        <div className='product-card__current-price'>{product.price}₴</div>
                        {product.oldPrice !== product.price && <div className='product-card__old-price'>{product.oldPrice}₴</div>}
                    </div>
                    <CartButton className={`product-card__cart-btn ${containerSize == 'default' ? '' : 'product-card__cart-btn_large'}`} isActive={cart.findById(product.id) === undefined} onClick={() => addToCart(product)} />
                </div>
            </div>

        </div>
    )
});

export default ProductSmallCard