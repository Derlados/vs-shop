import classNames from 'classnames';
import React, { FC } from 'react'
import { Swiper, SwiperSlide } from 'swiper/react';
import { IBanner } from '../../../types/shop/ILargeBanner';
import Banner from './Banner';

interface BannerListProps {
  banners: IBanner[];
  bannerSize?: "full-screen" | "container";
  onClick?: (banner: IBanner) => void;
}

const BannerList: FC<BannerListProps> = ({ banners, bannerSize = "full-screen", onClick = (banner: IBanner) => { } }) => {

  return (
    <div className={classNames('home__banner-slider-wrap', {
      'home__banner-slider-wrap_container': bannerSize === "container",
    })}>
      {banners.length !== 0 &&
        <Swiper
          className={classNames('home__banner-slider', {
            'home__banner-slider_full-screen': bannerSize === "full-screen",
            'home__banner-slider_container': bannerSize === "container",
          })}
          slidesPerView='auto'
          spaceBetween={0}
          direction="horizontal"
          loop={true}
          draggable={true}
          speed={1000}
          autoplay={banners.length !== 1 ? { delay: 5000 } : false}
        >
          {
            banners.map(b => (
              <SwiperSlide key={b.id} className='home__banner-slide' onClick={() => onClick(b)}>
                <Banner info={b} size={bannerSize} />
              </SwiperSlide>
            ))
          }
        </Swiper>
      }
    </div>

  )
}

export default BannerList