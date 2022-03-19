import { observer, useLocalObservable } from 'mobx-react-lite';
import React from 'react'
import { NavLink } from 'react-router-dom';
import { routes } from '../navigation/routes';
import cart from '../store/cart';
import '../styles/header/header.scss';
import CartQuickView from './CartQuickView';

interface LocalStore {
    isCartOpen: boolean;
}

const Header = observer(() => {
    const localStore = useLocalObservable<LocalStore>(() => ({
        isCartOpen: false
    }));

    const onOpenCart = () => {
        localStore.isCartOpen = true;
    }

    const onCloseCart = () => {
        localStore.isCartOpen = false;
    }

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
                <div className='header__cart' onClick={onOpenCart}>
                    <div className='header__icon header__icon_cart' />
                    <div className='header__item-count ccc'>{cart.cartProducts.length}</div>
                </div>
            </div>
            <CartQuickView isOpen={localStore.isCartOpen} onClose={onCloseCart} />
        </div>
    )
})

export default Header