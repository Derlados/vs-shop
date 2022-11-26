import { observer } from 'mobx-react-lite';
import React from 'react';
import { NavLink } from 'react-router-dom';
import shop from '../../store/shop';
import './footer.scss';

const Footer = observer(() => {
    return (
        <footer className='footer ccc'>
            <img className='footer__logo footer__logo_top' src='https://template.hasthemes.com/ecolife/ecolife/assets/images/logo/logo.jpg' />
            <div className='footer__container rcc'>
                <img className='footer__logo footer__logo_left' src='https://template.hasthemes.com/ecolife/ecolife/assets/images/logo/logo.jpg' />
                <div className='footer__block rcc'>
                    <div className='footer__text'>Соц. мережі:</div>
                    <ul className='footer__contacts rcc'>
                        {shop.contacts.map(c => (
                            <li key={c.name} className='footer__contact-item'>
                                <a href={c.url}>
                                    <div className={`footer__icon ${c.icon}`}></div>
                                </a>
                            </li>
                        ))}
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
});

export default Footer