import { FC, useEffect } from 'react'
import catalog from '../../store/catalog';
import './product.scss';
import { observer, useLocalObservable } from 'mobx-react-lite';
import ProductCard from '../../components/ProductCard/ProductCard';
import { Navigate, useParams } from 'react-router-dom';
import CatalogNav from '../../components/Category/CatalogNav/CatalogNav';
import SliderProducts from '../../components/SliderProducts/SliderProducts';
import { IProduct } from '../../types/IProduct';
import Loader from '../../lib/components/Loader/Loader';
import shop from '../../store/shop';
import { ICategory } from '../../types/ICategory';
import { ROUTES } from '../../values/routes';

type ProductParams = {
    productName: string;
    id: string;
};

interface LocalStore {
    product: IProduct;
    relatedProducts: IProduct[];
    category: ICategory;
    isLoading: boolean;
}

const Product: FC = observer(() => {
    const { productName, id } = useParams<ProductParams>();
    const localStore = useLocalObservable<LocalStore>(() => ({
        product: catalog.products[0],
        relatedProducts: [],
        category: shop.categories[0],
        isLoading: true
    }));
    console.log(productName, id);

    useEffect(() => {
        async function fetchProduct(productId: number) {
            const product = await catalog.fetchProductById(productId);
            const category = shop.getCategoryById(product.categoryId);

            if (!category || !product) {
                localStore.isLoading = false;
                return;
            }

            localStore.category = category;
            localStore.product = product;
            localStore.relatedProducts = await catalog.fetchRelatedProducts(product, 10);

            correctUrl();
            localStore.isLoading = false;
        }

        if (!id || !Number.isInteger(parseInt(id))) {
            localStore.isLoading = false;
            return;
        }

        fetchProduct(Number(id));
    }, [id]);

    const correctUrl = () => {
        const translitProductName = localStore.product.url.split('/')[0];
        if (translitProductName !== productName) {
            window.history.replaceState(null, localStore.product.title, localStore.product.url);
        }
    }

    if (localStore.product) {
        return (
            <div className='product ccc'>
                <CatalogNav routes={[
                    { to: `/${ROUTES.CATEGORY_PREFIX}${localStore.category.routeName}`, title: localStore.category.name },
                    { to: `/${localStore.product.url}`, title: localStore.product.title },
                ]} />
                <div className='product__container rlc'>
                    <ProductCard product={localStore.product} type="full-view" />
                </div>
                {/* Когда контент добавится  <ProductDesc /> */}
                <SliderProducts title="Товари від цього ж бренду" products={localStore.relatedProducts} />
            </div>
        )
    } else if (localStore.isLoading) {
        return (
            <div className='product__loader ccc'>
                <Loader />
            </div>
        )
    } else {
        return <Navigate to={'/404_not_found'} replace />
    }
});

export default Product