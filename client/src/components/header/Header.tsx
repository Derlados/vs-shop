import classNames from 'classnames';
import { observer, useLocalObservable } from 'mobx-react-lite';
import React, { ChangeEvent, KeyboardEvent, useEffect } from 'react'
import { NavLink, useLocation } from 'react-router-dom';
import cart from '../../store/cart';
import catalog from '../../store/catalog';
import shop from '../../store/shop';
import './header.scss';
import { SpecSymbols } from '../../values/specSymbols';
import CartQuickView from './CartQuickView/CartQuickView';
import BurgerMenu from './BurgerMenu/BurgerMenu';

interface LocalStore {
    isCartOpen: boolean;
    searchString: string;
    isFixed: boolean;
    isMenuOpen: boolean;
    isCategoryList: boolean;
}

const Header = observer(() => {
    const location = useLocation();

    const localStore = useLocalObservable<LocalStore>(() => ({
        isCartOpen: false,
        searchString: '',
        isFixed: false,
        isMenuOpen: false,
        isCategoryList: false
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
        catalog.setSearchString(localStore.searchString);
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

    const onCloseCatalogList = () => {
        localStore.isCategoryList = false;
    }

    const onOpenCatalogList = () => {
        localStore.isCategoryList = true;
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
                    <li className='header__nav-item'>
                        <NavLink className={classNames('header__nav-link', {
                            'header__nav-link_active': location.pathname === '/home'
                        })} to={'./home'}>Головна</NavLink>
                    </li>
                    <li className={classNames('header__nav-item', {
                        'header__nav-item_open': localStore.isCategoryList
                    })} onMouseOver={onOpenCatalogList} onMouseLeave={onCloseCatalogList}>
                        <div className={classNames('header__nav-link', {
                            'header__nav-link_active': shop.categoryRoutes.includes(location.pathname.replace('/', ''))
                        })}>Каталоги <span className='header__nav-arrow'></span></div>
                        <ul className='header__category-list'>
                            {shop.categories.map(category => (
                                <li key={category.id} className='header__category-item clc' >
                                    <NavLink className='header__category-link' to={`./${category.routeName}`} onClick={onCloseCatalogList}>
                                        <div className='header__category-name'>{category.name}</div>
                                    </NavLink>
                                </li>
                            ))}
                        </ul>
                    </li>
                    <li className='header__nav-item'>
                        <NavLink className={classNames('header__nav-link', {
                            'header__nav-link_active': location.pathname === '/embroidery'
                        })} to={'./embroidery'}>Вишивка</NavLink>
                        <div className='header__new-label'>New</div>
                    </li>
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