import { observer, useLocalObservable } from 'mobx-react-lite';
import React, { FC, useEffect } from 'react'
import { Swiper, SwiperSlide } from 'swiper/react'
import { ProductCardProps } from '../ProductCard';
import 'swiper/css';
import classNames from 'classnames';
import { AvailableStatus, IProduct } from '../../../types/IProduct';
import Table from '../../../pages/product/components/Table/Table';
import mediaHelper from '../../../helpers/media.helper';
import productHelper from '../../../helpers/product.helper';
import cartStore from '../../../stores/cart/cart.store';
import CartCountEditor from '../../cart/CartCountEditor/CartCountEditor';
import CartButton from '../../cart/CartButton/cart-button';

interface LocalStore {
  swiper: any;
  selectedCount: number;
  selectedImage: string;
}

interface ProductFullInfoProps extends ProductCardProps {
  isExtended?: boolean;
}

const ProductFullInfo: FC<ProductFullInfoProps> = observer(({
  product,
  updateCart,
  isExtended = false,
  mainImage,
  specialPrice,
  description
}) => {
  const localStore = useLocalObservable<LocalStore>(() => ({
    swiper: null,
    selectedCount: 1,
    selectedImage: mainImage || '',
  }));

  const charsRef = React.createRef<HTMLDivElement>();


  useEffect(() => {
    localStore.swiper?.slideToLoop(product.media_gallery_entries.map(img => img.file).length - 1, 0);
    localStore.selectedImage = productHelper.getMainImage(product) || '';
  }, [product])


  const onQtyChange = (neqQty: number) => {
    updateCart('update', product, neqQty);
  }

  const onAddToCart = () => {
    updateCart('add', product, localStore.selectedCount);
  }

  //TODO Есть баг с прямым выбором изображения
  const selectImg = (index: number) => {
    // localStore.selectedImage = product.images[index].url;
    // localStore.swiper?.slideToLoop(index - 1);
  }

  const onSwiperIndexChange = (realIndex: number) => {
    const index = ++realIndex;

    if (index === product.media_gallery_entries.length) {
      localStore.selectedImage = product.media_gallery_entries[0].file;
    } else {
      localStore.selectedImage = product.media_gallery_entries[index].file;
    }
  }

  const onShowChars = () => {
    const offsetTop = charsRef.current ? charsRef.current.offsetTop - 100 : 0;
    window.scrollTo({
      top: offsetTop,
      behavior: "smooth",
    });
  }

  const renderSwiperArrows = () => {
    return (
      <>
        {product.media_gallery_entries.length !== 0 &&
          <div className='product__arrow product__arrow_back ccc' onClick={() => localStore.swiper.slidePrev()}>
            {"❮"}
          </div>
        }
        {product.media_gallery_entries.length !== 0 &&
          <div className='product__arrow product__arrow_next ccc' onClick={() => localStore.swiper.slideNext()}>
            {"❯"}
          </div>
        }
      </>
    );
  }

  return (
    <div className='product__info-full-wrapper ccc'>
      <div className='product__info rlt'>
        <div className='product__images ctc'>
          <div className='product__img-container'>
            <img className='product__img' alt='' src={localStore.selectedImage ?? require('../../../assets/images/no-photos.png')} />
            {renderSwiperArrows()}
          </div>
          <div className='product__slider-container'>
            <Swiper
              className='product__slider'
              spaceBetween={10}
              slidesPerView={3}
              direction="horizontal"
              initialSlide={product.media_gallery_entries.length - 1}
              onRealIndexChange={(sw) => onSwiperIndexChange(sw.realIndex)}
              loop={true}
              onSwiper={(sw) => localStore.swiper = sw}
            >
              {product.media_gallery_entries.map((img, index) => (
                <SwiperSlide key={img.id}>
                  <img
                    className='product__slider-slide' alt=''
                    src={mediaHelper.getCatalogUrl(img.file, "product")}
                    onClick={() => selectImg(index)}
                  />
                </SwiperSlide>
              ))}
            </Swiper>
            {renderSwiperArrows()}
          </div>
        </div>
        <div className='product__content clt'>
          <div className='product__title'>{product.name}</div>
          <div className='product__price rlc'>
            <div className='product__current-price'>{product.price} ₴</div>
            {specialPrice && <div className='product__old-price'>{specialPrice} ₴</div>}
          </div>
          <div className='product__desc'>{description}</div>
          {isExtended &&
            <div className='description__details clc'>
              <ul className='description__list'>
                {/* {product.attributes.slice(0, 5).map(attribute => (
                  <li key={attribute.name} className='description__list-item rlt'>
                    <div className='description__list-item_attr'>{attribute.name} :</div>
                    <div className='description__list-item_val'>{attribute.value.name}</div>
                  </li>
                ))} */}
              </ul>
              <div className='description__show-all' onClick={onShowChars}>Глянути всі характеристики</div>
            </div>
          }
          <div className='product__actions rlc'>
            {!cartStore.totals?.items.find(i => i.item_id == product.id) &&
              <CartCountEditor
                onChange={onQtyChange}
                selectedCount={localStore.selectedCount}
              />
            }
            <CartButton
              color="primary"
              isActive={cartStore.totals?.items.find(i => i.item_id == product.id) === undefined}
              onClick={onAddToCart}
            />
          </div>
          <span className='product__availability'>Доступно:
            <span className={classNames('product__availability-status', {
              'product__availability-status_green': product.status === AvailableStatus.IN_STOCK,
              'product__availability-status_yellow': product.status === AvailableStatus.IN_STOKE_FEW,
              'product__availability-status_gray': product.status === AvailableStatus.OUT_OF_STOCK,
            })}>{product.status}</span>
          </span>
          <div className='product__share-actions rlc'>
            <span className='product__share'>Поділитися: </span>
            <div className='product__share-action product__share-action_facebook'></div>
            <div className='product__share-action product__share-action_telegram'></div>
          </div>
        </div>
      </div>
      {isExtended &&
        <div ref={charsRef} className='product__chars clt' >
          <div className='product__chars-title'>Характеристики</div>
          {/* <Table attributes={product.attributes} /> */}
        </div>
      }
    </div>

  )
});

export default ProductFullInfo