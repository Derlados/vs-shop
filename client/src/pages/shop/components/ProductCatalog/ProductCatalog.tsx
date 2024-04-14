import { observer, useLocalObservable } from 'mobx-react-lite'
import { FC } from 'react';
import CatalogSettings from '../CatalogSettings';
import ProductQuickModal from '../../../../components/ProductCard/ProductQuickModal/ProductQuickModal';
import ProductGrid from '../ProductGrid';
import './catalog.scss';
import { SortType } from '../../../../enums/SortType.enum';
import { IProduct } from '../../../../types/magento/IProduct';

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
    isLoading: boolean;
    onOpenFilters: () => void;
}

const ProductCatalog: FC<ProductCatalogProps> = observer(({ products, selectedSortType = SortType.NOT_SELECTED, isLoading, onOpenFilters }) => {
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
                onSelectViewMode={selectViewMode}
                onOpenFilters={onOpenFilters}
            />
            <ProductGrid
                products={products}
                onOpenQuickView={openQuickView}
                viewMode={localStore.selectedViewMode}
                isLoading={isLoading}
            />
        </div>
    )
});

export default ProductCatalog