import { observer } from 'mobx-react-lite';
import SliderProducts from '../../components/SliderProducts/SliderProducts';
import './home.scss';
import './home-2.scss';
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

  const images = [
    [
      'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSzLZNa_Djvd2yjBTUQtybvQkLPWYOTItyurg&s',
      'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcS5Horaki4ZAV1ga942kOnBfBgIFPjO7rdLrA&s'
    ],
    [
      'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQeYPNjXNgm8TgcoavhxKPGqJKCcdQFylssAw&s',
      'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRSYEZJiaqb7uvW_VovYHsocPtngCbDTQzuE9ILlKr4k83JvdeoqINFq1-LU0wejoDqRlk&usqp=CAU'
    ],
    [
      'https://tkani-atlas.com.ua/assets/images/blog/1503824130_1503824130.webp',
    'https://i.pinimg.com/236x/3b/9b/31/3b9b316b6882a352a4dd6cb29240f7eb.jpg'
    ]
  ];

  if (true) {
    return (
      <>
       <div className="vs-shop__header">
      <h1 className="vs-shop__title">
        Косметика, вишивка. Все для вас, вашого дому та вашої краси
      </h1>
      <div className="vs-shop__btn-row">
        <button className="vs-shop__btn vs-shop__btn_fill">Купити зараз</button>
        <button className="vs-shop__btn vs-shop__btn_outline">Замовити</button>
      </div>
    </div>
    <div className="vs-shop__features">
      <div className="vs-shop__features-item">
        <div className="vs-shop__feature-title">Години праці</div>
        <div className="vs-shop__feature-desc">Пн-Пт: 9:00-18:00</div>
      </div>
      <div className="vs-shop__features-item">
        <div className="vs-shop__feature-title">Ціни</div>
        <div className="vs-shop__feature-desc">Від 500 до 1200 грн</div>
      </div>
      <div className="vs-shop__features-item">
        <div className="vs-shop__feature-title">Терміни замовлення</div>
        <div className="vs-shop__feature-desc">7 днів</div>
      </div>
      <div className="vs-shop__features-item">
        <div className="vs-shop__feature-title">Поспішайте</div>
        <div className="vs-shop__feature-desc">
          <a href='/shop'>Купіть зараз</a>
          або
          <a href='/order'>Замовте</a>
        </div>
      </div>
    </div>
    <div className="vs-shop__products">
      <div className="vs-shop__subtitle">Наші каталоги</div>
      <CategoryList categories={catalogStore.categoryList} />
    </div>
    <div className="vs-shop__products">
      <div className="vs-shop__subtitle">Для домашнього затишку</div>
      <CategoryList categories={catalogStore.categoryList} />
    </div>
    <div className="vs-shop__about">
      <img className="vs-shop__about-icon" src=''/>
      <div className="vs-shop__subtitle">Про нас</div>
      <div className="vs-shop__about-desc">Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.</div>
    </div>
    <div className="vs-shop__gallery">
      {images.map((column, index) => (
        <div key={index} className="vs-shop__gallery-column">
          {column.map((img, index) => (
            <div className='vs-shop__gallery-img-wrapper'>
              <img key={index} src={img} alt={`img${index + 1}`}/>
            </div>
          ))}
        </div>
      ))}
    </div>
    <div className="vs-shop__products">
      <div className="vs-shop__subtitle">Оберіть товар і замовте!</div>
      <CategoryList categories={catalogStore.categoryList} />
    </div>
    <div className="vs-shop__contacts">
      <div className="vs-shop__subtitle">Контакти</div>
      <div className="row">
         {/* <!-- form --> */}
        <div className="vs-shop__contacts-info">
          <div className="vs-shop__contacts-info-block">
            <img className="vs-shop__contacts-info-icon" src=''/>
            <div className="vs-shop__contacts-info-content">
              <div className="vs-shop__contacts-info-title">Номер телефону</div>
              <div className="vs-shop__contacts-info-desc">+380 50 123 45 67</div>
            </div>
          </div>
          <div className="vs-shop__contacts-info-block">
            <img className="vs-shop__contacts-info-icon" src=''/>
            <div className="vs-shop__contacts-info-content">
              <div className="vs-shop__contacts-info-title">Email</div>
              <div className="vs-shop__contacts-info-desc">Email: test@gmail.com</div>
            </div>
          </div>
          <div className="vs-shop__contacts-info-block">
            <img className="vs-shop__contacts-info-icon" src=''/>
            <div className="vs-shop__contacts-info-content">
              <div className="vs-shop__contacts-info-title">Адреса</div>
              <div className="vs-shop__contacts-info-desc">м. Львів, вул. Шевченка 123</div>
            </div>
          </div>
        </div>
      </div>
    </div>
    <footer>
      <div className="vs-shop__footer-blocks">
        <div className="vs-shop__block">
          <div className="vs-shop__block-title">Загальна інформація</div>
          <div className="vs-shop__block-info">Номер телефону: +380 50 123 45 67</div>
          <div className="vs-shop__block-info">Email: test@gmail.com</div>
          <div className="vs-shop__block-title">Графік роботи</div>
          <div className="vs-shop__block-info">Пн-Пт: 9:00-18:00</div>
          <div className="vs-shop__block-info">Сб-Нд: 10:00-18:00</div>
        </div>
        <div className="vs-shop__block">
          <div className="vs-shop__block-title">Користувачам</div>
          <a href="/contacts">Контакти</a>
          <a href="/payment_and_delivery">Оплата та доставка</a>
          <a href="#catalogs">Всі каталоги</a>
          <a href="/shop/category">Вишивка</a>
        </div>
      </div>
      <div className="vs-shop__copyright">

      </div>
    </footer>
      </>
    );
  }

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