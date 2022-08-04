import React, { Suspense } from 'react'
import Filters from './components/Filters/Filters'
import Pagination from './components/Pagination'
import ProductCatalog from './components/ProductCatalog'
import '../../styles/shop/shop.scss';
import '../../styles/shop/catalog.scss';
import '../../styles/shop/pagination.scss';
import CatalogNav from '../../components/Category/CatalogNav/CatalogNav';
import { observer, useLocalObservable } from 'mobx-react-lite';
import { Navigate, useParams } from 'react-router-dom';
import { useEffect } from 'react';
import shop from '../../store/shop';
import catalog from '../../store/catalog';
import Loader from '../../lib/Loader/Loader';
import PopularProducts from './components/PopularProducts/PopularProducts';
import { IProduct } from '../../types/IProduct';

interface LocalStore {
    isLoaded: boolean;
    isFilterOpen: boolean;
    popularProducts: IProduct[];
}

const Shop = observer(() => {
    const { catalog: categoryRoute } = useParams();
    const localStore = useLocalObservable<LocalStore>(() => ({
        isLoaded: true,
        isFilterOpen: false,
        popularProducts: []
    }))

    useEffect(() => {
        async function fetchProducts() {
            if (categoryRoute) {
                await catalog.init(categoryRoute)
                localStore.popularProducts = shop.getBestsellersByCategory(catalog.category.id);
                localStore.isLoaded = false;
            }
        }

        localStore.isLoaded = true;
        fetchProducts();
    }, [categoryRoute]);

    const onOpenFilters = () => {
        localStore.isFilterOpen = true;
        document.body.style.overflowY = "hidden";
    }

    const onCloseFilters = () => {
        localStore.isFilterOpen = false;
        document.body.style.overflowY = "";
    }

    if (categoryRoute && !localStore.isLoaded && catalog.products.length !== 0) {
        return (
            <div className='shop clt' >
                <CatalogNav />
                <div className='rct'>
                    <div className='shop__side-bar clt'>
                        <Filters isOpen={localStore.isFilterOpen} onClose={onCloseFilters} />
                        {localStore.popularProducts.length !== 0 && <PopularProducts categoryRoute={categoryRoute} products={localStore.popularProducts} />}
                    </div>
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