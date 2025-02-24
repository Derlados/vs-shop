import { observer } from 'mobx-react-lite';
import React, { FC } from 'react';
import cartStore from '../../stores/cart/cart.store';
import './cart-count-editor.scss';
import DobleBounceLoader from '../../lib/components/DobleBounceLoader/DobleBounceLoader';

interface CartCountEditorProps {
  sku: string;
  onChange: (count: number) => void;
  selectedCount: number;
}

const CartCountEditor: FC<CartCountEditorProps> = observer(({ sku, onChange, selectedCount }) => {

  return (
    <div className='cart-count-editor rlc'>
      <div className='cart-count-editor__btn ccc' onClick={() => onChange(selectedCount - 1)}>-</div>
      <input
        className='cart-count-editor__count ccc'
        type="number"
        value={selectedCount}
        onChange={(v) => onChange(v.target.value !== '' ? +v.target.value : 1)} />
      <div className='cart-count-editor__btn ccc' onClick={() => onChange(selectedCount + 1)}>+</div>
      {cartStore.status === "loading" && cartStore.processingSku === sku && (
        <div className='cart-count-editor__loading-mask ccc'>
          <DobleBounceLoader />
        </div>
      )}
    </div>
  )
})

export default CartCountEditor