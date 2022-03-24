import classNames from 'classnames';
import React, { FC } from 'react';
import '../styles/components/cart-button.scss';

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
                <span className='cart-button__btn'>ADD TO CART</span>
            </div>
        )
    } else {
        return (
            <div className='cart-button  cart-button_added rlc'>
                <div className='cart-button__img' ></div>
                <span className='cart-button__btn '>IN CART</span>
            </div>
        )
    }
}

export default CartButton