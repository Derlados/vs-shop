import React from 'react'
import { NavLink } from 'react-router-dom';
import { routes } from '../navigation/routes';
import '../styles/header.scss';

const Header = () => {


    return (
        <div className='header rcc'>
            <img src='https://template.hasthemes.com/ecolife/ecolife/assets/images/logo/logo.jpg' className='header__logo' />
            <ul className='header__nav-list'>
                {routes.map(route => (
                    <li key={route.title} className='header__nav-item'>
                        <NavLink className={'header__nav-link'} to={route.to}>{route.title}</NavLink>
                    </li>
                ))}
            </ul>
            <div className='header__action-area rrc'>
                <div className='header__search rcc'>
                    <div className='header__search-line rcc'>
                        <div className='header__icon header__icon_search' />
                        <input className='header__search-input' placeholder='Хочу знайти ...' />
                    </div>
                    <span className='header__search-find'>Пошук</span>
                </div>
                <div className='header__favorite'>
                    <div className='header__icon header__icon_favorite' />
                    <div className='header__item-count ccc'>2</div>
                </div>
                <div className='header__cart'>
                    <div className='header__icon header__icon_cart' />
                    <div className='header__item-count ccc'>2</div>
                </div>
            </div>
        </div>
    )
}

export default Header