import classNames from 'classnames';
import { observer, useLocalObservable } from 'mobx-react-lite'
import { FC } from 'react';
import catalog from '../../../store/catalog'
import { IProduct } from '../../../types/IProduct';
import CatalogSettings from './CatalogSettings';
import Pagination from './Pagination';
import Product from './product-card/Product';
import ProductQuickModal from './product-card/ProductQuickModal';

const MAX_PRODUCTS_BY_PAGE = 24;

export enum ViewMode {
    GRID,
    LIST
}

interface LocalStore {
    selectedViewMode: ViewMode;
    selectedProduct: IProduct;
    isOpenQuick: boolean
}

interface ProductCatalogProps {
    onOpenFilters: () => void;
}

const ProductCatalog: FC<ProductCatalogProps> = observer(({ onOpenFilters }) => {

    const localStore = useLocalObservable<LocalStore>(() => ({
        selectedViewMode: ViewMode.GRID,
        selectedProduct: catalog.filteredProducts[0],
        isOpenQuick: false
    }))

    const selectViewMode = (viewMode: ViewMode) => {
        localStore.selectedViewMode = viewMode;
    }

    const openQuickView = (product: IProduct) => {
        document.body.style.overflowY = "hidden";
        localStore.selectedProduct = product;
        localStore.isOpenQuick = true;
    }

    const closeQuickView = () => {
        document.body.style.overflowY = "";
        localStore.isOpenQuick = false;
    }

    const products = catalog.filteredProducts.slice((catalog.selectedPage - 1) * MAX_PRODUCTS_BY_PAGE, catalog.selectedPage * MAX_PRODUCTS_BY_PAGE);

    return (
        <div className='catalog ccc'>
            {localStore.selectedProduct && <ProductQuickModal isOpen={localStore.isOpenQuick} product={localStore.selectedProduct} onCloseQuickView={closeQuickView} />}
            <CatalogSettings selectedViewMode={localStore.selectedViewMode} onSelectViewMode={selectViewMode} onOpenFilters={onOpenFilters} />
            <div className={classNames('catalog__products', {
                'rlt': localStore.selectedViewMode === ViewMode.GRID,
                'clc': localStore.selectedViewMode === ViewMode.LIST
            })}>
                {products.map(product =>
                    <div key={product.id} className={classNames('catalog__product-container ccc', {
                        'catalog__product-container_large': localStore.selectedViewMode === ViewMode.LIST
                    })}>
                        <Product
                            key={product.id}
                            type={localStore.selectedViewMode === ViewMode.GRID ? 'small' : 'large'}
                            product={product}
                            onOpenQuickView={openQuickView} />
                    </div>
                )}
                {/* Для нормальной работы flex-wrap и space between */}
                {[...Array(4).keys()].map(num => (
                    <div key={`empty-${num}`} className={classNames('catalog__product-container ccc', {
                        'catalog__product-container_large': localStore.selectedViewMode === ViewMode.LIST
                    })}>

                    </div>
                ))}
            </div>
            <Pagination
                maxPages={catalog.maxPages}
                currentPage={catalog.selectedPage}
                back={() => catalog.backPage()}
                next={() => catalog.nextPage()}
                setPage={(page: number) => catalog.selectPage(page)} />
        </div>
    )
});

export default ProductCatalog