import { observer } from 'mobx-react-lite';
import SliderProducts from '../../components/SliderProducts/SliderProducts';
import './home.scss';
import BannerList from './components/BannerList';
import Loader from '../../lib/components/Loader/Loader';
import "aos/dist/aos.css";
import CategoryList from '../../components/Category/CategoryList/CategoryList';
import PopupWindow from '../../components/PopupWindow/PopupWindow';
import catalogStore from '../../stores/catalog/catalog.store';
import { Navigate } from 'react-router-dom';
import { IBanner } from '../../types/shop/ILargeBanner';

const Home = observer(() => {

  if (catalogStore.status === "loading" || catalogStore.status === "initial") {
    return (
      <div className='home ccc'>
        <Loader />
      </div>
    )
  }

  const banners: IBanner[] = [
    {
      id: 12,
      title: "Цифрові товари, комплектуючі",
      subtitle: "Все для збірки ПК",
      img: "https://computerstore.ug/wp-content/uploads/2022/09/side-1.jpg",
      link: "/shop"
    }
  ]

  if (catalogStore.status === "success" && catalogStore.categoryList) {
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
        {/* <SliderProducts title="Хіт продажів" slidesPerView={5} products={[...shop.bestsellers.slice(0, 10)]} /> */}
        <div className='home__category-title'>Каталоги</div>
        <CategoryList categories={catalogStore.categoryList} />
        {/* <img className='home__banner home__banner_small' alt='' src={shop.smallBanner} /> */}
        {/* <SliderProducts title="Нові товари" products={[...shop.newProducts.slice(0, 10)]} /> */}
        <PopupWindow />
      </div>
    )
  }

  return <Navigate to={'/404_not_found'} replace />
});

export default Home