import React, { FC } from 'react'
import { NavLink } from 'react-router-dom';
import { ILargeBanner } from '../../../types/ILargeBanner'

interface LargeBannerProps {
    info: ILargeBanner;
}

const LargeBanner: FC<LargeBannerProps> = ({ info }) => {
    return (
        <div className='home__banner ccc'>
            <div className='home__banner-img' style={{
                backgroundImage: `url('${info.img}')`
            }}>

            </div>
            <div className='home__banner-info clc'>
                <div className='home__banner-title'>{info.title}</div>
                <div className='home__banner-subtitle'>{info.subtitle}</div>
                <NavLink className='home__banner-btn' to={info.link}>
                    SHOP NOW
                </NavLink>
            </div>

        </div>
    )
}

export default LargeBanner