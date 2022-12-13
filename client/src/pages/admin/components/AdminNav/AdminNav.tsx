import classNames from 'classnames';
import { observer, useLocalObservable } from 'mobx-react-lite';
import { NavLink, useLocation } from 'react-router-dom'
import { adminRoutes } from '../../../../navigation/routes'
import './admin-nav.scss';

interface LocalStore {
    isOpened: boolean;
}

const AdminNav = observer(() => {
    const location = useLocation();
    const localstore = useLocalObservable<LocalStore>(() => ({
        isOpened: false
    }));

    const toggleNavBar = () => {
        localstore.isOpened = !localstore.isOpened;
    }

    return (
        <div className={classNames('admin-nav', {
            'admin-nav_opened': localstore.isOpened
        })} onClick={toggleNavBar}>
            <img className='admin-nav__logo' alt='logo' src={require('../../../../assets/images/logo.png')} />
            <div className='admin-nav__item admin-nav__selected-item  rlc'>
                <div className={`admin-nav__icon ${adminRoutes.find(r => r.to === location.pathname)?.img ?? ''}`}></div>
            </div>
            <ul className='admin-nav__list'>
                {adminRoutes.map(route => (
                    <NavLink className='admin-nav__link' key={route.to} to={route.to}>
                        <li className={classNames('admin-nav__item rlc', {
                            ' admin-nav__item_active': location.pathname === route.to
                        })}>
                            <div className={`admin-nav__icon ${route.img ?? ''}`}></div>
                            <div className='admin-nav__title'>{route.title}</div>
                        </li>
                    </NavLink>
                ))}
            </ul>
        </div>

    )
});

export default AdminNav