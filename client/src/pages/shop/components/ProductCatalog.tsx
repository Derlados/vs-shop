import classNames from 'classnames';
import { observer, useLocalObservable } from 'mobx-react-lite'
import { FC } from 'react';
import CatalogNav from '../../../components/CatalogNav';
import cart from '../../../store/cart';
import shop from '../../../store/shop'
import { IProduct } from '../../../types/types';
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
        selectedProduct: shop.filteredProducts[0],
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

    const products = shop.filteredProducts.slice((shop.currentPage - 1) * MAX_PRODUCTS_BY_PAGE, shop.currentPage * MAX_PRODUCTS_BY_PAGE);

    return (
        <div className='catalog ccc'>
            <ProductQuickModal isOpen={localStore.isOpenQuick} product={localStore.selectedProduct} onCloseQuickView={closeQuickView} />
            <CatalogSettings selectedViewMode={localStore.selectedViewMode} onSelectViewMode={selectViewMode} onOpenFilters={onOpenFilters} />
            <div className={classNames('catalog__products', {
                'rlt': localStore.selectedViewMode == ViewMode.GRID,
                'clc': localStore.selectedViewMode == ViewMode.LIST
            })}>

                {products.map(product =>
                    <div key={product.id} className={classNames('catalog__product-container ccc', {
                        'catalog__product-container_large': localStore.selectedViewMode == ViewMode.LIST
                    })}>
                        <Product
                            key={product.id}
                            type={localStore.selectedViewMode == ViewMode.GRID ? 'small' : 'large'}
                            product={product}
                            onOpenQuickView={openQuickView} />
                    </div>
                )}
            </div>
            <Pagination
                maxPages={shop.maxPages}
                currentPage={shop.currentPage}
                back={() => shop.backPage()}
                next={() => shop.nextPage()}
                setPage={(page: number) => shop.setPage(page)} />
        </div>
    )
});

export default ProductCatalog