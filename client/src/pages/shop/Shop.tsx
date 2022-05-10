import React from 'react'
import Filters from './components/Filters'
import Pagination from './components/Pagination'
import ProductCatalog from './components/ProductCatalog'
import '../../styles/shop/shop.scss';
import '../../styles/shop/filters.scss';
import '../../styles/shop/catalog.scss';
import '../../styles/shop/pagination.scss';
import CatalogNav from '../../components/CatalogNav';
import { observer, useLocalObservable } from 'mobx-react-lite';

interface LocalStore {
    isFilterOpen: boolean;
}

const Shop = observer(() => {
    const localStore = useLocalObservable<LocalStore>(() => ({
        isFilterOpen: false
    }))

    const onOpenFilters = () => {
        localStore.isFilterOpen = true;
        document.body.style.overflowY = "hidden";
    }

    const onCloseFilters = () => {
        localStore.isFilterOpen = false;
        document.body.style.overflowY = "";
    }

    return (
        <div className='shop clt'>
            <CatalogNav />
            <div className='rct'>
                <Filters isOpen={localStore.isFilterOpen} onClose={onCloseFilters} />
                <div className='shop__content'>
                    <ProductCatalog onOpenFilters={onOpenFilters} />
                </div>
            </div>
        </div>
    )
});

export default Shop