import ProductCatalog from './ui/ProductCatalog/ProductCatalog'
import './shop.scss';
import CatalogNav from '../../components/Category/CatalogNav/CatalogNav';
import { observer } from 'mobx-react-lite';
import { Navigate, useParams } from 'react-router-dom';
import { FC, useEffect } from 'react';
import { ROUTES } from '../../values/routes';
import filtersStore from '../../stores/filters/filters.store';
import ProductFilters from './ui/ProductFilters/ProductFilters';
import Filters from './ui/Filters/Filters';
import shopPageStore from '../../stores/pages/shop-page/shop-page.store';
import FilterCategories from './ui/Filters/FilterCategories/FilterCategories';
import useFilterSearchParams from '../../hooks/useFilterSearchParams';
import DobleBounceLoader from '../../lib/components/DobleBounceLoader/DobleBounceLoader';

interface ShopProps {
  isGlobalSearch?: boolean;
}

const Shop: FC<ShopProps> = observer(({ isGlobalSearch }) => {
  const { categoryPath } = useParams();
  const [{
    page, search, sort, minPrice, maxPrice, attributeFilters
  }, updateParams] = useFilterSearchParams();

  useEffect(() => {
    filtersStore.setDefaultState();
    shopPageStore.setDefaultState();

    shopPageStore.init(categoryPath, search, page);
    filtersStore.init(shopPageStore.currentCategoryId, {
      minPrice,
      maxPrice,
      selectedFilters: attributeFilters,
      sort,
    });

    return () => {
      filtersStore.setDefaultState();
      shopPageStore.setDefaultState();
    }
  }, [categoryPath]);

  useEffect(() => {
    if (filtersStore.status === 'success' && shopPageStore.currentCategoryId !== 0) {
      shopPageStore.updateProducts(filtersStore.filterGroups);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [
    filtersStore.status,
    filtersStore.filterGroups,
    shopPageStore.currentCategoryId,
    shopPageStore.currentPage,
    shopPageStore.search,
  ]);

  useEffect(() => {
    updateParams({
      page: shopPageStore.currentPage,
      search: shopPageStore.search,
      sort: filtersStore.selectedSort,
      minPrice: filtersStore.selectedPriceRange.min,
      maxPrice: filtersStore.selectedPriceRange.max,
      attributeFilters: filtersStore.selectedFilters,
    });
  }, [
    shopPageStore.search,
    shopPageStore.currentPage,
    filtersStore.selectedSort,
    filtersStore.selectedPriceRange,
    filtersStore.selectedFilters,
  ]);

  if (shopPageStore.status === "initial") {
    return (
      <div className='shop__loader ccc'>
        <DobleBounceLoader color='primary' size='large' />
      </div>
    )
  }


  if (!shopPageStore.isValidCategory || !shopPageStore.category || shopPageStore.status === "error") {
    return <Navigate to={'/404_not_found'} replace />
  }

  return (
    <div className='shop clt' >
      {!isGlobalSearch ?
        <CatalogNav routes={[{
          to: `/${ROUTES.CATEGORY_PREFIX}/${categoryPath}`,
          title: shopPageStore.category?.name || ""
        }]} /> :
        <CatalogNav routes={[]} />
      }
      <div className='rct'>
        <div className='shop__side-bar clt'>
          <Filters isOpen={shopPageStore.isFilterOpen} onClose={() => shopPageStore.isFilterOpen = false}>
            {isGlobalSearch
              ? <FilterCategories filterCategories={[]} />
              : <ProductFilters category={shopPageStore.category} />
            }
          </Filters>
          {/* {searchStore.popularProducts.length !== 0 && categoryRoute && <PopularProducts categoryRoute={categoryRoute} products={searchStore.popularProducts} />} */}
        </div>
        <div className='shop__content'>
          {shopPageStore.products.length !== 0 && (
            <ProductCatalog
              selectedSortType={filtersStore.selectedSort}
              products={shopPageStore.products}
              onOpenFilters={() => shopPageStore.openFilters()}
              isLoading={shopPageStore.status === "loading"}
            />
          )}
          {shopPageStore.products.length === 0 && shopPageStore.status === 'success' && (
            <div className='shop__emprty-catalog rcc'>
              <div className='shop__empty-catalog-icon'></div>
              <div className='shop__nothing-found-text'>За даними фільтрами нічого не знайдено</div>
            </div>
          )}
        </div>
      </div>
      {/* <PopupWindow /> */}
    </div>
  );
});

export default Shop