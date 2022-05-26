import classNames from 'classnames';
import { observer, useLocalObservable } from 'mobx-react-lite';
import React, { ChangeEvent, KeyboardEvent, useEffect } from 'react'
import { NavLink, useLocation } from 'react-router-dom';
import { routes } from '../../navigation/routes';
import cart from '../../store/cart';
import shop from '../../store/catalog';
import '../../styles/header/header.scss';
import { SpecSymbols } from '../../values/specSymbols';
import BurgerMenu from './BurgerMenu';
import CartQuickView from './CartQuickView';

interface LocalStore {
    isCartOpen: boolean;
    searchString: string;
    isFixed: boolean;
    isMenuOpen: boolean;
}

const Header = observer(() => {
    const location = useLocation();

    const localStore = useLocalObservable<LocalStore>(() => ({
        isCartOpen: false,
        searchString: '',
        isFixed: false,
        isMenuOpen: false
    }));

    useEffect(() => {
        window.addEventListener('scroll', (e) => {
            localStore.isFixed = window.scrollY > 100;
        })
    }, [])


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
        document.body.style.overflowY = "hidden";
    }

    const onCloseCart = () => {
        localStore.isCartOpen = false;
        document.body.style.overflowY = "";
    }

    const onOpenMenu = () => {
        localStore.isMenuOpen = true;
        document.body.style.overflowY = "hidden";
    }

    const onCloseMenu = () => {
        localStore.isMenuOpen = false;
        document.body.style.overflowY = "";
    }

    return (
        <div className='header  rcc'>
            <div className={classNames('header__container rcc', {
                'header__container_fixed': localStore.isFixed
            })}>
                <div className={'header__burger-menu ccc'} onClick={onOpenMenu}>
                    <div className='header__burger-menu-icon ccc'></div>
                </div>
                <NavLink to={'/home'}>
                    <img alt='' src='https://template.hasthemes.com/ecolife/ecolife/assets/images/logo/logo.jpg' className='header__logo' />
                </NavLink>
                <ul className='header__nav-list'>
                    {routes.map(route => (
                        <li key={route.title} className={'header__nav-item'}>
                            <NavLink className={classNames('header__nav-link', {
                                'header__nav-link_active': location.pathname === route.to
                            })} to={route.to}>{route.title}</NavLink>
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
                    <div className='header__cart rcc' onClick={onOpenCart}>
                        <div className='header__cart-btn'>
                            <div className='header__icon header__icon_cart' />
                            <div className='header__item-count ccc'>{cart.cartProducts.length}</div>
                        </div>
                        <div className='header__cart-total'>{cart.totalPrice}{SpecSymbols.NBSP}₴</div>
                    </div>
                </div>
            </div>
            <BurgerMenu isOpen={localStore.isMenuOpen} onClose={onCloseMenu} />
            <CartQuickView isOpen={localStore.isCartOpen} onClose={onCloseCart} />
        </div>
    )
})

export default Header