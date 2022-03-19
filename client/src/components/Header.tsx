import { observer, useLocalObservable } from 'mobx-react-lite';
import React, { ChangeEvent, KeyboardEvent } from 'react'
import { NavLink } from 'react-router-dom';
import { routes } from '../navigation/routes';
import cart from '../store/cart';
import shop from '../store/shop';
import '../styles/header/header.scss';
import CartQuickView from './CartQuickView';

interface LocalStore {
    isCartOpen: boolean;
    searchString: string;
}

const Header = observer(() => {
    const localStore = useLocalObservable<LocalStore>(() => ({
        isCartOpen: false,
        searchString: ''
    }));

    const handleKeyPress = (event: KeyboardEvent<HTMLInputElement>) => {
        if (event.key === 'Enter') {
            findBySearch();
        }
    }

    const onChangeSearch = (e: ChangeEvent<HTMLInputElement>) => {
        localStore.searchString = e.target.value;
    }

    const findBySearch = () => {
        shop.setSearchString(localStore.searchString);
    }

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
                        <input className='header__search-input' placeholder='Хочу знайти ...' onChange={onChangeSearch} onKeyPress={handleKeyPress} />
                    </div>
                    <span className='header__search-find' onClick={findBySearch}>Пошук</span>
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