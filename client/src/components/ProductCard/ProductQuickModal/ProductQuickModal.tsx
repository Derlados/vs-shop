import { observer } from 'mobx-react-lite';
import React, { FC, useRef } from 'react';
import './product-modal.scss';
import ProductCard from '../ProductCard';
import classNames from 'classnames';
import { IProduct } from '../../../types/IProduct';

interface ProductQuickModalProps {
    isOpen: boolean;
    product: IProduct;
    onCloseQuickView: () => void;
}

/**
 * ЗАМЕТКА: Swipper в данной компоненте не корректно работает с 4 слайдами. Следовательно нужно либо больше, либо меньше
 */
const ProductQuickModal: FC<ProductQuickModalProps> = observer(({ isOpen, product, onCloseQuickView, }) => {
    const wrapperRef = useRef(null);

    const handleClickOutside = (event: React.MouseEvent) => {
        if (wrapperRef.current && !(wrapperRef.current as any).contains(event.target)) {
            onCloseQuickView();
        }
    }

    return (
        <div className={classNames('product-quick-modal ccc', {
            "product-quick-modal_open": isOpen
        })} onClick={handleClickOutside}>
            <div className={classNames('product-quick-modal__container rlc', {
                "product-quick-modal__container_open": isOpen
            })} ref={wrapperRef} >
                <ProductCard product={product} type="quick-view" />
                <div className='product-quick-modal__close' onClick={onCloseQuickView}></div>
            </div>
        </div >
    )
});

export default ProductQuickModal
