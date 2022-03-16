import React from 'react'
import Product from './Product'

const ProductsGrid = () => {
    return (
        <div className='products rlt'>
            {[...Array(16)].map((x, i) =>
                <Product key={i} />
            )}
        </div>
    )
}

export default ProductsGrid