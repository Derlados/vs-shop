import { FC, useEffect } from 'react'
import products from '../../store/product';
import './product.scss';
import { observer, useLocalObservable } from 'mobx-react-lite';
import ProductCard from '../../components/ProductCard/ProductCard';
import { Navigate, useParams } from 'react-router-dom';
import CatalogNav from '../../components/Category/CatalogNav/CatalogNav';
import SliderProducts from '../../components/SliderProducts/SliderProducts';
import Loader from '../../lib/components/Loader/Loader';
import { ICategory } from '../../types/ICategory';
import { ROUTES } from '../../values/routes';
import catalog from '../../store/catalog';
import { IProduct } from '../../types/magento/IProduct';

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
    product: products.products[0],
    relatedProducts: [],
    category: catalog.categories[0],
    isLoading: true
  }));

  useEffect(() => {
    async function fetchProduct(productId: number) {
      localStore.isLoading = true;

      const product = await products.fetchProductById(productId);
      const category = catalog.getCategoryById(product.categoryId);

      if (!category || !product) {
        localStore.isLoading = false;
        return;
      }

      localStore.category = category;
      localStore.product = product;
      localStore.relatedProducts = await products.fetchRelatedProducts(product, 10);

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
      window.history.replaceState(null, localStore.product.name, localStore.product.url);
    }
  }

  if (localStore.product && !localStore.isLoading) {
    return (
      <div className='product ccc'>
        <CatalogNav routes={[
          { to: `/${ROUTES.CATEGORY_PREFIX}${localStore.category.routeName}`, title: localStore.category.name },
          { to: `/${localStore.product.url}`, title: localStore.product.name },
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