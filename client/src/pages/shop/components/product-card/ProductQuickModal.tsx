import { observer, useLocalObservable } from 'mobx-react-lite';
import React, { FC, useEffect, useRef } from 'react';
import { Swiper, SwiperSlide, useSwiper } from 'swiper/react';
import 'swiper/css';
import '../../../../styles/shop/product-quick-modal.scss';

import { ProductProps } from './ProductCard';
import classNames from 'classnames';

interface ProductQuickModalProps extends ProductProps {
    isOpen: boolean;
    onCloseQuickView: () => void;
}

interface LocalStore {
    swiper: any;
    selectedCount: number;
    selectedImage: string;
}

/**
 * Hook that alerts clicks outside of the passed ref
 */
function useOutsideAlerter(ref: any) {
    useEffect(() => {
        /**
         * Alert if clicked on outside of element
         */
        function handleClickOutside(event: any) {
            if (ref.current && !ref.current.contains(event.target)) {
                console.log("out")
            }
        }
        // Bind the event listener
        ref.current.addEventListener("mousedown", handleClickOutside);
        return () => {
            // Unbind the event listener on clean up
            ref.current.removeEventListener("mousedown", handleClickOutside);
        };
    }, [ref]);
}

/**
 * ЗАМЕТКА: Swipper в данной компоненте не корректно работает с 4 слайдами. Следовательно нужно либо больше, либо меньше
 */
const ProductQuickModal: FC<ProductQuickModalProps> = observer(({ isOpen, product, addToCart, addToFavorite, onCloseQuickView }) => {
    const localStore = useLocalObservable<LocalStore>(() => ({
        swiper: null,
        selectedCount: 1,
        selectedImage: 'https://template.hasthemes.com/melani/melani/assets/img/product/product-9.jpg'
    }));

    const wrapperRef = useRef(null);

    if (!localStore.swiper) {
        localStore.swiper = useSwiper();
    }

    const handleClickOutside = (event: React.MouseEvent) => {
        if (wrapperRef.current && !(wrapperRef.current as any).contains(event.target)) {
            onCloseQuickView();
        }
    }

    const incrementCount = () => {
        ++localStore.selectedCount;
    }

    const decrementCount = () => {
        if (localStore.selectedCount > 1) {
            --localStore.selectedCount;
        }
    }

    const handleCountChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        if (event.target.value != '' && +event.target.value >= 1 && +event.target.value < 1000) {
            localStore.selectedCount = +event.target.value;
        }
    }

    const onAddToCart = () => {
        addToCart(product, localStore.selectedCount);
    }

    const selectImg = (img: string, index: number) => {
        localStore.selectedImage = img;
        localStore.swiper.slideTo(index);
    }

    return (
        <div className={classNames('product-quick-modal ccc', {
            "product-quick-modal_open": isOpen
        })} onClick={handleClickOutside}>
            <div className={classNames('product-quick-modal__container rlc', {
                "product-quick-modal__container_open": isOpen
            })} ref={wrapperRef} >
                <div className='product-quick-modal__images ccc'>
                    <div className='product-quick-modal__img-container'>
                        <img className='product-quick-modal__img' src='https://template.hasthemes.com/melani/melani/assets/img/product/product-9.jpg' />
                        <div className='product-quick-modal__arrow product-quick-modal__arrow_back ccc' onClick={() => localStore.swiper.slidePrev()}>{"<"}</div>
                        <div className='product-quick-modal__arrow product-quick-modal__arrow_next ccc' onClick={() => localStore.swiper.slideNext()}>{">"}</div>
                    </div>
                    <div className='product-quick-modal__slider-container'>
                        <Swiper
                            className='product-quick-modal__slider'
                            spaceBetween={10}
                            slidesPerView={3}
                            loop={true}
                            onSlideChange={() => console.log(localStore.swiper?.realIndex)}
                            onSwiper={(sw) => localStore.swiper = sw}
                        >
                            <SwiperSlide>
                                <img className='product-quick-modal__slider-slide' src='https://template.hasthemes.com/melani/melani/assets/img/product/product-9.jpg' />
                            </SwiperSlide>
                            <SwiperSlide >
                                <img className='product-quick-modal__slider-slide' src='https://template.hasthemes.com/melani/melani/assets/img/product/product-details-img2.jpg' />
                            </SwiperSlide>
                            <SwiperSlide>
                                <img className='product-quick-modal__slider-slide' src='https://template.hasthemes.com/melani/melani/assets/img/product/product-details-img5.jpg' />
                            </SwiperSlide>
                            <SwiperSlide>
                                <img className='product-quick-modal__slider-slide' src='https://template.hasthemes.com/melani/melani/assets/img/product/product-details-img3.jpg' />
                            </SwiperSlide>
                            <SwiperSlide>
                                <img className='product-quick-modal__slider-slide' src='https://template.hasthemes.com/melani/melani/assets/img/product/product-details-img3.jpg' />
                            </SwiperSlide>
                        </Swiper>
                        <div className='product-quick-modal__arrow product-quick-modal__arrow_back ccc' onClick={() => localStore.swiper.slidePrev()}>{"<"}</div>
                        <div className='product-quick-modal__arrow product-quick-modal__arrow_next ccc' onClick={() => localStore.swiper.slideNext()}>{">"}</div>
                    </div>
                </div>
                <div className='product-quick-modal__content clt'>
                    <div className='product-quick-modal__title'>{product.title}</div>
                    <div className='product-quick-modal__price rlc'>
                        <div className='product-quick-modal__old-price'>{product.oldPrice}</div>
                        <div className='product-quick-modal__current-price'>{product.price}</div>
                    </div>
                    <div className='product-quick-modal__desc'>Lorem ipsum dolor sit amet, consectetur adipisic elit eiusm tempor incidid ut labore et dolore magna aliqua. Ut enim ad minim venialo quis nostrud exercitation ullamco</div>
                    <div className='product-quick-modal__actions rlc'>
                        <div className='product-quick-modal__count-actions rlc'>
                            <span className='product-quick-modal__count-btn ccc' onClick={decrementCount}>-</span>
                            <input className='product-quick-modal__count ccc' value={localStore.selectedCount} onChange={handleCountChange} type="number" maxLength={3} />
                            <span className='product-quick-modal__count-btn ccc' onClick={incrementCount}>+</span>
                        </div>
                        <div className='product-quick-modal__cart rlc'>
                            <div className='product-quick-modal__cart-img' ></div>
                            <span className='product-quick-modal__cart-btn-text' onClick={onAddToCart}>ADD TO CART</span>
                        </div>
                    </div>
                    <span className='product-quick-modal__avalibility'>Availibility: <span className='product-quick-modal__avalibility-status product-quick-modal__avalibility-status_green'>300 available</span></span>
                    <div className='product-quick-modal__share-actions rlc'>
                        <span className='product-quick-modal__share'>Share: </span>
                        <div className='product-quick-modal__share-action product-quick-modal__share-action_facebook'></div>
                        <div className='product-quick-modal__share-action product-quick-modal__share-action_telegram'></div>
                    </div>
                    <div className='product-quick-modal__close' onClick={onCloseQuickView}></div>
                </div>
            </div>

        </div >
    )
});

export default ProductQuickModal
