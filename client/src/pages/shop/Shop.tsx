import React from 'react'
import Filters from './components/Filters'
import Pagination from './components/Pagination'
import ProductCatalog from './components/ProductCatalog'
import '../../styles/shop/shop.scss';
import '../../styles/shop/filters.scss';
import '../../styles/shop/catalog.scss';
import '../../styles/shop/pagination.scss';
import CatalogNav from '../../components/CatalogNav';

const Shop = () => {


    return (
        <div className='shop clt'>
            <CatalogNav />
            <div className='rct'>
                <Filters />
                <div className='shop__content сcc'>
                    <ProductCatalog />
                </div>
            </div>
        </div>
    )
}

export default Shop