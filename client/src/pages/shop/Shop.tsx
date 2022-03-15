import React from 'react'
import Filters from './components/Filters'
import Pagination from './components/Pagination'
import ProductsGrid from './components/ProductsGrid'
import '../../styles/shop/shop.scss';
import '../../styles/shop/filters.scss';
import '../../styles/shop/products.scss';
import '../../styles/shop/pagination.scss';

const Shop = () => {
    return (
        <div className='shop rcc'>
            <Filters />
            <div className='shop__content ccc'>
                <ProductsGrid />
                <Pagination />
            </div>
        </div>
    )
}

export default Shop