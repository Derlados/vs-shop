import { observer, useLocalObservable } from 'mobx-react-lite'
import cart from '../../../store/cart';
import shop from '../../../store/shop'
import { IProduct } from '../../../types/types';
import CatalogSettings from './CatalogSettings';
import Pagination from './Pagination';
import ProductCard from './product-card/ProductCard';
import ProductQuickModal from './product-card/ProductQuickModal';

const MAX_PRODUCTS_BY_PAGE = 16;

export enum ViewMode {
    GRID,
    LIST
}

interface LocalStore {
    selectedViewMode: ViewMode;
    selectedProduct: IProduct;
    isOpenQuick: boolean
}

const Catalog = observer(() => {
    const localStore = useLocalObservable<LocalStore>(() => ({
        selectedViewMode: ViewMode.GRID,
        selectedProduct: shop.filteredProducts[0],
        isOpenQuick: false
    }))

    const selectViewMode = (viewMode: ViewMode) => {
        localStore.selectedViewMode = viewMode;
    }

    const openQuickView = (product: IProduct) => {
        localStore.selectedProduct = product;
        localStore.isOpenQuick = true;
    }

    //TODO
    const openFullView = (product: IProduct) => {

    }

    const addToCart = (product: IProduct, count: number = 1) => {
        cart.addToCart(product, count);
    }

    const addToFavorite = (product: IProduct) => {

    }

    const closeQuickView = () => {
        localStore.isOpenQuick = false;
    }

    const products = shop.filteredProducts.slice((shop.currentPage - 1) * MAX_PRODUCTS_BY_PAGE, shop.currentPage * MAX_PRODUCTS_BY_PAGE);

    return (
        <div className='catalog ccc'>
            <ProductQuickModal isOpen={localStore.isOpenQuick} product={localStore.selectedProduct} addToCart={addToCart} addToFavorite={addToFavorite} onCloseQuickView={closeQuickView} />
            <CatalogSettings selectedViewMode={localStore.selectedViewMode} onSelectViewMode={selectViewMode} />
            <div className='catalog__products rlt'>
                {products.map(product =>
                    <ProductCard
                        key={product.id}
                        type={'small'}
                        product={product}
                        addToCart={addToCart}
                        addToFavorite={addToFavorite}
                        openFullView={openFullView}
                        onOpenQuickView={openQuickView} />
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