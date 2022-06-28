import { FC, useEffect } from 'react'
import catalog from '../../store/catalog';
import '../../styles/product/product.scss';
import { observer, useLocalObservable } from 'mobx-react-lite';
import Product from '../shop/components/product-card/Product';
import { Navigate, useParams } from 'react-router-dom';
import CatalogNav from '../../components/CatalogNav';
import SliderProducts from '../../components/SliderProducts';
import { IProduct } from '../../types/IProduct';
import Loader from '../../lib/Loader/Loader';

type ProductParams = {
    catalog: string;
    id: string;
};

interface LocalStore {
    product?: IProduct;
    isLoading: boolean;
}

const ProductInfo: FC = observer(() => {

    const { id, catalog: category } = useParams<ProductParams>();
    const localStore = useLocalObservable<LocalStore>(() => ({
        product: catalog.products[0],
        isLoading: true
    }));
    console.log("render", localStore.isLoading, localStore.product);

    useEffect(() => {
        async function fetchProduct(category: string) {
            if (catalog.products.length == 0) {
                await catalog.init(category);
            }

            const product = catalog.getProductById(Number(id))
            localStore.product = product;
            localStore.isLoading = false;
        }

        if (!id || !Number.isInteger(parseInt(id))) {
            localStore.isLoading = false;
            return;
        }

        if (category) {
            fetchProduct(category);
        }
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
    } else if (localStore.isLoading) {
        return (
            <div className='product__loader ccc'>
                <Loader />
            </div>
        )
    } else {
        return <Navigate to={'/404_not_found'} />
    }
});

export default ProductInfo