import { observer, useLocalObservable } from 'mobx-react-lite';
import React, { FC, useEffect, useRef } from 'react';
import { Swiper, SwiperSlide, useSwiper } from 'swiper/react';
import 'swiper/css';
import '../../../../styles/product/product.scss';

import { ProductProps } from './ProductCard';
import classNames from 'classnames';
import CartButton from '../../../../components/CartButton';
import cart from '../../../../store/cart';

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
 * ЗАМЕТКА: Swipper в данной компоненте не корректно работает с 4 слайдами. Следовательно нужно либо больше, либо меньше
 */
const ProductQuickModal: FC<ProductQuickModalProps> = observer(({ isOpen, product, addToCart, addToFavorite, onCloseQuickView }) => {
    const localStore = useLocalObservable<LocalStore>(() => ({
        swiper: null,
        selectedCount: 1,
        selectedImage: product.imgs[0]
    }));
    const wrapperRef = useRef(null);

    useEffect(() => {
        localStore.selectedCount = 1;
        localStore.selectedImage = product.imgs[0];
    }, [isOpen])

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

    const selectImg = (index: number) => {
        localStore.selectedImage = product.imgs[index];
        localStore.swiper?.slideToLoop(index - 1);
    }

    const onIndexChange = (realIndex: number) => {
        const index = ++realIndex;

        if (index == product.imgs.length) {
            localStore.selectedImage = product.imgs[0];
        } else {
            localStore.selectedImage = product.imgs[index];
        }
    }

    return (
        <div className={classNames('product ccc', {
            "product_open": isOpen
        })} onClick={handleClickOutside}>
            <div className={classNames('product__container rlc', {
                "product__container_open": isOpen
            })} ref={wrapperRef} >
                <div className='product__images ccc'>
                    <div className='product__img-container'>
                        <img className='product__img' src={localStore.selectedImage} />
                        <div className='product__arrow product__arrow_back ccc' onClick={() => localStore.swiper.slidePrev()}>{"<"}</div>
                        <div className='product__arrow product__arrow_next ccc' onClick={() => localStore.swiper.slideNext()}>{">"}</div>
                    </div>
                    <div className='product__slider-container'>
                        <Swiper
                            className='product__slider'
                            spaceBetween={10}
                            slidesPerView={3}
                            initialSlide={product.imgs.length - 1}
                            onRealIndexChange={(sw) => onIndexChange(sw.realIndex)}
                            loop={true}
                            onSwiper={(sw) => localStore.swiper = sw}
                        >
                            {product.imgs.map((img, index) => (
                                <SwiperSlide key={index}>
                                    <img className='product__slider-slide' src={img} onClick={() => selectImg(index)} />
                                </SwiperSlide>
                            ))}
                        </Swiper>
                        <div className='product__arrow product__arrow_back ccc' onClick={() => localStore.swiper.slidePrev()}>{"<"}</div>
                        <div className='product__arrow product__arrow_next ccc' onClick={() => localStore.swiper.slideNext()}>{">"}</div>
                    </div>
                </div>
                <div className='product__content clt'>
                    <div className='product__title'>{product.title}</div>
                    <div className='product__price rlc'>
                        <div className='product__old-price'>{product.oldPrice}</div>
                        <div className='product__current-price'>{product.price}</div>
                    </div>
                    <div className='product__desc'>Lorem ipsum dolor sit amet, consectetur adipisic elit eiusm tempor incidid ut labore et dolore magna aliqua. Ut enim ad minim venialo quis nostrud exercitation ullamco</div>
                    <div className='product__actions rlc'>
                        {!cart.findById(product.id) && <div className='product__count-actions rlc'>
                            <span className='product__count-btn ccc' onClick={decrementCount}>-</span>
                            <input className='product__count ccc' value={localStore.selectedCount} onChange={handleCountChange} type="number" maxLength={3} />
                            <span className='product__count-btn ccc' onClick={incrementCount}>+</span>
                        </div>}
                        <CartButton isActive={cart.findById(product.id) === undefined} onClick={onAddToCart} />
                    </div>
                    <span className='product__avalibility'>Availibility: <span className='product__avalibility-status product__avalibility-status_green'>{product.count} available</span></span>
                    <div className='product__share-actions rlc'>
                        <span className='product__share'>Share: </span>
                        <div className='product__share-action product__share-action_facebook'></div>
                        <div className='product__share-action product__share-action_telegram'></div>
                    </div>
                    <div className='product__close' onClick={onCloseQuickView}></div>
                </div>
            </div>

        </div >
    )
});

export default ProductQuickModal
