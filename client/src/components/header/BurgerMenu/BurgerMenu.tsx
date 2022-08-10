import classNames from 'classnames';
import { observer, useLocalObservable } from 'mobx-react-lite';
import { FC } from 'react';
import { NavLink } from 'react-router-dom';
import shop from '../../../store/shop';
import './burger-menu.scss';

interface LocalStore {
    isCatalogListOpen: boolean;
}

interface BurgerMenuProps {
    isOpen: boolean;
    onClose: () => void;
}

const BurgerMenu: FC<BurgerMenuProps> = observer(({ isOpen, onClose }) => {
    const localStore = useLocalObservable<LocalStore>(() => ({
        isCatalogListOpen: false
    }))

    const toggleCatalogList = () => {
        localStore.isCatalogListOpen = !localStore.isCatalogListOpen;
    }

    return (
        <div className={classNames('burger-menu ccc', {
            'burger-menu_opened': isOpen
        })}>
            <div className='burger-menu__container'>
                <div className='burger-menu__head rcc burger-menu_underline'>
                    <NavLink className='burger-menu__link' to={'/home'}>
                        <img src='https://template.hasthemes.com/ecolife/ecolife/assets/images/logo/logo.jpg' className='burger-menu__logo' />
                    </NavLink>
                    <div className='burger-menu__close' onClick={onClose}></div>
                </div>
                {/* <div className='burger-menu__wishlist burger-menu_underline rcc'>{`Wishlist (${0})`}</div> */}
                <div className='burger-menu__menu'>MENU</div>
                <ul className='burger-menu__list clc'>
                    <li className='burger-menu__item burger-menu_underline'>
                        <NavLink to={'/home'} onClick={onClose}>
                            Головна
                        </NavLink>
                    </li>
                    <li className='burger-menu__item burger-menu_underline'>
                        <div className='burger-menu__list-head rcc' onClick={toggleCatalogList}>
                            <span>Каталоги</span>
                            <span className={classNames('burger-menu__nav-arrow', {
                                'burger-menu__nav-arrow_up': localStore.isCatalogListOpen
                            })}></span>
                        </div>
                        <ul className={classNames('burger-menu__link-list', {
                            'burger-menu__link-list_open': localStore.isCatalogListOpen
                        })}>
                            {shop.categories.map(category => (
                                <li key={category.id}>
                                    <NavLink to={category.routeName} onClick={onClose}>- {category.name}</NavLink>
                                </li>
                            ))}
                            <li>
                                <NavLink to={'./embroidery'} onClick={onClose}>- Вишивка</NavLink>
                            </li>
                        </ul>
                    </li>
                    <li className='burger-menu__item burger-menu_underline'>
                        <NavLink to={'/contacts'} onClick={onClose}>
                            Контакти
                        </NavLink>
                    </li>

                </ul>
                <div className='burger-menu__contacts rcc'>
                    <a className='burger-menu__contact-link '>
                        <div className='burger-menu__icon burger-menu__icon_telegram'></div>
                    </a>
                    <a className='burger-menu__contact-link '>
                        <div className='burger-menu__icon burger-menu__icon_facebook'></div>
                    </a>
                </div>
            </div>
        </div >
    )
});

export default BurgerMenu