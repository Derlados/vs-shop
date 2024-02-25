import React, { FC } from 'react';
import './cart-count-editor.scss';

interface CartCountEditorProps {
  onChange: (count: number) => void;
  selectedCount: number;
}

const CartCountEditor: FC<CartCountEditorProps> = ({ onChange, selectedCount }) => {

  return (
    <div className='cart-count-editor rlc'>
      <div className='cart-count-editor__btn ccc' onClick={() => onChange(selectedCount - 1)}>-</div>
      <input
        className='cart-count-editor__count ccc'
        type="number"
        value={selectedCount}
        onChange={(v) => onChange(v.target.value !== '' ? +v.target.value : 1)} />
      <div className='cart-count-editor__btn ccc' onClick={() => onChange(selectedCount + 1)}>+</div>
    </div>
  )
}

export default CartCountEditor