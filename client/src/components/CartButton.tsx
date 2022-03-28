import classNames from 'classnames';
import React, { FC } from 'react';
import '../styles/components/cart-button.scss';
import { SpecSymbols } from '../values/specSymbols';

interface CartButtonProps {
    onClick: () => void;
    isActive: boolean;
    color?: "gray" | "primary";
}

const CartButton: FC<CartButtonProps> = ({ isActive, onClick, color = "gray" }) => {

    if (isActive) {
        return (
            <div className={classNames('cart-button rlc', {
                'cart-button_primary': color == "primary"
            })} onClick={onClick}>
                <div className='cart-button__img' ></div>
                <span className='cart-button__btn'>Купити</span>
            </div>
        )
    } else {
        return (
            <div className='cart-button  cart-button_added rlc'>
                <div className='cart-button__img' ></div>
                <span className='cart-button__btn '>У{SpecSymbols.NBSP}кошику</span>
            </div>
        )
    }
}

export default CartButton