import classNames from 'classnames';
import { observer, useLocalObservable } from 'mobx-react-lite';
import { ChangeEvent, useEffect } from 'react'
import { NavLink, useLocation, useNavigate } from 'react-router-dom';
import cart from '../../store/cart';
import shop from '../../store/shop';
import './header.scss';
import { SpecSymbols } from '../../values/specSymbols';
import catalog from '../../store/catalog';
import { useQuery } from '../../lib/hooks/useQuery';
import QuickSearch from './QuickSearch/QuickSearch';
import BurgerMenu from './BurgerMenu/BurgerMenu';
import CartQuickView from './CartQuickView/CartQuickView';
import { ROUTES } from '../../values/routes';

interface LocalStore {
    isCartOpen: boolean;
    searchString: string;
    selectedRoute: string;
    isFocused: boolean;
    isFixed: boolean;
    isMenuOpen: boolean;
    isCategoryList: boolean;
}

const Header = observer(() => {
    const navigate = useNavigate();
    const location = useLocation();
    const searchText = (useQuery()).get("text");

    const localStore = useLocalObservable<LocalStore>(() => ({
        isCartOpen: false,
        searchString: searchText ?? '',
        selectedRoute: '',
        isFocused: false,
        isFixed: false,
        isMenuOpen: false,
        isCategoryList: false
    }));

    useEffect(() => {
        window.addEventListener('scroll', (e) => {
            localStore.isFixed = window.scrollY > 100;
        })
    }, [])

    const onChangeSearch = (e: ChangeEvent<HTMLInputElement>) => {
        localStore.searchString = e.target.value;
    }

    const onAcceptSearch = () => {
        if (localStore.selectedRoute) {
            navigate(`${ROUTES.CATEGORY_PREFIX}${localStore.selectedRoute}/search/?text=${localStore.searchString}`)
        } else {
            navigate(`/search/?text=${localStore.searchString}`)
        }
    }

    const onSelectCategory = (route: string) => {
        localStore.selectedRoute = route;
    }

    const onFocusChangeInput = (isFocused: boolean) => {
        localStore.isFocused = isFocused;
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
        <div className={classNames('header rcc', {
            'header_focused': localStore.isFocused
        })}>
            <div className={classNames('header__container rcc', {
                'header__container_fixed': localStore.isFixed
            })}>
                <div className='header__burger-menu ccc' onClick={onOpenMenu}>
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
                                    <NavLink className='header__category-link ccc' to={`./${ROUTES.CATEGORY_PREFIX}${category.routeName}`} onClick={onCloseCatalogList}>
                                        <div className='header__category-name'>
                                            <div className='header__category-text'>{category.name}</div>
                                            {/* <div className='header__new-label'>New</div> */}
                                        </div>
                                    </NavLink>
                                </li>
                            ))}
                            <li className='header__category-item clc' >
                                <NavLink className='header__category-link ccc' to={`./${ROUTES.CATEGORY_PREFIX}embroidery`} onClick={onCloseCatalogList}>
                                    <div className='header__category-name'>
                                        <div className='header__category-text'>Вишивка</div>
                                        <div className='header__new-label'>New</div>
                                    </div>
                                </NavLink>

                            </li>
                        </ul>
                    </li>
                    <li className='header__nav-item'>
                        <NavLink className={classNames('header__nav-link', {
                            'header__nav-link_active': location.pathname === '/contacts'
                        })} to={'./contacts'}>Контакти</NavLink>
                    </li>
                </ul>
                <div className='header__action-area rrc'>
                    <QuickSearch value={localStore.searchString} categories={shop.categories} onFocus={() => onFocusChangeInput(true)}
                        onAccept={onAcceptSearch} onChange={onChangeSearch} onSelectCategory={onSelectCategory} />
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
            <div className={classNames('header__mask', {
                'header__mask_open': localStore.isFocused
            })} onClick={() => onFocusChangeInput(false)}></div>
        </div>
    )
})

export default Header