import { observer } from 'mobx-react-lite'
import { FC } from 'react'
import CartButton from '../../Cart/CartButton/CartButton';
import cart from '../../../store/cart/cart';
import { SimpleProductCardProps } from '../ProductCard';
import { NavLink } from 'react-router-dom';
import "aos/dist/aos.css";
import classNames from 'classnames';
import { AvailableStatus } from '../../../types/IProduct';

const ProductSmallCard: FC<SimpleProductCardProps> = observer(({ containerSize = 'default', product, addToCart, onOpenQuickView, getMainImage }) => {

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
            <NavLink className='product-card__img-cont' to={product.url}>
                <img className='product-card__img' alt='' src={getMainImage(product)?.url ?? require('../../../assets/images/no-photos.png')} />
            </NavLink>
            <div className='product-card__line'></div>
            <div className='product-card__desc'>
                <div className='product-card__title product-card__title_gray rlc'>{product.brand}</div>
                <NavLink className='product-card__title-nav ccc' to={product.url}>
                    <div className='product-card__title'>{product.title}</div>
                </NavLink>
                <div className={`product-card__price-and-btn ${containerSize == 'default' ? 'rlc' : 'ccc'}`}>
                    <div className={`product-card__prices ${containerSize == 'default' ? '' : 'product-card__prices_margin'} rlc`}>
                        <div className='product-card__current-price'>{product.price}₴</div>
                        {product.oldPrice !== product.price && <div className='product-card__old-price'>{product.oldPrice}₴</div>}
                    </div>
                    {product.availability !== AvailableStatus.OUT_OF_STOCK && <CartButton className={`product-card__cart-btn ${containerSize == 'default' ? '' : 'product-card__cart-btn_large'}`} isActive={cart.findById(product.id) === undefined} onClick={() => addToCart(product)} />}
                </div>
                {containerSize === 'default' &&
                    <div className={classNames('product-card__availability', {
                        'product-card__availability_green': product.availability === AvailableStatus.IN_STOCK,
                        'product-card__availability_yellow': product.availability === AvailableStatus.IN_STOKE_FEW,
                        'product-card__availability_gray': product.availability === AvailableStatus.OUT_OF_STOCK,
                    })}>
                        {product.availability}
                    </div>
                }
            </div>

        </div>
    )
});

export default ProductSmallCard