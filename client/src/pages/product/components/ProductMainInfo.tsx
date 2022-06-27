import { observer, useLocalObservable } from 'mobx-react-lite';
import React, { FC, useEffect } from 'react'
import { Swiper, SwiperSlide } from 'swiper/react';
import CartButton from '../../../components/CartButton';
import cart from '../../../store/cart';
import { ProductProps } from '../../shop/components/product-card/Product';
import 'swiper/css';
import { IImage } from '../../../types/IImage';

interface LocalStore {
    swiper: any;
    selectedCount: number;
    selectedImage: string;
}

interface ProductMainInfoProps extends ProductProps {
    isExtended?: boolean;
}

const ProductMainInfo: FC<ProductMainInfoProps> = observer(({ product, addToCart, isExtended = false }) => {
    const localStore = useLocalObservable<LocalStore>(() => ({
        swiper: null,
        selectedCount: 1,
        selectedImage: product.images[0]?.url
    }));

    const getMainImg = (): IImage => {
        let mainImg = product.images.find(img => img.isMain)
        if (!mainImg) {
            mainImg = product.images[0];
        }
        return mainImg;
    }

    useEffect(() => {
        localStore.swiper?.slideToLoop(product.images.length - 1, 0);
        localStore.selectedImage = getMainImg()?.url
    }, [product, product.images.length])


    const incrementCount = () => {
        if (localStore.selectedCount < product.count) {
            ++localStore.selectedCount;
        }
    }

    const decrementCount = () => {
        if (localStore.selectedCount > 1) {
            --localStore.selectedCount;
        }
    }

    const handleCountChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        if (event.target.value !== '' && +event.target.value >= 1 && +event.target.value <= product.count) {
            localStore.selectedCount = +event.target.value;
        }
    }

    const onAddToCart = () => {
        addToCart(product, localStore.selectedCount);
    }

    const selectImg = (index: number) => {
        localStore.selectedImage = product.images[index].url;
        localStore.swiper?.slideToLoop(index - 1);
    }

    const onIndexChange = (realIndex: number) => {
        const index = ++realIndex;

        if (index === product.images.length) {
            localStore.selectedImage = product.images[0].url;
        } else {
            localStore.selectedImage = product.images[index]?.url;
        }
    }

    return (
        <div className='product__info rlt'>
            <div className='product__images ctc'>
                <div className='product__img-container'>
                    <img className='product__img' alt='' src={localStore.selectedImage ?? require('../../../assets/images/no-photos.png')} />
                    {product.images.length !== 0 && <div className='product__arrow product__arrow_back ccc' onClick={() => localStore.swiper.slidePrev()}>{"❮"}</div>}
                    {product.images.length !== 0 && <div className='product__arrow product__arrow_next ccc' onClick={() => localStore.swiper.slideNext()}>{"❯"}</div>}
                </div>
                <div className='product__slider-container'>
                    <Swiper
                        className='product__slider'
                        spaceBetween={10}
                        slidesPerView={3}
                        direction="horizontal"
                        initialSlide={product.images.length - 1}
                        onRealIndexChange={(sw) => onIndexChange(sw.realIndex)}
                        loop={true}
                        onSwiper={(sw) => localStore.swiper = sw}
                    >
                        {product.images.map((img, index) => (
                            <SwiperSlide key={index}>
                                <img className='product__slider-slide' alt='' src={img.url} onClick={() => selectImg(index)} />
                            </SwiperSlide>
                        ))}
                    </Swiper>
                    {product.images.length !== 0 && <div className='product__arrow product__arrow_back ccc' onClick={() => localStore.swiper.slidePrev()}>{"❮"}</div>}
                    {product.images.length !== 0 && <div className='product__arrow product__arrow_next ccc' onClick={() => localStore.swiper.slideNext()}>{"❯"}</div>}
                </div>
            </div>
            <div className='product__content clt'>
                <div className='product__title'>{product.title}</div>
                <div className='product__price rlc'>
                    <div className='product__old-price'>{product.oldPrice} ₴</div>
                    <div className='product__current-price'>{product.price} ₴</div>
                </div>
                <div className='product__desc'>{product.description}</div>
                {isExtended &&
                    <div className='description__details rlc'>
                        <ul className='description__list'>
                            {[...product.attributes].map(([attribute, value]) => (
                                <li key={attribute} className='description__list-item rlt'>
                                    <div className='description__list-item_attr'>{attribute}</div>
                                    <div className='description__list-item_val'>{value}</div>
                                </li>
                            ))}
                        </ul>
                    </div>
                }
                <div className='product__actions rlc'>
                    {!cart.findById(product.id) && <div className='product__count-actions rlc'>
                        <span className='product__count-btn ccc' onClick={decrementCount}>-</span>
                        <input className='product__count ccc' value={localStore.selectedCount} onChange={handleCountChange} type="number" maxLength={3} />
                        <span className='product__count-btn ccc' onClick={incrementCount}>+</span>
                    </div>}
                    <CartButton color="primary" isActive={cart.findById(product.id) === undefined} onClick={onAddToCart} />
                </div>
                <span className='product__avalibility'>Availibility: <span className='product__avalibility-status product__avalibility-status_green'>{product.count} available</span></span>
                <div className='product__share-actions rlc'>
                    <span className='product__share'>Share: </span>
                    <div className='product__share-action product__share-action_facebook'></div>
                    <div className='product__share-action product__share-action_telegram'></div>
                </div>
            </div>
        </div>
    )
});

export default ProductMainInfo