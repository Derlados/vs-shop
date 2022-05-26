import { observer, useLocalObservable } from 'mobx-react-lite';
import { FC, useEffect } from 'react';
import { Swiper, SwiperSlide } from 'swiper/react';
import 'swiper/css';
import Product from '../pages/shop/components/product-card/Product';
import '../styles/components/slider-products.scss';
import { Resolutions } from '../values/resolutions';
import { IProduct } from '../types/IProduct';

interface LocalStore {
    swiper: any;
    slidesPerView: number;
}

interface SliderProductsProps {
    title: string;
    products: IProduct[];
    slidesPerView?: number;
}

const MAX_PER_LAPTOP = 5;
const MAX_PER_TABLET_HORIZONTAL = 4;
const MAX_PER_MOBILE_HORIZONTAL = 3;
const MAX_PER_MOBILE_VERTICAL = 2;

const SliderProducts: FC<SliderProductsProps> = observer(({ products, title, slidesPerView = 6 }) => {
    const localStore = useLocalObservable<LocalStore>(() => ({
        swiper: null,
        slidesPerView: slidesPerView
    }));

    useEffect(() => {
        window.addEventListener("resize", () => {
            const scrollY = window.scrollY;
            if (window.innerWidth <= Resolutions.MOBILE_VERtICAL && slidesPerView > MAX_PER_MOBILE_VERTICAL) {
                localStore.slidesPerView = MAX_PER_MOBILE_VERTICAL;
            } else if (window.innerWidth <= Resolutions.MOBILE_HORIZONTAL && slidesPerView > MAX_PER_MOBILE_HORIZONTAL) {
                localStore.slidesPerView = MAX_PER_MOBILE_HORIZONTAL;
            } else if (window.innerWidth <= Resolutions.TABLE_HORIZONTAL && slidesPerView > MAX_PER_TABLET_HORIZONTAL) {
                localStore.slidesPerView = MAX_PER_TABLET_HORIZONTAL;
            } else if (window.innerWidth <= Resolutions.LAPTOP && slidesPerView > MAX_PER_LAPTOP) {
                localStore.slidesPerView = MAX_PER_LAPTOP
            } else if (window.innerWidth > Resolutions.LAPTOP) {
                localStore.slidesPerView = slidesPerView;
            }
            window.scrollTo({
                'behavior': "auto",
                top: scrollY
            })
        })
        window.dispatchEvent(new Event('resize'));
    }, [])

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
                    slidesPerView={localStore.slidesPerView}
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