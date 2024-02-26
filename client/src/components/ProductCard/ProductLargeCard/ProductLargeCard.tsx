import { observer } from 'mobx-react-lite';
import { FC } from 'react'
import CartButton from '../../Cart/CartButton/CartButton';
import './product-card-large.scss';
import { NavLink } from 'react-router-dom';
import classNames from 'classnames';
import { AvailableStatus } from '../../../types/IProduct';
import { ProductCardProps } from '../ProductCard';
import { IProduct } from '../../../types/magento/IProduct';
import cartStore from '../../../stores/cart/cart.store';
import mediaHelper from '../../../helpers/media.helper';
import productHelper from '../../../helpers/product.helper';
import catalogStore from '../../../magento_stores/catalog/catalog.store';

export interface SimpleProductCardProps extends ProductCardProps {
  onOpenQuickView: (product: IProduct) => void;
}

const ProductLargeCard: FC<SimpleProductCardProps> = observer(({
  product,
  onOpenQuickView,
  updateCart,
  mainImage,
  specialPrice,
  manufacturer,
  description,
}) => {
  return (
    <div className='product-card-large rlt'>
      <div className='product-card-large__img-container'>
        <NavLink to={`shop/${product.sku}`}>
          <img
            className='product-card__img product-card-large__img'
            alt={product.name}
            src={mainImage ? mediaHelper.getProductUrl(mainImage) : require('../../../assets/images/no-photos.png')}
          />
        </NavLink>
        <div className='product-card__labels product-card__labels_large ccc'>
          {productHelper.isNew(product) && <div className='product-card__label product-card__label_green'>New</div>}
          {productHelper.calculateDiscountPercent(product) !== 0 &&
            <div className='product-card__label product-card__label_red'>-{productHelper.calculateDiscountPercent(product)} %</div>
          }
        </div>
        <div className='product-card__actions ccc'>
          <div className='product-card__action-mask' onClick={() => onOpenQuickView(product)}>
            <div className='product-card__quick-view'></div>
          </div>
        </div>
      </div>
      <div className='product-card-large__info clt'>
        <NavLink to={`shop/${product.sku}`} className="rlc">
          <span className='product-card-large__title'>{product.name}</span>
        </NavLink>
        <span className='product-card-large__brand'>{manufacturer}</span>
        <div className='product-card-large__price rlc'>
          <span className='product-card-large__current-price'>{product.price}₴</span>
          {specialPrice &&
            <span className='product-card-large__old-price'>{specialPrice}₴</span>
          }
        </div>
        <div className='product-card-large__desc'>{description}</div>
        <div className='product-card-large__footer rlc'>
          {product.status !== AvailableStatus.OUT_OF_STOCK &&
            <CartButton color="primary"
              isActive={cartStore.cart.items.find(item => item.product.id === product.id) === undefined}
              onClick={() => updateCart('add', product)}
            />
          }
          <div className={classNames('product-card__availability product-card-large__availability', {
            'product-card__availability_green': product.status === AvailableStatus.IN_STOCK,
            'product-card__availability_yellow': product.status === AvailableStatus.IN_STOKE_FEW,
            'product-card__availability_gray': product.status === AvailableStatus.OUT_OF_STOCK,
          })}>
            {product.status}
          </div>
        </div>
      </div>
    </div>
  )
});

export default ProductLargeCard