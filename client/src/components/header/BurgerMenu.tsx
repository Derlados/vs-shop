import classNames from 'classnames';
import { observer } from 'mobx-react-lite';
import { FC } from 'react';
import { NavLink } from 'react-router-dom';
import { routes } from '../../navigation/routes';
import '../../styles/header/burger-menu.scss';


interface BurgerMenuProps {
    isOpen: boolean;
    onClose: () => void;
}

const BurgerMenu: FC<BurgerMenuProps> = observer(({ isOpen, onClose }) => {
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
                <div className='burger-menu__wishlist burger-menu_underline rcc'>{`Wishlist (${0})`}</div>
                <div className='burger-menu__menu'>MENU</div>
                <ul className='burger-menu__list clc'>
                    {routes.map(route => (
                        <NavLink key={route.title} className='burger-menu__link burger-menu_underline' to={route.to} onClick={onClose}>
                            <li >{route.title}</li>
                        </NavLink>
                    ))}
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
        </div>
    )
});

export default BurgerMenu