import React from 'react'
import Filters from './components/Filters'
import Pagination from './components/Pagination'
import Catalog from './components/Catalog'
import '../../styles/shop/shop.scss';
import '../../styles/shop/filters.scss';
import '../../styles/shop/product-card.scss';
import '../../styles/shop/catalog.scss';
import '../../styles/shop/pagination.scss';

const Shop = () => {


    return (
        <div className='shop rct'>
            <Filters />
            <div className='shop__content сcc'>
                <Catalog />
            </div>
        </div>
    )
}

export default Shop