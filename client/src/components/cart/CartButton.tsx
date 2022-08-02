import classNames from 'classnames';
import React, { FC } from 'react';
import '../../styles/components/cart/cart-button.scss';
import { SpecSymbols } from '../../values/specSymbols';

interface CartButtonProps {
    className?: string;
    onClick: () => void;
    isActive: boolean;
    color?: "gray" | "primary";
}

const CartButton: FC<CartButtonProps> = ({ className = '', isActive, onClick, color = "gray" }) => {

    if (isActive) {
        return (
            <div className={classNames(`${className} cart-button rlc`, {
                'cart-button_primary': color == "primary"
            })} onClick={onClick}>
                <div className='cart-button__img' ></div>
                <span className='cart-button__btn'>Купити</span>
            </div>
        )
    } else {
        return (
            <div className={`${className} cart-button cart-button_added rlc`}>
                <div className='cart-button__img' ></div>
                <span className='cart-button__btn '>У{SpecSymbols.NBSP}кошику</span>
            </div>
        )
    }
}

export default CartButton