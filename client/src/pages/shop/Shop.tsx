
import Filters from './components/Filters/Filters'
import ProductCatalog from './components/ProductCatalog/ProductCatalog'
import './shop.scss';
import CatalogNav from '../../components/Category/CatalogNav/CatalogNav';
import { observer, useLocalObservable } from 'mobx-react-lite';
import { Navigate, useParams } from 'react-router-dom';
import shop from '../../store/shop';
import catalog from '../../store/catalog';
import Loader from '../../lib/components/Loader/Loader';
import PopularProducts from './components/PopularProducts/PopularProducts';
import { IProduct } from '../../types/IProduct';
import { useQuery } from '../../lib/hooks/useQuery';
import FilterCategories, { IFilterCategory } from './components/Filters/FilterCategories/FilterCategories';
import ProductFilters from './components/Filters/ProductFilters/ProductFilters';
import { useEffect } from 'react';
import { FilterUrlBuilder } from '../../lib/helpers/FiltersUrlBuilder';

interface LocalStore {
    filterUrlBuilder: FilterUrlBuilder;
    isLoaded: boolean;
    isFilterOpen: boolean;
    popularProducts: IProduct[];
    filterCategories: IFilterCategory[];
}

const Shop = observer(() => {
    const { catalog: categoryRoute, filters } = useParams();
    const searchText = (useQuery()).get("text");

    const localStore = useLocalObservable<LocalStore>(() => ({
        filterUrlBuilder: new FilterUrlBuilder(),
        isLoaded: true,
        isFilterOpen: false,
        popularProducts: [],
        filterCategories: []
    }))

    useEffect (() => {
        if (!categoryRoute) {
            return;
        }

        const filtersUrl = localStore.filterUrlBuilder.parse(filters ?? '').build();
        console.log(filtersUrl);

        if (filtersUrl !== filters) {
            window.history.replaceState(null, "New Page Title", `${catalog.category.routeName}/${filtersUrl}`);
        } 
    }, [categoryRoute, filters])

    useEffect(() => {
        async function fetchProducts() {
            if (categoryRoute) {
                await catalog.fetchByCategory(categoryRoute)
                if (searchText) {
                    catalog.setSearchString(searchText);
                }
            } else if (searchText) {
                await catalog.fetchProductsByText(searchText);
                localStore.filterCategories = groupByCategories(catalog.filteredProducts);
            }

            localStore.popularProducts = shop.getBestsellersByCategory(catalog.category.id);
            localStore.isLoaded = false;
        }

        localStore.isLoaded = true;
        fetchProducts();
    }, [categoryRoute, searchText]);

    const groupByCategories = (products: IProduct[]): IFilterCategory[] => {
        const categoryMap = new Map<number, number>();
        for (const product of products) {
            categoryMap.set(product.categoryId, (categoryMap.get(product.categoryId) ?? 0) + 1)
        }

        const filterCategories: IFilterCategory[] = [];
        for (const [categoryId, productCount] of categoryMap) {
            const category = shop.getCategoryById(categoryId);
            if (category) {
                filterCategories.push({
                    name: category.name,
                    link: `/${category.routeName}/search/?text=${searchText}`,
                    productCount: productCount
                })
            }
        }

        return filterCategories;
    }

    const onOpenFilters = () => {
        localStore.isFilterOpen = true;
        document.body.style.overflowY = "hidden";
    }

    const onCloseFilters = () => {
        localStore.isFilterOpen = false;
        document.body.style.overflowY = "";
    }

    if (localStore.isLoaded) {
        return (
            <div className='shop__loader ccc'>
                <Loader />
            </div>
        )
    }

    if (!localStore.isLoaded && searchText !== null && catalog.filteredProducts.length === 0) {
        return (
            <div className='shop__nothing-found ccc'>
                <div className='shop__nothing-found-icon'></div>
                <span className='shop__nothing-found-text'>По вашому запиту нічого не знайдено. Спробуйте інший</span>
            </div>
        )
    }

    // if (!localStore.isLoaded && categoryRoute && catalog.filteredProducts.length === 0) {
    //     return <Navigate to={'/404_not_found'} />
    // }

    return (
        <div className='shop clt' >
            <CatalogNav />
            <div className='rct'>
                <div className='shop__side-bar clt'>
                    <Filters isOpen={localStore.isFilterOpen} onClose={onCloseFilters} >
                        {categoryRoute ?
                            <ProductFilters />
                            :
                            <FilterCategories filterCategories={localStore.filterCategories} />
                        }
                    </Filters>
                    {localStore.popularProducts.length !== 0 && categoryRoute && <PopularProducts categoryRoute={categoryRoute} products={localStore.popularProducts} />}
                </div>
                <div className='shop__content'>
                    <ProductCatalog onOpenFilters={onOpenFilters} />
                </div>
            </div>
        </div>
    )
});

export default Shop