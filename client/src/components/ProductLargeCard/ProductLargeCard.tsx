import { observer } from 'mobx-react-lite';
import { FC } from 'react'
import CartButton from '../CartButton/cart-button';
import './product-card-large.scss';
import { NavLink } from 'react-router-dom';
import classNames from 'classnames';
import { IProduct, StockStatus } from '../../types/magento/IProduct';
import cartStore from '../../stores/cart/cart.store';
import mediaHelper from '../../helpers/media.helper';
import productHelper from '../../helpers/product.helper';
import FormatHelper from '../../helpers/format.helper';
import { useCart } from '../../providers/cart/cart.provider';
import useProduct from '../../hooks/useProduct';

export interface SimpleProductCardProps {
  product: IProduct;
  onOpenQuickView: (product: IProduct) => void;
}

const ProductLargeCard: FC<SimpleProductCardProps> = observer(({
  product,
  onOpenQuickView,
}) => {
  const { productUrl, mainImage, specialPrice, manufacturer, description } = useProduct(product);
  const { addToCart } =  useCart();

  return (
    <div className='product-card-large rlt'>
      <div className='product-card-large__img-container'>
        <NavLink to={productUrl}>
          <img
            className='product-card__img product-card-large__img'
            alt={product.name}
            src={mainImage ? mediaHelper.getCatalogFileUrl(mainImage, "product") : require('../../assets/images/no-photos.png')}
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
        <NavLink to={productUrl} className="rlc">
          <span className='product-card-large__title'>{product.name}</span>
        </NavLink>
        <span className='product-card-large__brand'>{manufacturer}</span>
        <div className='product-card-large__price rlc'>
          <span className='product-card-large__current-price'>{FormatHelper.formatCurrency(specialPrice ?? product.price, 0)}</span>
          {specialPrice &&
            <span className='product-card-large__old-price'>{FormatHelper.formatCurrency(product.price, 0)}</span>
          }
        </div>
        <div className='product-card-large__desc'>{description}</div>
        <div className='product-card-large__footer rlc'>
          {product.extension_attributes.stock_status !== StockStatus.OUT_OF_STOCK &&
            <CartButton color="primary"
              sku={product.sku}
              isActive={cartStore.cart.items.find(item => item.sku === product.sku) === undefined}
              onClick={() => addToCart(product)}
            />
          }
          <div className={classNames('product-card__availability product-card-large__availability', {
            'product-card__availability_green': product.extension_attributes.stock_status === StockStatus.IN_STOCK,
            'product-card__availability_yellow': product.extension_attributes.stock_status === StockStatus.RUNNING_LOW,
            'product-card__availability_red': product.extension_attributes.stock_status === StockStatus.OUT_OF_STOCK,
          })}>
            {productHelper.getStockStatusLabel(product)}
          </div>
        </div>
      </div>
    </div>
  )
});

export default ProductLargeCard