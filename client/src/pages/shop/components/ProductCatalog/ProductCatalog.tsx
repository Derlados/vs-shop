import classNames from 'classnames';
import { observer, useLocalObservable } from 'mobx-react-lite'
import { FC } from 'react';
import products from '../../../../store/product'
import { IProduct } from '../../../../types/IProduct';
import CatalogSettings from '../CatalogSettings';
import ProductQuickModal from '../../../../components/ProductCard/ProductQuickModal/ProductQuickModal';
import ProductGrid from '../ProductGrid';
import './catalog.scss';
import { SortType } from '../../../../enums/SortType.enum';
import searchStore from '../../../../store/search/search.store';

const MAX_PRODUCTS_BY_PAGE = 24;

export enum ViewMode {
    GRID,
    LIST
}

interface LocalStore {
    selectedViewMode: ViewMode;
    selectedSortType: SortType;
    selectedProduct?: IProduct;
    isOpenQuick: boolean
}

interface ProductCatalogProps {
    products: IProduct[];
    selectedSortType: SortType;
    onChangePage: (page: number) => void;
    onSelectSort: (sortType: SortType) => void;
    onOpenFilters: () => void;
}

const ProductCatalog: FC<ProductCatalogProps> = observer(({ products, selectedSortType = SortType.NOT_SELECTED, onChangePage, onSelectSort, onOpenFilters }) => {
    const localStore = useLocalObservable<LocalStore>(() => ({
        selectedViewMode: ViewMode.GRID,
        selectedSortType: selectedSortType,
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
            <CatalogSettings
                selectedSortType={selectedSortType}
                selectedViewMode={localStore.selectedViewMode}
                onSelectSort={onSelectSort}
                onSelectViewMode={selectViewMode}
                onOpenFilters={onOpenFilters}
            />
            <ProductGrid products={products} onOpenQuickView={openQuickView} viewMode={localStore.selectedViewMode} maxPages={searchStore.filters.maxPages} onChangePage={onChangePage} />
        </div>
    )
});

export default ProductCatalog