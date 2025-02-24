import { observer } from 'mobx-react-lite';
import './home.scss';
import "aos/dist/aos.css";
import CategoryList from '../../components/Category/CategoryList/CategoryList';
import catalogStore from '../../stores/catalog/catalog.store';
import ContactForm from './components/ContactForm';
import SliderProducts from '../../components/SliderProducts/SliderProducts';
import homePageStore from '../../stores/pages/home-page/home-page.store';
import { useEffect, useMemo } from 'react';
import useIsMobile from '../../hooks/useIsMobile';
import { Resolutions } from '../../values/resolutions';
import DobleBounceLoader from '../../lib/components/DobleBounceLoader/DobleBounceLoader';

const Home = observer(() => {
  const isMobile = useIsMobile(Resolutions.MOBILE_VERTICAL_LARGE);

  const images = useMemo(() => {
    const allImages = [
      'https://single-workshop.weblium.site/res/646b6366738ad9000ffc36f7/6475e151a0b690000f0e9a7e_optimized_1395_c1395x930-0x0.webp',
      'https://single-workshop.weblium.site/res/646b6366738ad9000ffc36f7/6475e187d0ea29000fbd8d3e_optimized_867_c867x1300-0x0.webp',
      'https://single-workshop.weblium.site/res/646b6366738ad9000ffc36f7/6475e1edd0ea29000fbd8dd8_optimized_1300_c1300x866-0x0.webp',
      'https://single-workshop.weblium.site/res/646b6366738ad9000ffc36f7/6475e1b5bd7589000fdbc2b3_optimized.webp',
      'https://single-workshop.weblium.site/res/646b6366738ad9000ffc36f7/6475e292bd7589000fdbc3da_optimized_1300_c1300x866-0x0.webp',
      'https://single-workshop.weblium.site/res/646b6366738ad9000ffc36f7/6475e262a0b690000f0e9baf_optimized_868_c868x1300-0x0.webp',
    ]
    const columns = isMobile ? 2 : 3;
    const imagesPerColumn = Math.ceil(allImages.length / columns);
    const result = [];
    for (let i = 0; i < columns; i++) {
      result.push(allImages.slice(i * imagesPerColumn, (i + 1) * imagesPerColumn));
    }

    return result;
  }, [isMobile]);

  useEffect(() => {
    homePageStore.init();
  }, []);

  if (catalogStore.status === "loading" || catalogStore.status === "initial") {
    return (
      <div className='home ccc'>
        <DobleBounceLoader color='primary' size='huge' />
      </div>
    )
  }

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
      <SliderProducts title="Інші товари" products={[...homePageStore.favoriteProducts.slice(0, 20)]} />
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
      <SliderProducts title="Оберіть товар і замовте!" products={[...homePageStore.favoriteProducts.slice(0, 20)]} />
      <div className="home__contacts">
        <div className='home__contacts-head'>
          Зацікавила ручна праця і хочете зробити свій дім більш затишним або з'явилися питання? Зв'яжіться з нами!
        </div>
        <ContactForm />
      </div>
    </>
  );
});

export default Home