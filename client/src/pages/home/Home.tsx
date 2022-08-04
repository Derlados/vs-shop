import { observer } from 'mobx-react-lite';
import SliderProducts from '../../components/SliderProducts/SliderProducts';
import shop from '../../store/shop';
import './home.scss';
import BannerList from './components/BannerList';
import Loader from '../../lib/Loader/Loader';
import "aos/dist/aos.css";
import { IProduct } from '../../types/IProduct';
import CategoryList from '../../components/Category/CategoryList/CategoryList';

const Home = observer(() => {

    if (!shop.isInit) {
        return (
            <div className='home ccc'>
                <Loader />
            </div>
        )
    }

    return (
        <div className='home ccc'>
            <BannerList banners={shop.banners} />
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
            <SliderProducts title="Best sellers" slidesPerView={5} products={[...shop.bestsellers.slice(0, 10)]} />
            <div className='home__category-title'>Catalog</div>
            <CategoryList categories={shop.categories} />
            <img className='home__banner' alt='' src='https://template.hasthemes.com/ecolife/ecolife/assets/images/banner-image/4.jpg' />
            <SliderProducts title="Resenly added" products={[...shop.newProducts.slice(0, 10)]} />
        </div>
    )
});

export default Home