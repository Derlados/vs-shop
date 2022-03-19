import { observer, useLocalObservable } from 'mobx-react-lite'
import shop from '../../../store/shop'
import CatalogSettings from './CatalogSettings';
import Pagination from './Pagination';
import Product from './Product'

const MAX_PRODUCTS_BY_PAGE = 16;

export enum ViewMode {
    GRID,
    LIST
}

interface LocalStore {
    selectedViewMode: ViewMode;
}

const Catalog = observer(() => {
    const localStore = useLocalObservable<LocalStore>(() => ({
        selectedViewMode: ViewMode.GRID
    }))

    const selectViewMode = (viewMode: ViewMode) => {
        localStore.selectedViewMode = viewMode;
    }

    const products = shop.filteredProducts.slice((shop.currentPage - 1) * MAX_PRODUCTS_BY_PAGE, shop.currentPage * MAX_PRODUCTS_BY_PAGE);

    return (
        <div className='catalog ccc'>
            <CatalogSettings selectedViewMode={localStore.selectedViewMode} onSelectViewMode={selectViewMode} />
            <div className='catalog__products rlt'>
                {products.map(product =>
                    <Product key={product.id} product={product} />
                )}
            </div>
            <Pagination
                maxPages={shop.maxPages}
                currentPage={shop.currentPage}
                back={() => shop.backPage()}
                next={() => shop.nextPage()}
                setPage={(page: number) => shop.setPage(page)} />
        </div>
    )
});

export default Catalog