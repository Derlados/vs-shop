import { observer } from 'mobx-react-lite';
import { FC } from 'react'
import CartButton from '../../Cart/CartButton/CartButton';
import cart from '../../../store/cart';
import { SimpleProductCardProps } from '../ProductCard';
import './product-card-large.scss';
import { NavLink } from 'react-router-dom';
import classNames from 'classnames';
import { AvailableStatus } from '../../../types/IProduct';

const ProductLargeCard: FC<SimpleProductCardProps> = observer(({ product, addToCart, onOpenQuickView, getMainImage }) => {
    return (
        <div className='product-card-large rlt'>
            <div className='product-card-large__img-container'>
                <NavLink to={product.url}>
                    <img className='product-card__img product-card-large__img' alt='' src={getMainImage(product)?.url ?? require('../../../assets/images/no-photos.png')} />
                </NavLink>
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
            <div className='product-card-large__info clt'>
                <NavLink to={product.url} className="rlc">
                    <span className='product-card-large__title'>{product.title}</span>
                </NavLink>
                <span className='product-card-large__brand'>{product.brand}</span>
                <div className='product-card-large__price rlc'>
                    <span className='product-card-large__current-price'>{product.price}₴</span>
                    {product.oldPrice !== product.price && <span className='product-card-large__old-price'>{product.oldPrice}₴</span>}
                </div>
                <div className='product-card-large__desc'>Lorem ipsum dolor sit amet, consetetur sadipscing elitr, sed diam nonumy eirmod tempor invidunt ut labore et dolore magna aliquyam erat, sed diam voluptua. Phasellus id nisi quis justo tempus mollis sed et dui. In hac habitasse platea dictumst. Suspendisse ultrices mauris diam. Nullam sed aliquet elit.</div>
                <div className='product-card-large__footer rlc'>
                    {product.availability !== AvailableStatus.OUT_OF_STOCK && <CartButton color="primary" isActive={cart.findById(product.id) === undefined} onClick={() => addToCart(product)} />}
                    <div className={classNames('product-card__availability product-card-large__availability', {
                        'product-card__availability_green': product.availability === AvailableStatus.IN_STOCK,
                        'product-card__availability_yellow': product.availability === AvailableStatus.IN_STOKE_FEW,
                        'product-card__availability_gray': product.availability === AvailableStatus.OUT_OF_STOCK,
                    })}>
                        {product.availability}
                    </div>
                </div>
            </div>
        </div>
    )
});

export default ProductLargeCard