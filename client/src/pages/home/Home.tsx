import { observer } from 'mobx-react-lite';
import './home.scss';
import './home-2.scss';
import Loader from '../../lib/components/Loader/Loader';
import "aos/dist/aos.css";
import CategoryList from '../../components/Category/CategoryList/CategoryList';
import catalogStore from '../../stores/catalog/catalog.store';
import ContactForm from './components/ContactForm';
import SliderProducts from '../../components/SliderProducts/SliderProducts';
import homePageStore from '../../stores/pages/home-page/home-page.store';
import { useEffect } from 'react';

const Home = observer(() => {

  useEffect(() => {
    homePageStore.init();
  }, []);

  if (catalogStore.status === "loading" || catalogStore.status === "initial") {
    return (
      <div className='home ccc'>
        <Loader />
      </div>
    )
  }

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

  return (
    <>
      <div className="home__header">
        <h1 className="home__title">
          Косметика, вишивка. Все для вас, вашого дому та вашої краси
        </h1>
        <div className="home__btn-row">
          <button className="home__btn home__btn_fill">Купити зараз</button>
          <button className="home__btn home__btn_outline">Замовити</button>
        </div>
      </div>
      <div className='home__features'>
        <ul className='home__features-list rcc'>
          <li className='home__features-item rlc'>
            <img className='home__features-img' alt='' src={require('../../assets/images/calendar.png')} />
            <div className='home__features-desc'>
              <div className='home__features-text'>Години праці</div>
              <div className='home__features-text-small'>Пн-Пт: 9:00-18:00</div>
            </div>
          </li>
          <li className='home__features-item rlc'>
            <img className='home__features-img' alt='' src={require('../../assets/images/price-tag.png')} />
            <div className='home__features-desc'>
              <div className='home__features-text'>Ціни</div>
              <div className='home__features-text-small'>Від 500 до 1200 грн</div>
            </div>
          </li>
          <li className='home__features-item rlc'>
          <img className='home__features-img' alt='' src={require('../../assets/images/clock.png')} />
            <div className='home__features-desc'>
              <div className='home__features-text'>Терміни замовлення</div>
              <div className='home__features-text-small'>7 днів</div>
            </div>
          </li>
          <li className='home__features-item rlc'>
            <img className='home__features-img' alt='' src={require('../../assets/images/flash.png')} />
            <div className='home__features-desc'>
              <div className='home__features-text'>Поспішайте</div>
              <div className='home__features-text-small'>
                <a href='/shop'>Купіть зараз</a>
                &nbsp;або&nbsp;
                <a href='/order'>Замовте</a>
              </div>
            </div>
          </li>
        </ul>
      </div>
      <div className="home__products">
        <div className="home__subtitle">Наші каталоги</div>
        <CategoryList categories={catalogStore.categoryList} />
      </div>
      <SliderProducts title="Для домашнього затишку" products={[...homePageStore.favoriteProducts.slice(0, 20)]} />
      <div className="home__about">
        <img className="home__about-icon" src='' />
        <div className="home__subtitle">Про нас</div>
        <div className="home__about-desc">Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.</div>
      </div>
      <div className="home__gallery">
        {images.map((column, index) => (
          <div key={index} className="home__gallery-column">
            {column.map((img, index) => (
              <div className='home__gallery-img-wrapper'>
                <img key={index} src={img} alt={`img${index + 1}`} />
              </div>
            ))}
          </div>
        ))}
      </div>
      <div className="home__products">
        <div className="home__subtitle">Оберіть товар і замовте!</div>
        <CategoryList categories={catalogStore.categoryList} />
      </div>
      <div className="home__contacts">
        <div className="home__subtitle">Контакти</div>
        <ContactForm />
      </div>
    </>
  );
});

export default Home