import classNames from 'classnames';
import { observer } from 'mobx-react-lite';
import React, { FC, useEffect } from 'react'
import { NavLink } from 'react-router-dom';
import { IBanner } from '../../../types/ILargeBanner'

interface BannerProps {
  info: IBanner;
  size?: "full-screen" | "container";
}

const Banner: FC<BannerProps> = observer(({ info, size = "full-screen" }) => {

  return (
    <div className={classNames('home__banner ccc', {
      'home__banner_full-screen': size == "full-screen",
      'home__banner_container': size == "container",
    })}>
      <div className='home__banner-img' style={{
        backgroundImage: `url('${info.img}')`
      }} />
      <div className='home__banner-info clc'>
        <div className='home__banner-title' data-aos="fade-up">{info.title}</div>
        <div className='home__banner-subtitle' data-aos="fade-up" data-aos-delay="500">{info.subtitle}</div>
        <NavLink className='home__banner-btn' data-aos="fade-up" data-aos-delay="1000" to={info.link}>
          SHOP NOW
        </NavLink>
      </div>

    </div>
  )
});

export default Banner