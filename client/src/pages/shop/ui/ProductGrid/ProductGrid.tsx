import classNames from 'classnames';
import { FC } from 'react';
import { ViewMode } from '../ProductCatalog/ProductCatalog';
import Pagination from '../../../../lib/components/Pagination/Pagination';
import { observer } from 'mobx-react-lite';
import { IProduct } from '../../../../types/magento/IProduct';
import LoadingMask from '../LoadingMask/LoadingMask';
import shopPageStore from '../../../../stores/pages/shop-page/shop-page.store';
import ProductSmallCard from '../../../../components/ProductSmallCard/ProductSmallCard';
import ProductLargeCard from '../../../../components/ProductLargeCard/ProductLargeCard';

interface ProductGridProps {
  products: IProduct[];
  viewMode: ViewMode;
  isLoading?: boolean;
  onSelectProduct?: (product: IProduct) => void;
  onOpenQuickView?: (product: IProduct) => void;
}


const ProductGrid: FC<ProductGridProps> = observer(({
  products, viewMode, isLoading, onSelectProduct, onOpenQuickView = () => {}
}) => {
  return (
    <div className='ccc catalog__product-grid-cont'>
      <div className={classNames('catalog__products-grid', {
        'rlt': viewMode === ViewMode.GRID,
        'clc': viewMode === ViewMode.LIST
      })}>
        {isLoading && <LoadingMask />}
        {products.map(product =>
          <div key={product.id} className={classNames('catalog__product-container ccc', {
            'catalog__product-container_large': viewMode === ViewMode.LIST,
            'catalog__product-container_inactive-links': onSelectProduct !== undefined
          })} onClick={onSelectProduct ? () => onSelectProduct(product) : () => { }}>
            {viewMode === ViewMode.GRID && <ProductSmallCard product={product} onOpenQuickView={onOpenQuickView} />}
            {viewMode === ViewMode.LIST && <ProductLargeCard product={product} onOpenQuickView={onOpenQuickView} />}
          </div>
        )}
        {/* for normal view with flex-wrap and space between */}
        {[...Array(4).keys()].map(num => (
          <div key={`empty-${num}`} className={classNames('catalog__product-container ccc', {
            'catalog__product-container_large': viewMode === ViewMode.LIST
          })}/>
        ))}
      </div>
      {shopPageStore.totalPages > 1 &&
        <Pagination
          maxPages={shopPageStore.totalPages}
          currentPage={shopPageStore.currentPage}
          back={() => shopPageStore.selectPage(shopPageStore.currentPage - 1)}
          next={() => shopPageStore.selectPage(shopPageStore.currentPage + 1)}
          setPage={(page) => shopPageStore.selectPage(page)} />
      }
    </div>
  )
})

export default ProductGrid