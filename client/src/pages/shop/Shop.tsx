import ProductCatalog from './components/ProductCatalog/ProductCatalog'
import './shop.scss';
import CatalogNav from '../../components/Category/CatalogNav/CatalogNav';
import { observer, useLocalObservable } from 'mobx-react-lite';
import { useParams } from 'react-router-dom';
import Loader from '../../lib/components/Loader/Loader';
import { FC } from 'react';
import { ROUTES } from '../../values/routes';
import { SortType } from '../../enums/SortType.enum';
import PopupWindow from '../../components/PopupWindow/PopupWindow';
import LoadingMask from './components/LoadingMask/LoadingMask';
import shopStore from '../../stores/shop/shop.store';

interface LocalStore {
  isFilterOpen: boolean;
  isValidCategory: boolean;
}

interface ShopProps {
  isGlobalSearch?: boolean;
}

const Shop: FC<ShopProps> = observer(({ isGlobalSearch }) => {
  const { catalog: categoryRoute } = useParams();

  const localStore = useLocalObservable<LocalStore>(() => ({
    isFilterOpen: false,
    isValidCategory: false,
    filterCategories: [],
  }));


  if ((shopStore.status === "initial" || shopStore.status === "loading") && shopStore.products.length == 0) {
    return (
      <div className='shop__loader ccc'>
        <Loader />
      </div>
    )
  }

  // return <Navigate to={'/404_not_found'} replace />

  return (
    <div className='shop clt' >
      {shopStore.status == "loading" && <LoadingMask />}
      {!isGlobalSearch ?
        <CatalogNav routes={[{
          to: `/${ROUTES.CATEGORY_PREFIX}${categoryRoute}`,
          title: "test"
        }]} /> :
        <CatalogNav routes={[]} />
      }
      <div className='rct'>
        {/* <div className='shop__side-bar clt'>
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
        </div> */}
        <div className='shop__content'>
          {shopStore.products.length !== 0 ?
            <ProductCatalog
              selectedSortType={SortType.NOT_SELECTED}
              products={shopStore.products}
              onChangePage={() => { }}
              onSelectSort={() => { }}
              onOpenFilters={() => { }}
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