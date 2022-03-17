import { observer } from 'mobx-react-lite'
import shop from '../../../store/shop'
import CatalogSettings from './CatalogSettings';
import Pagination from './Pagination';
import Product from './Product'

const MAX_PRODUCTS_BY_PAGE = 16;

const Catalog = observer(() => {
    console.log("render");
    const products = shop.filteredProducts.slice((shop.currentPage - 1) * MAX_PRODUCTS_BY_PAGE, shop.currentPage * MAX_PRODUCTS_BY_PAGE);

    return (
        <div className='catalog ccc'>
            <CatalogSettings />
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