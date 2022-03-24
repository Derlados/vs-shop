import React, { FC, useEffect } from 'react'
import cart from '../../store/cart';
import shop from '../../store/shop';
import { IProduct } from '../../types/types'
import ProductMainInfo from './components/ProductMainInfo';
import '../../styles/product/product.scss';
import { observer, useLocalObservable } from 'mobx-react-lite';
import ProductDesc from './components/ProductDesc';
import RelatedProducts from './components/RelatedProducts';
import Product from '../shop/components/product-card/Product';
import { useNavigate, useParams } from 'react-router-dom';

type ProductParams = {
    id: string;
};

interface LocalStore {
    product: IProduct;
}

const ProductInfo: FC = observer(() => {
    const navigation = useNavigate();
    const { id } = useParams<ProductParams>();
    const localStore = useLocalObservable<LocalStore>(() => ({
        product: shop.emptyProduct
    }));

    const map = new Map<string, string>();
    map.values()

    useEffect(() => {
        if (!id || !Number.isInteger(parseInt(id))) {
            navigation('/shop');
        } else {
            try {
                localStore.product = shop.findProductById(+id);
            } catch (e) {
                navigation('/shop');
            }
        }
    }, [id]);


    return (
        <div className='product ccc'>
            <div className='product__container rlc'>
                <Product product={localStore.product} type="full-view" />
            </div>
            {/* Когда контент добавится  <ProductDesc /> */}
            <RelatedProducts />
        </div>
    )
});

export default ProductInfo