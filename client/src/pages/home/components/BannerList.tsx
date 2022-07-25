import React, { FC } from 'react'
import { Swiper, SwiperSlide } from 'swiper/react';
import { ILargeBanner } from '../../../types/ILargeBanner'
import LargeBanner from './LargeBanner';

interface BannerListProps {
    banners: ILargeBanner[];
}

const BannerList: FC<BannerListProps> = ({ banners }) => {

    return (
        <div>
            {banners.length !== 0 &&
                <Swiper
                    className='home__banner-slider'
                    slidesPerView='auto'
                    spaceBetween={0}
                    direction="horizontal"
                    loop={true}
                    draggable={true}
                    onSwiper={(sw) => { }}
                >
                    {
                        banners.map(b => (
                            <SwiperSlide key={b.img} className='home__banner-slide'>
                                <LargeBanner info={b} />
                            </SwiperSlide>
                        ))
                    }
                </Swiper>
            }
        </div>

    )
}

export default BannerList