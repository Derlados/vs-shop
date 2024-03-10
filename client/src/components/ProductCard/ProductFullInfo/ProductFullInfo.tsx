import { observer, useLocalObservable } from 'mobx-react-lite';
import React, { FC, useEffect } from 'react'
import { Swiper, SwiperSlide } from 'swiper/react'
import { ProductCardProps } from '../ProductCard';
import 'swiper/css';
import classNames from 'classnames';
import Table from '../../../pages/product/components/Table/Table';
import mediaHelper from '../../../helpers/media.helper';
import productHelper from '../../../helpers/product.helper';
import cartStore from '../../../stores/cart/cart.store';
import CartButton from '../../CartButton/cart-button';
import { StockStatus } from '../../../types/magento/IProduct';
import CartCountEditor from '../../CartCountEditor/CartCountEditor';
import FormatHelper from '../../../helpers/format.helper';

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
    selectedImage: '',
  }));

  const charsRef = React.createRef<HTMLDivElement>();

  const productInCart = cartStore.cart.items.find(i => i.sku == product.sku) !== undefined;

  useEffect(() => {
    localStore.swiper?.slideToLoop(product.media_gallery_entries.map(img => img.file).length - 1, 0);
    const mainImage = productHelper.getMainImage(product) || '';
    localStore.selectedImage = mediaHelper.getCatalogFileUrl(mainImage, 'product');
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
    const file = index === product.media_gallery_entries.length
      ? product.media_gallery_entries[0].file
      : product.media_gallery_entries[index].file;

    localStore.selectedImage = mediaHelper.getCatalogFileUrl(file, 'product');
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
                    src={mediaHelper.getCatalogFileUrl(img.file, "product")}
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
            <div className='product__current-price'>{FormatHelper.formatCurrency(specialPrice ?? product.price, 0)}</div>
            {specialPrice && <div className='product__old-price'>{FormatHelper.formatCurrency(product.price, 0)}</div>}
          </div>
          <div className='product__desc'>{description}</div>
          {isExtended &&
            <div className='description__details clc'>
              <ul className='description__list'>
                {product.extension_attributes.description_attributes.slice(0, 5).map(attribute => (
                  <li key={attribute.attribute_code} className='description__list-item rlt'>
                    <div className='description__list-item_attr'>{attribute.label} :</div>
                    <div className='description__list-item_val'>{attribute.value}</div>
                  </li>
                ))}
              </ul>
              <div className='description__show-all' onClick={onShowChars}>Глянути всі характеристики</div>
            </div>
          }
          <div className='product__actions rlc'>
            {!productInCart &&
              <CartCountEditor
                onChange={onQtyChange}
                selectedCount={localStore.selectedCount}
              />
            }
            <CartButton
              color="primary"
              sku={product.sku}
              isActive={!productInCart}
              onClick={onAddToCart}
            />
          </div>
          <span className='product__availability'>Доступно:
            <span className={classNames('product__availability-status', {
              'product__availability-status_green': product.extension_attributes.stock_status === StockStatus.IN_STOCK,
              'product__availability-status_yellow': product.extension_attributes.stock_status === StockStatus.RUNNING_LOW,
              'product__availability-status_gray': product.extension_attributes.stock_status === StockStatus.OUT_OF_STOCK,
            })}>{productHelper.getStockStatusLabel(product)}</span>
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
          <Table attributes={product.extension_attributes.description_attributes} />
        </div>
      }
    </div>

  )
});

export default ProductFullInfo