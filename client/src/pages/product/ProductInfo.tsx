import { FC, useEffect } from 'react'
import catalog from '../../store/catalog';
import '../../styles/product/product.scss';
import { observer, useLocalObservable } from 'mobx-react-lite';
import Product from '../shop/components/product-card/Product';
import { useNavigate, useParams } from 'react-router-dom';
import CatalogNav from '../../components/CatalogNav';
import SliderProducts from '../../components/SliderProducts';
import { IProduct } from '../../types/IProduct';

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
        product: catalog.products[0]
    }));

    useEffect(() => {
        if (!id || !Number.isInteger(parseInt(id))) {
            navigation('/404_not_found')
            return;
        }

        const product = catalog.findProductById(parseInt(id));
        if (!product) {
            navigation('/404_not_found')
            return;
        }
        localStore.product = product;
    }, [id]);

    if (localStore.product) {
        return (
            <div className='product ccc'>
                <CatalogNav />
                <div className='product__container rlc'>
                    <Product product={localStore.product} type="full-view" />
                </div>
                {/* Когда контент добавится  <ProductDesc /> */}
                <SliderProducts title="You Might Also Like" products={[...catalog.products.slice(0, 8)]} />
            </div>
        )
    } else {
        return <div>Loading...</div>
    }

});

export default ProductInfo