import React from 'react';
import '../../styles/components/footer.scss';

const Footer = () => {
    return (
        <footer className='footer ccc'>
            <img className='footer__logo footer__logo_top' src='https://template.hasthemes.com/ecolife/ecolife/assets/images/logo/logo.jpg' />
            <div className='footer__container rcc'>
                <img className='footer__logo footer__logo_left' src='https://template.hasthemes.com/ecolife/ecolife/assets/images/logo/logo.jpg' />
                <div className='footer__block rcc'>
                    <div className='footer__text'>Соц. мережі:</div>
                    <ul className='footer__contacts rcc'>
                        <li className='footer__contact-item'>
                            <div className='footer__icon footer__icon_facebook'></div>
                        </li>
                        <li className='footer__contact-item'>
                            <div className='footer__icon footer__icon_telegram'></div>
                        </li>
                    </ul>
                </div>
                <div className='footer__block rlc'>
                    <div className='footer__icon footer__icon_time'></div>
                    <div className='footer__text'>09:00 - 18:00</div>
                </div>
                <div className='footer__block rlc'>
                    <div className='footer__icon footer__icon_phone'></div>
                    <div className='footer__text'>+380 (66) 055-99-72</div>
                </div>
            </div>
            <div className='footer__text footer__copyright'>© Copyright 2021. All Rights Reserved.</div>
        </footer>
    )
}

export default Footer