import classNames from 'classnames';
import { FC, useEffect } from 'react';
import ProductCard from '../../../components/ProductCard/ProductCard';
import { ViewMode } from './ProductCatalog/ProductCatalog';
import Pagination from '../../../lib/components/Pagination/Pagination';
import { observer, useLocalObservable } from 'mobx-react-lite';
import { IProduct } from '../../../types/magento/IProduct';

interface ProductGridProps {
  products: IProduct[];
  viewMode: ViewMode;
  maxPages: number;
  onChangePage: (page: number) => void;
  onSelectProduct?: (product: IProduct) => void;
  onOpenQuickView?: (product: IProduct) => void;
}

interface LocalStore {
  selectedPage: number;
}

const ProductGrid: FC<ProductGridProps> = observer(({ products, viewMode, maxPages, onChangePage, onSelectProduct, onOpenQuickView = () => { } }) => {
  const localStore = useLocalObservable<LocalStore>(() => ({
    selectedPage: 1,
  }))


  const backPage = () => {
    if (localStore.selectedPage !== 1) {
      --localStore.selectedPage;
      onChangePage(localStore.selectedPage);
    }
  }

  const nextPage = () => {
    if (localStore.selectedPage !== maxPages) {
      ++localStore.selectedPage;
      onChangePage(localStore.selectedPage);
    }
  }

  const selectPage = (page: number) => {
    localStore.selectedPage = page;
    onChangePage(localStore.selectedPage);
  }

  return (
    <div className='ccc catalog__product-grid-cont' >
      <div className={classNames('catalog__products-grid', {
        'rlt': viewMode === ViewMode.GRID,
        'clc': viewMode === ViewMode.LIST
      })}>
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
      {maxPages > 1 &&
        <Pagination
          maxPages={maxPages}
          currentPage={localStore.selectedPage}
          back={backPage}
          next={nextPage}
          setPage={selectPage} />
      }
    </div>
  )
})

export default ProductGrid