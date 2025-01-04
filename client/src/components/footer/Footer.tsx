import { observer } from 'mobx-react-lite';
import './footer.scss';

const Footer = observer(() => {
  return (
    <footer className='footer ccc'>
      <div className="footer__blocks rlt">
        <div className="footer__block">
          <img className='footer__logo footer__logo_top' src={require('../../assets/images/logo.png')} alt='logo' />
        </div>
        <div className="footer__block">
          <div className="footer__block-title">Загальна інформація</div>
          <div className="footer__block-info">Номер телефону: +380 50 123 45 67</div>
          <div className="footer__block-info">Email: test@gmail.com</div>
        </div>
        <div className="footer__block">
          <div className="footer__block-title">Графік роботи</div>
          <div className="footer__block-info">Пн-Пт: 9:00-18:00</div>
          <div className="footer__block-info">Сб-Нд: 10:00-18:00</div>
        </div>
        <div className="footer__block">
          <div className="footer__block-title">Користувачам</div>
          <a href="/contacts">Контакти</a>
          {/* <a href="/payment_and_delivery">Оплата та доставка</a> */}
          <a href="#catalogs">Всі каталоги</a>
          <a href="/shop/category">Вишивка</a>
        </div>
        
      </div>
      <div className='footer__text footer__copyright'>© Copyright 2025. All Rights Reserved.</div>
    </footer>
  )
});

export default Footer