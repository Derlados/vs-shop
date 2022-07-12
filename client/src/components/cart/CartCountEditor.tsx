import React, { FC } from 'react';
import '../../styles/components/cart/cart-count-editor.scss';

interface CartCountEditorProps {
    decrement: () => void;
    increment: () => void;
    onChange: (count: number) => void;
    selectedCount: number;
}

const CartCountEditor: FC<CartCountEditorProps> = ({ decrement, increment, onChange, selectedCount }) => {

    return (
        <div className='cart-count-editor rlc'>
            <span className='cart-count-editor__btn ccc' onClick={decrement}>-</span>
            <input className='cart-count-editor__count ccc' value={selectedCount} onChange={(v) => onChange(v.target.value !== '' ? +v.target.value : 1)} type="number" />
            <span className='cart-count-editor__btn ccc' onClick={increment}>+</span>
        </div>
    )
}

export default CartCountEditor