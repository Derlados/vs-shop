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
import { Navigate, useParams } from 'react-router-dom';
import { useEffect } from 'react';
import shop from '../../store/shop';
import catalog from '../../store/catalog';
import Loader from '../../lib/Loader/Loader';

interface LocalStore {
    isLoaded: boolean;
    isFilterOpen: boolean;
}

const Shop = observer(() => {
    const { catalog: catalogRoute } = useParams();
    const localStore = useLocalObservable<LocalStore>(() => ({
        isLoaded: true,
        isFilterOpen: false
    }))

    useEffect(() => {
        async function fetchProducts() {
            if (catalogRoute) {
                await catalog.init(catalogRoute)
                localStore.isLoaded = false;
            }
        }

        localStore.isLoaded = true;
        fetchProducts();
    }, [catalogRoute]);

    const onOpenFilters = () => {
        localStore.isFilterOpen = true;
        document.body.style.overflowY = "hidden";
    }

    const onCloseFilters = () => {
        localStore.isFilterOpen = false;
        document.body.style.overflowY = "";
    }

    if (!localStore.isLoaded && catalog.products.length !== 0) {
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
    } else if (localStore.isLoaded) {
        return (
            <div className='shop__loader ccc'>
                <Loader />
            </div>
        )
    } else {
        return <Navigate to={'/404_not_found'} />
    }
});

export default Shop