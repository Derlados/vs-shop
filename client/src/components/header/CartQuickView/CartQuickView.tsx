import classNames from 'classnames';
import { observer } from 'mobx-react-lite';
import React, { FC, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import './cart-quick.scss';
import { ICartProduct } from '../../../types/ICartProduct';
import cartStore from '../../../stores/cart/cart.store';
import { IProduct } from '../../../types/magento/IProduct';
import CartCountEditor from '../../cart/CartCountEditor/CartCountEditor';

interface CartQuickViewProps {
  isOpen: boolean;
  onClose: () => void;
}

const CartQuickView: FC<CartQuickViewProps> = observer(({ isOpen, onClose }) => {
  const navigation = useNavigate();
  const wrapperRef = useRef(null);

  const onDeleteProduct = (product: IProduct) => {
    cartStore.removeProduct(product.id);
  }

  const handleClickOutside = (event: React.MouseEvent) => {
    if (wrapperRef.current && !(wrapperRef.current as any).contains(event.target)) {
      onClose();
    }
  }

  const openCheckout = () => {
    navigation('/checkout');
    onClose();
  }

  const openProductInfo = (product: IProduct) => {
    navigation(`/product/${product.id}`);
    onClose();
  }

  const onChangeCount = (product: IProduct, newCount: number) => {
    cartStore.updateProduct(product.id, newCount)
  }


  return (
    <div className={classNames("cart-quick", {
      "cart-quick_hide": !isOpen
    })} onClick={handleClickOutside}>
      <div className='cart-quick__container' ref={wrapperRef} >
        <div className='cart-quick__head rcc'>
          <div className='cart-quick__head-text'>Кошик</div>
          <div className='cart-quick__close cart-quick__close_anim' onClick={onClose}></div>
        </div>
        {cartStore.cart?.items.length != 0
          ?
          <div className='cart-quick__content'>
            <ul className='cart-quick__product-list'>
              {cartStore.cart?.items.map(item => (
                <li key={item.product.id} className='cart-quick__product rlt'>
                  <img className='cart-quick__product-img' alt='' src={item.product.images[0].url} onClick={() => openProductInfo(item.product)} />
                  <div className='cart-quick__product-desc'>
                    <div className='cart-quick__product-head rct'>
                      <div className='cart-quick__product-title' onClick={() => openProductInfo(item.product)}>{item.product.title}</div>
                      <div className='cart-quick__close cart-quick__close_delete' onClick={() => onDeleteProduct(item.product)}></div>
                    </div>
                    <div className='cart-quick__product-count rlc'>
                      <CartCountEditor
                        onChange={(count) => onChangeCount(item, count)}
                        selectedCount={item.count}
                      />
                      <span className='cart-quick__product-price'>{(item.product.price * item.count).toFixed(2)} ₴</span>
                    </div>
                  </div>
                </li>
              ))}
            </ul>
            <div className='cart-quick__price rcc'>
              <div className='cart-quick__price-text'>Total</div>
              <div className='cart-quick__price-text'>{Number(cartStore.totals?.grand_total).toFixed(2)} ₴</div>
            </div>
            <div className='cart-quick__checkout ccc' onClick={openCheckout}>CHECKOUT</div>
          </div>
          :
          <div className='cart-quick__empty ccc'>
            <div className='cart-quick__cart-img'></div>
            <div className='cart-quick__no-products'>{"Ваш кошик порожній :("}</div>
          </div>
        }

      </div>

    </div>
  )
});

export default CartQuickView