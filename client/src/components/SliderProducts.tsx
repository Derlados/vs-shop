import { observer, useLocalObservable } from 'mobx-react-lite';
import React, { FC } from 'react';
import { Swiper, SwiperSlide } from 'swiper/react';
import 'swiper/css';
import Product from '../pages/shop/components/product-card/Product';
import cart from '../store/cart';
import { IProduct } from '../types/types';
import '../styles/components/slider-products.scss';

interface LocalStore {
    swiper: any;
}

interface SliderProductsProps {
    title: string;
    products: IProduct[];
    slidesPerView?: number;
}

const SliderProducts: FC<SliderProductsProps> = observer(({ products, title, slidesPerView = 6 }) => {
    const localStore = useLocalObservable<LocalStore>(() => ({
        swiper: null,
    }));

    return (
        <div className='slider-products clc'>
            <div className='slider-products__head rlc'>
                <div className='slider-products__title'>{title}</div>
                <div className='slider-products__arrows rlc'>
                    <div className='slider-products__arrow ccc' onClick={() => localStore.swiper.slidePrev()}>{"❮"}</div>
                    <div className='slider-products__arrow ccc' onClick={() => localStore.swiper.slideNext()}>{"❯"}</div>
                </div>
            </div>

            <div className='slider-products__slider-container'>
                <Swiper
                    className='slider-products__slider'
                    spaceBetween={10}
                    slidesPerView={slidesPerView}
                    direction="horizontal"
                    loop={true}
                    onSwiper={(sw) => localStore.swiper = sw}
                >
                    {products.map((product, index) => (
                        <SwiperSlide key={index} className="slider-products__slider">
                            <Product type="small" product={product} />
                        </SwiperSlide>
                    ))}
                </Swiper>
            </div>
        </div>
    )
});

export default SliderProducts