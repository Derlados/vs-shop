import classNames from 'classnames';
import { observer } from 'mobx-react-lite';
import React, { FC, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import './cart-quick.scss';
import cartStore from '../../stores/cart/cart.store';
import ICartItem from '../../types/magento/ICartItem';
import uiStore from '../../stores/ui/ui.store';
import CartCountEditor from '../CartCountEditor/CartCountEditor';

const CartQuickView: FC = observer(() => {
  const navigation = useNavigate();
  const wrapperRef = useRef(null);

  useEffect(() => {
    document.body.style.overflowY = uiStore.isOpenSidebarCart ? 'hidden' : 'auto';
  }, [uiStore.isOpenSidebarCart])


  const onDeleteProduct = (product: ICartItem) => {
    cartStore.removeProduct(product.item_id);
  }

  const handleClickOutside = (event: React.MouseEvent) => {
    if (wrapperRef.current && !(wrapperRef.current as any).contains(event.target)) {
      uiStore.closeSidebarCart();
    }
  }

  const openCheckout = () => {
    navigation('/checkout');
    uiStore.closeSidebarCart();
  }

  const openProductInfo = (product: ICartItem) => {
    navigation(`/product/${product.sku}`);
    uiStore.closeSidebarCart();
  }

  const onChangeCount = (product: ICartItem, newCount: number) => {
    cartStore.updateProduct(product.item_id, newCount)
  }


  return (
    <div className={classNames("cart-quick", {
      "cart-quick_hide": !uiStore.isOpenSidebarCart,
    })} onClick={handleClickOutside}>
      <div className='cart-quick__container' ref={wrapperRef} >
        <div className='cart-quick__head rcc'>
          <div className='cart-quick__head-text'>Кошик</div>
          <div className='cart-quick__close cart-quick__close_anim' onClick={() => uiStore.closeSidebarCart()}></div>
        </div>
        {cartStore.cart?.items.length != 0
          ?
          <div className='cart-quick__content'>
            <ul className='cart-quick__product-list'>
              {cartStore.cart?.items.map(item => (
                <li key={item.item_id} className='cart-quick__product rlt'>
                  {/* <img className='cart-quick__product-img' alt='' src={item.product.images[0].url} onClick={() => openProductInfo(item.product)} /> */}
                  <div className='cart-quick__product-desc'>
                    <div className='cart-quick__product-head rct'>
                      <div className='cart-quick__product-title' onClick={() => openProductInfo(item)}>{item.name}</div>
                      <div className='cart-quick__close cart-quick__close_delete' onClick={() => onDeleteProduct(item)}></div>
                    </div>
                    <div className='cart-quick__product-count rlc'>
                      <CartCountEditor
                        sku={item.sku}
                        onChange={(count) => onChangeCount(item, count)}
                        selectedCount={item.qty}
                      />
                      <span className='cart-quick__product-price'>{(item.price * item.qty).toFixed(2)} ₴</span>
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