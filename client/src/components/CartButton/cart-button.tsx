import classNames from 'classnames';
import React, { FC } from 'react';
import './cart-button.scss';
import { SpecSymbols } from '../../values/specSymbols';
import SmallLoader from '../../lib/components/SmallLoader/SmallLoader';
import { observer } from 'mobx-react-lite';
import cartStore from '../../stores/cart/cart.store';
import uiStore from '../../stores/ui/ui.store';

interface CartButtonProps {
  className?: string;
  sku: string;
  onClick: () => void;
  isActive: boolean;
  color?: "gray" | "primary";
}

const CartButton: FC<CartButtonProps> = observer(({ className = '', sku, isActive, onClick, color = "gray" }) => {

  if (cartStore.status == "loading" && cartStore.processingSku == sku) {
    return (
      <div className={`${className} cart-button cart-button_inactive cart-button_added rlc`}>
        <div className='cart-button__loader-container ccc'>
          <SmallLoader />
        </div>
      </div>
    )
  }

  if (isActive) {
    return (
      <div className={classNames(`${className} cart-button rlc`, {
        'cart-button_primary': color == "primary"
      })} onClick={onClick}>
        <div className='cart-button__img' ></div>
        <span className='cart-button__btn'>Купити</span>
      </div>
    )
  }

  return (
    <div className={`${className} cart-button cart-button_added rlc`} onClick={() => uiStore.openSidebarCart()}>
      <div className='cart-button__img' ></div>
      <span className='cart-button__btn '>У{SpecSymbols.NBSP}кошику</span>
    </div>
  )
});

export default CartButton