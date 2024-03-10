import { FC, useEffect } from 'react';
import './product.scss';
import { observer, useLocalObservable } from 'mobx-react-lite';
import ProductCard from '../../components/ProductCard/ProductCard';
import { Navigate, useParams } from 'react-router-dom';
import CatalogNav from '../../components/Category/CatalogNav/CatalogNav';
import SliderProducts from '../../components/SliderProducts/SliderProducts';
import Loader from '../../lib/components/Loader/Loader';
import { ROUTES } from '../../values/routes';
import productStore from '../../stores/product/product.store';
import catalogHelper from '../../helpers/catalog.helper';
import catalogStore from '../../stores/catalog/catalog.store';
import categoryHelper from '../../helpers/category.helper';

type ProductParams = {
  sku: string | undefined;
}

const Product: FC = observer(() => {
  const { sku } = useParams<ProductParams>();

  useEffect(() => {
    if (sku) {
      productStore.loadProduct(sku);
    }
  }, []);

  if (sku && (productStore.status === "loading" || productStore.status === "initial")) {
    return (
      <div className='product__loader ccc'>
        <Loader />
      </div>
    )
  }

  if (productStore.status === "success" && productStore.product) {
    return (
      <div className='product ccc'>
        <CatalogNav routes={[
          {
            to: `/${ROUTES.SHOP_ROUTE}/${productStore.category ? categoryHelper.getUrlPath(productStore.category) : ''}`,
            title: productStore.category?.name ?? ''
          },
          { to: `/${productStore.product.sku}`, title: productStore.product.name },
        ]} />
        <div className='product__container rlc'>
          <ProductCard product={productStore.product} type="full-view" />
        </div>
        {/* Когда контент добавится  <ProductDesc /> */}
        {productStore.relatedProducts?.length > 0 && (
          <SliderProducts title="Товари від цього ж бренду" products={productStore.relatedProducts} />
        )}
      </div>
    )
  }

  return <Navigate to={'/404_not_found'} replace />
});

export default Product