import classNames from 'classnames';
import React, { useEffect } from 'react'
import { NavLink, useLocation } from 'react-router-dom'
import { adminRoutes } from '../../../navigation/routes'
import '../../../styles/admin/admin-nav.scss';

const AdminNav = () => {
    const location = useLocation();

    return (
        <div className='admin-nav'>
            <img className='admin-nav__logo' alt='' src='https://template.hasthemes.com/ecolife/ecolife/assets/images/logo/logo.jpg' />
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
}

export default AdminNav