import ProductCatalog from './components/ProductCatalog/ProductCatalog'
import './shop.scss';
import CatalogNav from '../../components/Category/CatalogNav/CatalogNav';
import { observer, useLocalObservable } from 'mobx-react-lite';
import { Navigate, useParams } from 'react-router-dom';
import Loader from '../../lib/components/Loader/Loader';
import { FC, useEffect } from 'react';
import { ROUTES } from '../../values/routes';
import PopupWindow from '../../components/PopupWindow/PopupWindow';
import shopStore from '../../stores/shop/shop.store';
import catalogStore from '../../stores/catalog/catalog.store';
import filtersStore from '../../stores/filters/filters.store';
import ProductFilters from './components/Filters/ProductFilters/ProductFilters';
import Filters from './components/Filters/Filters';
import FilterCategories from './components/Filters/FilterCategories/FilterCategories';

interface LocalStore {
  isFilterOpen: boolean;
  isValidCategory: boolean;
  filterCategories: any[];
}

interface ShopProps {
  isGlobalSearch?: boolean;
}

const Shop: FC<ShopProps> = observer(({ isGlobalSearch }) => {
  const { categoryPath } = useParams();

  const localStore = useLocalObservable<LocalStore>(() => ({
    isFilterOpen: false,
    isValidCategory: true,
    filterCategories: [],
    category: undefined,
  }));

  useEffect(() => {
    filtersStore.clearFilters();
    shopStore.clear();

    if (!categoryPath) {
      localStore.isValidCategory = false;
      return;
    }

    const category = catalogStore.getCategoryByUrl(categoryPath);
    if (!category) {
      localStore.isValidCategory = false;
      return;
    }

    if (shopStore.currentCategoryId === category.id) return;

    shopStore.selectCategory(category.id);
    filtersStore.loadFilters(category.id);
  }, [categoryPath])

  useEffect(() => {
    if (shopStore.currentCategoryId === 0 || filtersStore.status === "loading") return;

    shopStore.updateProducts(filtersStore.filterGroups);
  }, [filtersStore.filterGroups, shopStore.currentCategoryId, shopStore.currentPage, shopStore.search])

  const onOpenFilters = () => {
    localStore.isFilterOpen = true;
  };

  if (shopStore.status === "initial") {
    return (
      <div className='shop__loader ccc'>
        <Loader />
      </div>
    )
  }

  if (!localStore.isValidCategory || shopStore.status === "error") {
    return <Navigate to={'/404_not_found'} replace />
  }

  return (
    <div className='shop clt' >
      {!isGlobalSearch ?
        <CatalogNav routes={[{
          to: `/${ROUTES.CATEGORY_PREFIX}/${categoryPath}`,
          title: catalogStore.getCategoryById(shopStore.currentCategoryId)?.name || ""
        }]} /> :
        <CatalogNav routes={[]} />
      }
      <div className='rct'>
        <div className='shop__side-bar clt'>
          <Filters isOpen={localStore.isFilterOpen} onClose={() => localStore.isFilterOpen = false}>
            {isGlobalSearch
              ? <FilterCategories filterCategories={[]} />
              : <ProductFilters category={catalogStore.getCategoryById(shopStore.currentCategoryId)!} />
            }
          </Filters>
          {/* {searchStore.popularProducts.length !== 0 && categoryRoute && <PopularProducts categoryRoute={categoryRoute} products={searchStore.popularProducts} />} */}
        </div>
        <div className='shop__content'>
          {shopStore.products.length !== 0 ?
            <ProductCatalog
              selectedSortType={filtersStore.selectedSort}
              products={shopStore.products}
              onOpenFilters={onOpenFilters}
              isLoading={shopStore.status === "loading"}
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
    </div>
  );
});

export default Shop