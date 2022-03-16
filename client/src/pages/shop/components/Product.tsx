import React from 'react'

const Product = () => {
    return (
        <div className='product ccc'>
            <div className='product__labels ccc'>
                <div className='product__label product__label_green'>New</div>
                <div className='product__label product__label_red'>-5 %</div>
            </div>
            <div className='product__actions ccc'>
                <div className='product__action-mask'>
                    <img className='product__quick-view' />
                </div>
                <div className='product__action-mask'>
                    <img className='product__favorite' />
                </div>
            </div>

            <img className='product__img' src='https://template.hasthemes.com/melani/melani/assets/img/product/product-9.jpg' />
            <span className='product__brand'>STUDIO DESIGN</span>
            <span className='product__name'>Originals Kaval Windbr</span>
            <div className='product__price rlc'>
                <span className='product__old-price'>19.99 ₴</span>
                <span className='product__current-price'>18.99 ₴</span>
            </div>
            <div className='product__cart rlc'>
                <img className='product__cart-img' />
                <span className='product__cart-btn'>ADD TO CART</span>
            </div>
        </div>
    )
}

export default Product