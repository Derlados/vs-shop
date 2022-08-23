
import Filters from './components/Filters/Filters'
import ProductCatalog from './components/ProductCatalog/ProductCatalog'
import './shop.scss';
import CatalogNav from '../../components/Category/CatalogNav/CatalogNav';
import { observer, useLocalObservable } from 'mobx-react-lite';
import { Navigate, useNavigate, useParams } from 'react-router-dom';
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
    isLoadedData: boolean;
    isInited: boolean;
    isFilterOpen: boolean;
    popularProducts: IProduct[];
    filterCategories: IFilterCategory[];
}

const Shop = observer(() => {
    const navigate = useNavigate();
    const { catalog: categoryRoute, filters } = useParams();
    const searchText = (useQuery()).get("text");

    const localStore = useLocalObservable<LocalStore>(() => ({
        filterUrlBuilder: new FilterUrlBuilder(),
        isInited: false,
        isLoadedData: false,
        isFilterOpen: false,
        popularProducts: [],
        filterCategories: []
    }))

    useEffect(() => {
        if (!localStore.isLoadedData) {
            return;
        }

        catalog.clearFilters();
        if (!filters) {
            localStore.isInited = true;
            return;
        }

        const filtersUrl = localStore.filterUrlBuilder.parse(filters ?? '').build();

        if (filtersUrl !== filters) {
            window.history.replaceState(null, "New Page Title", `${catalog.category.routeName}/${filtersUrl}`);
        }

        if (localStore.filterUrlBuilder.priceRange) {
            const { min, max } = localStore.filterUrlBuilder.priceRange;
            catalog.selectPriceRange(min, max);
        }

        catalog.selectBrands(localStore.filterUrlBuilder.brands);
        const selectedFilters = localStore.filterUrlBuilder.filters;
        for (const [attributeId, valueIds] of selectedFilters) {
            catalog.setFilter(attributeId, ...valueIds)
        }

        localStore.isInited = true;
    }, [categoryRoute, filters, localStore.isLoadedData])

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
            localStore.isLoadedData = true;
        }

        localStore.isLoadedData = false;
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

    const onSelectPrice = (min: number, max: number) => {
        localStore.filterUrlBuilder.setPriceRange({ min: min, max: max });
        acceptFiltersChange();
    }

    const onSelectBrand = (brand: string, checked: boolean) => {
        if (checked) {
            localStore.filterUrlBuilder.selectBrand(brand)
        } else {
            localStore.filterUrlBuilder.deselectBrand(brand);
        }

        acceptFiltersChange();
    }

    const onSelectFilter = (attributeId: number, valueId: number, checked: boolean) => {
        if (checked) {
            localStore.filterUrlBuilder.selectFilter(attributeId, valueId)
        } else {
            localStore.filterUrlBuilder.deselectFilter(attributeId, valueId);
        }

        acceptFiltersChange();
    }

    const acceptFiltersChange = () => {
        navigate(`/${catalog.category.routeName}/${localStore.filterUrlBuilder.build()}${searchText ? `/search/?text=${searchText}` : ''}`);
    }

    if (!localStore.isInited) {
        return (
            <div className='shop__loader ccc'>
                <Loader />
            </div>
        )
    }

    if (localStore.isInited && !filters && searchText !== null && catalog.filteredProducts.length === 0) {
        return (
            <div className='shop__nothing-found ccc'>
                <div className='shop__nothing-found-icon'></div>
                <span className='shop__nothing-found-text'>По вашому запиту нічого не знайдено. Спробуйте інший</span>
            </div>
        )
    }


    if (localStore.isInited && categoryRoute && catalog.products.length === 0) {
        return <Navigate to={'/404_not_found'} />
    }


    return (
        <div className='shop clt' >
            <CatalogNav />
            <div className='rct'>
                <div className='shop__side-bar clt'>
                    <Filters isOpen={localStore.isFilterOpen} onClose={onCloseFilters} >
                        {categoryRoute ?
                            <ProductFilters
                                onCheckFilter={onSelectFilter}
                                onCheckBrand={onSelectBrand}
                                onSelectRange={onSelectPrice}
                            />
                            :
                            <FilterCategories filterCategories={localStore.filterCategories} />
                        }
                    </Filters>
                    {localStore.popularProducts.length !== 0 && categoryRoute && <PopularProducts categoryRoute={categoryRoute} products={localStore.popularProducts} />}
                </div>
                <div className='shop__content'>
                    {catalog.filteredProducts.length !== 0 ?
                        <ProductCatalog onOpenFilters={onOpenFilters} />
                        :
                        <div className='shop__emprty-catalog rcc'>
                            <div className='shop__empty-catalog-icon'></div>
                            <div className='shop__nothing-found-text'>За даними фільтрами нічого не знайдено</div>
                        </div>
                    }
                </div>
            </div>
        </div>
    )
});

export default Shop