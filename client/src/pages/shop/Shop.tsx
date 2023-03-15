import Filters from './components/Filters/Filters'
import ProductCatalog from './components/ProductCatalog/ProductCatalog'
import './shop.scss';
import CatalogNav from '../../components/Category/CatalogNav/CatalogNav';
import { observer, useLocalObservable } from 'mobx-react-lite';
import { Navigate, useLocation, useNavigate, useParams } from 'react-router-dom';
import shop from '../../store/shop';
import Loader from '../../lib/components/Loader/Loader';
import PopularProducts from './components/PopularProducts/PopularProducts';
import { IProduct } from '../../types/IProduct';
import { useQuery } from '../../lib/hooks/useQuery';
import FilterCategories, { IFilterCategory } from './components/Filters/FilterCategories/FilterCategories';
import ProductFilters from './components/Filters/ProductFilters/ProductFilters';
import { useEffect } from 'react';
import { ICategory } from '../../types/ICategory';
import { ROUTES } from '../../values/routes';
import catalog from '../../store/catalog';
import { FilterOptions } from '../../services/products/products.service';
import filterUrlTransformer from "../../helpers/FilterUrlTransformer";
import { SortType } from '../../enums/SortType.enum';
import products from '../../store/product';

interface LocalStore {
    isInited: boolean;
    category?: ICategory;
    isFilterOpen: boolean;
    isValidCategory: boolean;
    popularProducts: IProduct[];
    filterCategories: IFilterCategory[];
    filters: FilterOptions;
}


const Shop = observer(() => {
    const navigate = useNavigate();
    const { catalog: categoryRoute } = useParams();
    const queryParams = useQuery();

    const localStore = useLocalObservable<LocalStore>(() => ({
        isInited: false,
        isFilterOpen: false,
        isValidCategory: false,
        popularProducts: [],
        filterCategories: [],
        filterAttributes: [],
        filters: {}
    }))

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
        console.log("category route updated")
        async function fetchProducts() {
            if (categoryRoute) {
                await products.fetchProducts(categoryRoute, localStore.filters)
                localStore.category = catalog.getCategoryByRoute(categoryRoute);
                localStore.popularProducts = shop.getBestsellersByCategory(products.category.id);
            }

            localStore.isInited = true;
        }

        localStore.isInited = false;
        fetchProducts();
    }, [categoryRoute])

    useEffect(() => {
        if (localStore.isInited && categoryRoute) {
            console.log("params updated")
            products.fetchProducts(categoryRoute, localStore.filters)
        }
    }, [queryParams])

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
                    link: `/${ROUTES.CATEGORY_PREFIX}${category.routeName}/search/?text=${localStore.filters.search}`,
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

    // if (!localStore.isValidCategory) {
    //     return <Navigate to={'/404_not_found'} replace />
    // }

    if (!localStore.isInited) {
        return (
            <div className='shop__loader ccc'>
                <Loader />
            </div>
        )
    }

    if (localStore.isInited && products.products.length === 0) {
        return (
            <div className='shop__nothing-found ccc'>
                <div className='shop__nothing-found-icon'></div>
                <span className='shop__nothing-found-text'>По вашому запиту нічого не знайдено. Спробуйте інший</span>
            </div>
        )
    }

    return (
        <div className='shop clt' >
            <CatalogNav routes={localStore.category ? [{ to: `/${ROUTES.CATEGORY_PREFIX}${categoryRoute}`, title: localStore.category.name }] : []} />
            <div className='rct'>
                <div className='shop__side-bar clt'>
                    <Filters isOpen={localStore.isFilterOpen} onClose={onCloseFilters} >
                        {categoryRoute ?
                            <ProductFilters
                                selectedFilters={localStore.filters}
                                onCheckFilter={onCheckFilterAttribute}
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
                    {products.products.length !== 0 ?
                        <ProductCatalog
                            selectedSortType={localStore.filters.sort ?? SortType.NOT_SELECTED}
                            products={products.products}
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
            <div className='shop__loading-mask'></div>
        </div>
    )
});

export default Shop