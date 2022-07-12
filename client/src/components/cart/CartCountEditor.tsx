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
            <div className='cart-count-editor__btn ccc' onClick={decrement}>-</div>
            <input className='cart-count-editor__count ccc' value={selectedCount} onChange={(v) => onChange(v.target.value !== '' ? +v.target.value : 1)} type="number" />
            <div className='cart-count-editor__btn ccc' onClick={increment}>+</div>
        </div>
    )
}

export default CartCountEditor