import { observer, useLocalObservable } from 'mobx-react-lite';
import React, { FC, useEffect } from 'react'
import { Swiper, SwiperSlide } from 'swiper/react'
import cart from '../../../store/cart';
import { ProductCardProps } from '../ProductCard';
import 'swiper/css';
import { IImage } from '../../../types/IImage';
import CartCountEditor from '../../Cart/CartCountEditor/CartCountEditor';
import classNames from 'classnames';
import { AvailableStatus } from '../../../types/IProduct';
import CartButton from '../../Cart/CartButton/CartButton';

interface LocalStore {
    swiper: any;
    selectedCount: number;
    selectedImage: string;
}

interface ProductFullInfoProps extends ProductCardProps {
    isExtended?: boolean;
}

const ProductFullInfo: FC<ProductFullInfoProps> = observer(({ product, addToCart, isExtended = false }) => {
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
        if (localStore.selectedCount < product.maxByOrder) {
            ++localStore.selectedCount;
        }
    }

    const decrementCount = () => {
        if (localStore.selectedCount > 1) {
            --localStore.selectedCount;
        }
    }

    const handleCountChange = (count: number) => {
        if (count >= 1 && count <= product.maxByOrder) {
            localStore.selectedCount = count;
        }
    }

    const onAddToCart = () => {
        addToCart(product, localStore.selectedCount);
    }

    //TODO Есть баг с прямым выбором изображения
    const selectImg = (index: number) => {
        // localStore.selectedImage = product.images[index].url;
        // localStore.swiper?.slideToLoop(index - 1);
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
                    <div className='product__current-price'>{product.price} ₴</div>
                    <div className='product__old-price'>{product.oldPrice} ₴</div>
                </div>
                <div className='product__desc'>{product.description}</div>
                {isExtended &&
                    <div className='description__details rlc'>
                        <ul className='description__list'>
                            {product.attributes.map(attribute => (
                                <li key={attribute.name} className='description__list-item rlt'>
                                    <div className='description__list-item_attr'>{attribute.name}</div>
                                    <div className='description__list-item_val'>{attribute.value.name}</div>
                                </li>
                            ))}
                        </ul>
                    </div>
                }
                <div className='product__actions rlc'>
                    {!cart.findById(product.id) &&
                        <CartCountEditor
                            decrement={decrementCount}
                            increment={incrementCount}
                            onChange={handleCountChange}
                            selectedCount={localStore.selectedCount}
                        />
                    }
                    <CartButton color="primary" isActive={cart.findById(product.id) === undefined} onClick={onAddToCart} />
                </div>
                <span className='product__availability'>Availibility:
                    <span className={classNames('product__availability-status', {
                        'product__availability-status_green': product.availability === AvailableStatus.IN_STOCK,
                        'product__availability-status_yellow': product.availability === AvailableStatus.IN_STOKE_FEW,
                        'product__availability-status_gray': product.availability === AvailableStatus.OUT_OF_STOCK,
                    })}>{product.availability}</span>
                </span>
                <div className='product__share-actions rlc'>
                    <span className='product__share'>Share: </span>
                    <div className='product__share-action product__share-action_facebook'></div>
                    <div className='product__share-action product__share-action_telegram'></div>
                </div>
            </div>
        </div>
    )
});

export default ProductFullInfo