import React, { Suspense } from 'react'
import Filters from './components/Filters'
import Pagination from './components/Pagination'
import ProductCatalog from './components/ProductCatalog'
import '../../styles/shop/shop.scss';
import '../../styles/shop/filters.scss';
import '../../styles/shop/catalog.scss';
import '../../styles/shop/pagination.scss';
import CatalogNav from '../../components/CatalogNav';
import { observer, useLocalObservable } from 'mobx-react-lite';
import { useParams } from 'react-router-dom';
import { useEffect } from 'react';
import shop from '../../store/shop';
import catalog from '../../store/catalog';

interface LocalStore {
    isInit: boolean;
    isFilterOpen: boolean;
}

const Shop = observer(() => {
    const { catalog: catalogRoute } = useParams();
    const localStore = useLocalObservable<LocalStore>(() => ({
        isInit: false,
        isFilterOpen: false
    }))

    useEffect(() => {
        localStore.isInit = false;
        if (catalogRoute) {
            catalog.init(catalogRoute).then(() => {
                localStore.isInit = true
            });
        }
    }, [catalogRoute]);


    const onOpenFilters = () => {
        localStore.isFilterOpen = true;
        document.body.style.overflowY = "hidden";
    }

    const onCloseFilters = () => {
        localStore.isFilterOpen = false;
        document.body.style.overflowY = "";
    }

    return (
        localStore.isInit ?
            <div className='shop clt'>
                <CatalogNav />
                <div className='rct'>
                    <Filters isOpen={localStore.isFilterOpen} onClose={onCloseFilters} />
                    <div className='shop__content'>
                        <ProductCatalog onOpenFilters={onOpenFilters} />
                    </div>
                </div>
            </div>
            :
            <div>Loading...</div>
    )
});

export default Shop