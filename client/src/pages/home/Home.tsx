import { observer } from 'mobx-react-lite';
import React from 'react'
import { NavLink } from 'react-router-dom';
import CategoryList from '../../components/CategoryList';
import SliderProducts from '../../components/SliderProducts';
import catalog from '../../store/catalog';
import shop from '../../store/shop';
import '../../styles/home/home.scss';
import { ILargeBanner } from '../../types/ILargeBanner';
import BannerList from './components/BannerList';
import LargeBanner from './components/LargeBanner';

const Home = observer(() => {
    const banners: ILargeBanner[] = [
        { title: 'Organic Fruits\nSummer Drinks', img: 'https://template.hasthemes.com/ecolife/ecolife/assets/images/slider-image/sample-2.jpg', subtitle: 'fresh New pack Brusting Fruits', link: 'http://localhost:3000/processors' },
        { title: 'Organic Fruits\nSummer Drinks', img: 'https://template.hasthemes.com/ecolife/ecolife/assets/images/slider-image/sample-1.jpg', subtitle: 'fresh New pack Brusting Fruits', link: '' },
    ]

    return (
        <div className='home ccc'>
            <BannerList banners={banners} />
            <div className='home__features'>
                <ul className='home__feature-list rcc'>
                    <li className='home__feature-item rlc'>
                        <img className='home__feature-img' alt='' src='https://template.hasthemes.com/ecolife/ecolife/assets/images/icons/static-icons-1.png' />
                        <div className='home__feature-desc'>
                            <div className='home__feature-text'>Free Shipping</div>
                            <div className='home__feature-text-small'>On all orders over $75.00</div>
                        </div>
                    </li>
                    <li className='home__feature-item rlc'>
                        <img className='home__feature-img' alt='' src='https://template.hasthemes.com/ecolife/ecolife/assets/images/icons/static-icons-2.png' />
                        <div className='home__feature-desc'>
                            <div className='home__feature-text'>Free Returns</div>
                            <div className='home__feature-text-small'>Returns are free within 9 days</div>
                        </div>
                    </li>
                    <li className='home__feature-item rlc'>
                        <img className='home__feature-img' alt='' src='https://template.hasthemes.com/ecolife/ecolife/assets/images/icons/static-icons-3.png' />
                        <div className='home__feature-desc'>
                            <div className='home__feature-text'>100% Payment Secure</div>
                            <div className='home__feature-text-small'>Your payment are safe with us.</div>
                        </div>
                    </li>
                    <li className='home__feature-item rlc'>
                        <img className='home__feature-img' alt='' src='https://template.hasthemes.com/ecolife/ecolife/assets/images/icons/static-icons-4.png' />
                        <div className='home__feature-desc'>
                            <div className='home__feature-text'>Support 24/7</div>
                            <div className='home__feature-text-small'>Contact us 24 hours a day</div>
                        </div>
                    </li>
                </ul>
            </div>
            <SliderProducts title="Best sellers" slidesPerView={5} products={[...shop.bestSellers.slice(0, 8)]} />
            <div className='home__category-title'>Catalog</div>
            <CategoryList categories={shop.categories} />
            <img className='home__banner' alt='' src='https://template.hasthemes.com/ecolife/ecolife/assets/images/banner-image/4.jpg' />
            <SliderProducts title="Resenly added" products={[...shop.newProducts.slice(0, 8)]} />
        </div>
    )
});

export default Home