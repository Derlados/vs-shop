import React from 'react'
import '../styles/header.scss';

const Header = () => {
    return (
        <div className='header rcc'>
            <img src='https://template.hasthemes.com/ecolife/ecolife/assets/images/logo/logo.jpg' className='header__logo' />
            <ul className='header__nav-list'>
                <li className='header__nav-item'>
                    <a className='header__nav-link'>Home</a>
                </li>
                <li className='header__nav-item'>
                    <a className='header__nav-link'>Shop 1</a>
                </li>
                <li className='header__nav-item'>
                    <a className='header__nav-link'>Shop 2</a>
                </li>
                <li className='header__nav-item'>
                    <a className='header__nav-link'>About</a>
                </li>
                <li className='header__nav-item'>
                    <a className='header__nav-link'>Contacts</a>
                </li>
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