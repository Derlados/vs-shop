import { observer } from 'mobx-react-lite'
import { FC } from 'react'
import CartButton from '../../Cart/CartButton/CartButton';
import cart from '../../../store/cart/cart';
import { ProductCardProps } from '../ProductCard';
import { NavLink } from 'react-router-dom';
import "aos/dist/aos.css";
import classNames from 'classnames';
import { AvailableStatus } from '../../../types/IProduct';
import { IProduct } from '../../../types/magento/IProduct';
import productHelper from '../../../helpers/product.helper';

export interface SimpleProductCardProps extends ProductCardProps {
  containerSize?: "default" | "small";
  onOpenQuickView: (product: IProduct) => void;
  urlFull: string;
}

const ProductSmallCard: FC<SimpleProductCardProps> = observer(({
  containerSize = 'default',
  product,
  updateCart,
  onOpenQuickView,
  mainImage,
  specialPrice
}) => {
  return (
    <div className='product-card ccc'>
      <div className='product-card__labels ccc'>
        {productHelper.isNew(product) && <div className='product-card__label product-card__label_green'>New</div>}
        {specialPrice &&
          <div className='product-card__label product-card__label_red'>- {productHelper.calculateDiscountPercent(product)} %</div>
        }
      </div>
      <div className='product-card__actions ccc'>
        <div className='product-card__action-mask' onClick={() => onOpenQuickView(product)}>
          <div className='product-card__quick-view'></div>
        </div>
      </div>
      <NavLink className='product-card__img-cont' to={`/shop/${product.sku}`}>
        <img className='product-card__img' alt='' src={mainImage ?? require('../../../assets/images/no-photos.png')} />
      </NavLink>
      <div className='product-card__line' />
      <div className='product-card__desc'>
        <div className='product-card__title product-card__title_gray rlc'>{ }</div>
        <NavLink className='product-card__title-nav ccc' to={`/shop/${product.sku}`}>
          <div className='product-card__title'>{product.name}</div>
        </NavLink>
        <div className={`product-card__price-and-btn ${containerSize == 'default' ? 'rlc' : 'ccc'}`}>
          <div className={`product-card__prices ${containerSize == 'default' ? '' : 'product-card__prices_margin'} rlc`}>
            <div className='product-card__current-price'>{product.price}₴</div>
            {specialPrice !== product.price && <div className='product-card__old-price'>{specialPrice}₴</div>}
          </div>
          {product.status !== AvailableStatus.OUT_OF_STOCK &&
            <CartButton
              className={`product-card__cart-btn ${containerSize == 'default' ? '' : 'product-card__cart-btn_large'}`}
              isActive={cart.findById(product.id) === undefined}
              onClick={() => updateCart('add', product)}
            />}
        </div>
        {containerSize === 'default' &&
          <div className={classNames('product-card__availability', {
            'product-card__availability_green': product.status === AvailableStatus.IN_STOCK,
            'product-card__availability_yellow': product.status === AvailableStatus.IN_STOKE_FEW,
            'product-card__availability_gray': product.status === AvailableStatus.OUT_OF_STOCK,
          })}>
            {product.status}
          </div>
        }
      </div>

    </div>
  )
});

export default ProductSmallCard