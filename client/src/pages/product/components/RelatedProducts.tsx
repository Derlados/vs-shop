import { observer, useLocalObservable } from 'mobx-react-lite';
import React from 'react';
import { Swiper, SwiperSlide } from 'swiper/react';
import cart from '../../../store/cart'
import Product from '../../shop/components/product-card/Product';
import ProductSmallCard from '../../shop/components/product-card/ProductSmallCard';
import 'swiper/css';

interface LocalStore {
    swiper: any;
}

const RelatedProducts = observer(() => {
    const localStore = useLocalObservable<LocalStore>(() => ({
        swiper: null,
    }));
    const products = [...cart.cartProducts, ...cart.cartProducts, ...cart.cartProducts];

    return (
        <div className='related clc'>
            <div className='related__title'>You Might Also Like</div>
            <div className='related__slider-container'>
                <Swiper
                    className='related__slider'
                    spaceBetween={10}
                    slidesPerView={6}
                    direction="horizontal"
                    loop={true}
                    onSwiper={(sw) => localStore.swiper = sw}
                >
                    {products.map((product, index) => (
                        <SwiperSlide key={index} className="related__slider">
                            <Product type="small" product={product.product} />
                        </SwiperSlide>
                    ))}
                </Swiper>
                <div className='related__arrow product__arrow product__arrow_back ccc' onClick={() => localStore.swiper.slidePrev()}>{"❮"}</div>
                <div className='related__arrow product__arrow product__arrow_next ccc' onClick={() => localStore.swiper.slideNext()}>{"❯"}</div>
            </div>
        </div>
    )
});

export default RelatedProducts