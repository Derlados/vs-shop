import classNames from 'classnames';
import { observer, useLocalObservable } from 'mobx-react-lite'
import { FC } from 'react';
import catalog from '../../../store/catalog'
import { IProduct } from '../../../types/IProduct';
import CatalogSettings from './CatalogSettings';
import Pagination from './Pagination';
import Product from './product-card/Product';
import ProductQuickModal from './product-card/ProductQuickModal';
import ProductGrid from './ProductGrid';

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

    return (
        <div className='catalog ccc'>
            {localStore.selectedProduct && <ProductQuickModal isOpen={localStore.isOpenQuick} product={localStore.selectedProduct} onCloseQuickView={closeQuickView} />}
            <CatalogSettings selectedViewMode={localStore.selectedViewMode} onSelectViewMode={selectViewMode} onOpenFilters={onOpenFilters} />
            <ProductGrid products={catalog.filteredProducts} onOpenQuickView={openQuickView} viewMode={localStore.selectedViewMode} maxPerPage={MAX_PRODUCTS_BY_PAGE} />
        </div>
    )
});

export default ProductCatalog