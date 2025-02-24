import { FC, useEffect } from 'react';
import './product.scss';
import { observer } from 'mobx-react-lite';
import { Navigate, useParams } from 'react-router-dom';
import CatalogNav from '../../components/Category/CatalogNav/CatalogNav';
import SliderProducts from '../../components/SliderProducts/SliderProducts';
import { ROUTES } from '../../values/routes';
import productStore from '../../stores/product/product.store';
import categoryHelper from '../../helpers/category.helper';
import ProductInfo from '../../components/ProductInfo/ProductInfo';
import DobleBounceLoader from '../../lib/components/DobleBounceLoader/DobleBounceLoader';

type ProductParams = {
  sku: string | undefined;
}

const Product: FC = observer(() => {
  const { sku } = useParams<ProductParams>();

  useEffect(() => {
    if (sku) {
      loadProductInfo(sku);
    }
  }, [sku]);

  const loadProductInfo = async (sku: string) => {
    productStore.clear();

    await productStore.loadProduct(sku);
    if (productStore.product) {
      await productStore.loadRelatedProducts();
    }
  }

  if (sku && (productStore.productStatus === "loading" || productStore.productStatus === "initial")) {
    return (
      <div className='product__loader ccc'>
        <DobleBounceLoader size='large' color='primary' />
      </div>
    )
  }

  if (productStore.productStatus === "success" && productStore.product) {
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
          <ProductInfo product={productStore.product} view='full' />
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