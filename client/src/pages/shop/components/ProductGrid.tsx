import classNames from 'classnames';
import { FC } from 'react';
import ProductCard from '../../../components/ProductCard/ProductCard';
import { ViewMode } from './ProductCatalog/ProductCatalog';
import Pagination from '../../../lib/components/Pagination/Pagination';
import { observer } from 'mobx-react-lite';
import { IProduct } from '../../../types/magento/IProduct';
import shopStore from '../../../stores/shop/shop.store';
import LoadingMask from './LoadingMask/LoadingMask';

interface ProductGridProps {
  products: IProduct[];
  viewMode: ViewMode;
  isLoading?: boolean;
  onSelectProduct?: (product: IProduct) => void;
  onOpenQuickView?: (product: IProduct) => void;
}


const ProductGrid: FC<ProductGridProps> = observer(({ products, viewMode, isLoading, onSelectProduct, onOpenQuickView = () => { } }) => {

  const selectPage = (page: number) => {
    if (page < 1 || page > shopStore.totalPages) {
      return;
    }

    shopStore.selectPage(page);
  }

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
            <ProductCard
              type={viewMode === ViewMode.GRID ? 'small' : 'large'}
              product={product}
              onOpenQuickView={onOpenQuickView} />
          </div>
        )}
        {/* Для нормальной работы flex-wrap и space between */}
        {[...Array(4).keys()].map(num => (
          <div key={`empty-${num}`} className={classNames('catalog__product-container ccc', {
            'catalog__product-container_large': viewMode === ViewMode.LIST
          })}>

          </div>
        ))}
      </div>
      {shopStore.totalPages > 1 &&
        <Pagination
          maxPages={shopStore.totalPages}
          currentPage={shopStore.currentPage}
          back={() => selectPage(shopStore.currentPage - 1)}
          next={() => selectPage(shopStore.currentPage + 1)}
          setPage={selectPage} />
      }
    </div>
  )
})

export default ProductGrid