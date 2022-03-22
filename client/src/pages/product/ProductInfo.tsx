import React, { FC } from 'react'
import cart from '../../store/cart';
import shop from '../../store/shop';
import { IProduct } from '../../types/types'
import ProductMainInfo from './components/ProductMainInfo';
import '../../styles/product/product.scss';
import { observer, useLocalObservable } from 'mobx-react-lite';
import ProductDesc from './components/ProductDesc';
import RelatedProducts from './components/RelatedProducts';
import Product from '../shop/components/product-card/Product';


const ProductInfo: FC = observer(() => {
    const product = shop.products[0];
    const map = new Map<string, string>();
    map.values()


    return (
        <div className='product ccc'>
            <div className='product__container rlc'>
                <Product product={product} type="full-view" />
            </div>
            {/* Когда контент добавится  <ProductDesc /> */}
            <RelatedProducts />
        </div>
    )
});

export default ProductInfo