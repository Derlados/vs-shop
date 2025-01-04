import { observer } from 'mobx-react-lite'
import { FC } from 'react'
import CartButton from '../CartButton/cart-button';
import { NavLink } from 'react-router-dom';
import "aos/dist/aos.css";
import "./product-card.scss";
import classNames from 'classnames';
import { IProduct, StockStatus } from '../../types/magento/IProduct';
import productHelper from '../../helpers/product.helper';
import mediaHelper from '../../helpers/media.helper';
import FormatHelper from '../../helpers/format.helper';
import { useCart } from '../../providers/cart/cart.provider';
import useProduct from '../../hooks/useProduct';

export interface SimpleProductCardProps {
  product: IProduct;
  containerSize?: "default" | "small";
  onOpenQuickView: (product: IProduct) => void;
}

const ProductSmallCard: FC<SimpleProductCardProps> = observer(({
  containerSize = 'default',
  product,
  onOpenQuickView
}) => {
  const { mainImage, specialPrice, productUrl, isInCart } = useProduct(product);
  const { addToCart } = useCart();

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
      <NavLink className='product-card__img-cont' to={productUrl}>
        <img
          className='product-card__img'
          alt=''
          src={mainImage ? mediaHelper.getCatalogFileUrl(mainImage, "product") : require('../../assets/images/no-photos.png')}
        />
      </NavLink>
      <div className='product-card__line' />
      <div className='product-card__desc'>
        <div className='product-card__title product-card__title_gray rlc'>{ }</div>
        <NavLink className='product-card__title-nav ccc' to={productUrl}>
          <div className='product-card__title'>{product.name}</div>
        </NavLink>
        <div
          className={classNames('product-card__price-and-btn', {
            'rlc': containerSize === 'default',
            'ccc': containerSize === 'small'
          })}
        >
          <div
            className={classNames('product-card__prices rlc', {
              'product-card__prices_margin': containerSize !== 'default'
            })}
          >
            <div className='product-card__current-price'>{FormatHelper.formatCurrency(specialPrice ?? product.price, 0)} грн</div>
            {specialPrice && specialPrice !== product.price &&
              <div className='product-card__old-price'>{FormatHelper.formatCurrency(product.price, 0)} грн</div>
            }
          </div>
          {product.extension_attributes.stock_status !== StockStatus.OUT_OF_STOCK &&
            <CartButton
              className={classNames('product-card__cart-btn', {
                'product-card__cart-btn_large': containerSize !== 'default'
              })}
              sku={product.sku}
              isActive={!isInCart}
              onClick={() => addToCart(product)}
            />}
        </div>
        {containerSize === 'default' &&
          <div className={classNames('product-card__availability', {
            'product-card__availability_green': product.extension_attributes.stock_status === StockStatus.IN_STOCK,
            'product-card__availability_yellow': product.extension_attributes.stock_status === StockStatus.RUNNING_LOW,
            'product-card__availability_red': product.extension_attributes.stock_status === undefined || product.extension_attributes.stock_status === StockStatus.OUT_OF_STOCK,
          })}>
            {productHelper.getStockStatusLabel(product)}
          </div>
        }
      </div>

    </div>
  )
});

export default ProductSmallCard