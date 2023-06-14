import Filters from './components/Filters/Filters'
import ProductCatalog from './components/ProductCatalog/ProductCatalog'
import './shop.scss';
import CatalogNav from '../../components/Category/CatalogNav/CatalogNav';
import { observer, useLocalObservable } from 'mobx-react-lite';
import { Navigate, useNavigate, useParams } from 'react-router-dom';
import Loader from '../../lib/components/Loader/Loader';
import PopularProducts from './components/PopularProducts/PopularProducts';
import { IProduct } from '../../types/IProduct';
import { useQuery } from '../../lib/hooks/useQuery';
import FilterCategories, { IFilterCategory } from './components/Filters/FilterCategories/FilterCategories';
import ProductFilters from './components/Filters/ProductFilters/ProductFilters';
import { FC, useEffect } from 'react';
import { ROUTES } from '../../values/routes';
import catalog from '../../store/catalog';
import { FilterOptions } from '../../services/products/products.service';
import filterUrlTransformer from "../../helpers/FilterUrlTransformer";
import { SortType } from '../../enums/SortType.enum';
import PopupWindow from '../../components/PopupWindow/PopupWindow';
import searchStore, { SearchStoreStatus } from '../../store/search/search.store';
import LoadingMask from './components/LoadingMask/LoadingMask';

interface LocalStore {
    isFilterOpen: boolean;
    isValidCategory: boolean;
    filterCategories: IFilterCategory[];
    filters: FilterOptions;
}

interface ShopProps {
    isGlobalSearch?: boolean;
}

const Shop: FC<ShopProps> = observer(({ isGlobalSearch }) => {
    const navigate = useNavigate();
    const { catalog: categoryRoute } = useParams();
    const queryParams = useQuery();

    const localStore = useLocalObservable<LocalStore>(() => ({
        isFilterOpen: false,
        isValidCategory: false,
        filterCategories: [],
        filters: {}
    }));

    const restoreFilters = () => {
        localStore.filters.search = queryParams.get('search');
        localStore.filters.brands = queryParams.get('brands')?.split(',') ?? [];
        localStore.filters.minPrice = filterUrlTransformer.parseNumber(queryParams.get('minPrice') ?? "");
        localStore.filters.maxPrice = filterUrlTransformer.parseNumber(queryParams.get('maxPrice') ?? "");
        localStore.filters.sort = filterUrlTransformer.parseEnumSort(queryParams.get('sort') ?? "") ?? SortType.NOT_SELECTED;
        localStore.filters.filter = filterUrlTransformer.parseFilters(queryParams.get('filter') ?? "");
    }
    restoreFilters();


    useEffect(() => {
        if (isGlobalSearch) {
            searchStore.initGlobalSearch(queryParams.get('search') ?? '');
        } else {
            searchStore.init(categoryRoute ?? "", localStore.filters);
        }
    }, [isGlobalSearch]);

    useEffect(() => {
        if (categoryRoute) {
            searchStore.init(categoryRoute ?? "", localStore.filters);
        }
    }, [categoryRoute])

    useEffect(() => {
        if (searchStore.category?.routeName == categoryRoute && searchStore.status === SearchStoreStatus.success) {
            searchStore.updateCatalog(localStore.filters);
        }
    }, [categoryRoute, queryParams])

    const groupByCategories = (products: IProduct[]): IFilterCategory[] => {
        const categoryMap = new Map<number, number>();
        for (const product of products) {
            categoryMap.set(product.categoryId, (categoryMap.get(product.categoryId) ?? 0) + 1)
        }

        const filterCategories: IFilterCategory[] = [];
        for (const [categoryId, productCount] of categoryMap) {
            const category = catalog.getCategoryById(categoryId);
            if (category) {
                filterCategories.push({
                    name: category.name,
                    link: `/${ROUTES.CATEGORY_PREFIX}${category.routeName}?search=${localStore.filters.search}`,
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

    ///////////////////////////////////////// FILTERS PRODUCTS /////////////////////////////////////


    const onSelectPrice = (min: number, max: number) => {
        localStore.filters.minPrice = min;
        localStore.filters.maxPrice = max;

        acceptFiltersChange();
    }

    const onSelectBrand = (brand: string, checked: boolean) => {
        if (checked) {
            localStore.filters.brands?.push(brand);
        } else {
            localStore.filters.brands = localStore.filters.brands?.filter(b => b != brand)

        }

        acceptFiltersChange();
    }

    const onSelectSort = (sortType: SortType) => {
        localStore.filters.sort = sortType;
        acceptFiltersChange();
    }

    const onCheckFilterAttribute = (attributeId: number, valueId: number, checked: boolean) => {
        if (!localStore.filters.filter) {
            localStore.filters.filter = new Map<number, number[]>();
        }

        if (!localStore.filters.filter.has(attributeId)) {
            localStore.filters.filter.set(attributeId, []);
        }

        if (checked) {
            localStore.filters.filter.get(attributeId)?.push(valueId);
        } else {
            const values = localStore.filters.filter.get(attributeId);
            if (values) {
                localStore.filters.filter.set(attributeId, values?.filter(v => v !== valueId));
            }

            if (localStore.filters.filter.get(attributeId)?.length === 0) {
                localStore.filters.filter.delete(attributeId);
            }
        }

        acceptFiltersChange();
    }

    const acceptFiltersChange = () => {
        const urlParams = filterUrlTransformer.buildFilterUrl(localStore.filters);
        if (!urlParams) {
            navigate('');
        } else {
            navigate({
                pathname: '',
                search: decodeURIComponent(urlParams)
            });
        }
    }


    if (searchStore.status == SearchStoreStatus.loading || searchStore.status == SearchStoreStatus.initial) {
        console.log('loading');
        return (
            <div className='shop__loader ccc'>
                <Loader />
            </div>
        )
    }

    if (searchStore.status == SearchStoreStatus.failure) {
        return <Navigate to={'/404_not_found'} replace />
    }

    if (searchStore.status == SearchStoreStatus.wrongCategoryFailure) {
        return <Navigate to={'/404_not_found'} replace />
    }

    return (
        <div className='shop clt' >
            {searchStore.status == SearchStoreStatus.updating && <LoadingMask />}
            {!isGlobalSearch ?
                <CatalogNav routes={[{
                    to: `/${ROUTES.CATEGORY_PREFIX}${categoryRoute}`,
                    title: searchStore.status == SearchStoreStatus.success ? searchStore.category?.name : ""
                }]} /> :
                <CatalogNav routes={[]} />
            }
            <div className='rct'>
                <div className='shop__side-bar clt'>
                    <Filters isOpen={localStore.isFilterOpen} onClose={onCloseFilters} >
                        {!isGlobalSearch ?
                            <ProductFilters
                                selectedFilters={localStore.filters}
                                onCheckFilter={onCheckFilterAttribute}
                                onCheckBrand={onSelectBrand}
                                onSelectRange={onSelectPrice}
                            />
                            :
                            <FilterCategories filterCategories={groupByCategories(searchStore.products)} />
                        }
                    </Filters>
                    {searchStore.popularProducts.length !== 0 && categoryRoute && <PopularProducts categoryRoute={categoryRoute} products={searchStore.popularProducts} />}
                </div>
                <div className='shop__content'>
                    {searchStore.products.length !== 0 ?
                        <ProductCatalog
                            selectedSortType={localStore.filters.sort ?? SortType.NOT_SELECTED}
                            products={searchStore.products}
                            onSelectSort={onSelectSort}
                            onOpenFilters={onOpenFilters}
                        />
                        :
                        <div className='shop__emprty-catalog rcc'>
                            <div className='shop__empty-catalog-icon'></div>
                            <div className='shop__nothing-found-text'>За даними фільтрами нічого не знайдено</div>
                        </div>
                    }
                </div>
            </div>
            <PopupWindow />
            <div className='shop__loading-mask'></div>
        </div>
    )
});

export default Shop