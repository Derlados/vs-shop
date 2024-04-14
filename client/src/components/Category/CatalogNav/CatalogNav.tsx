import { FC } from 'react';
import { NavLink } from 'react-router-dom';
import { ILink } from '../../../types/shop/ILink';
import './catalog-nav.scss';

interface CatalogNavProps {
  routes: ILink[];
}

const CatalogNav: FC<CatalogNavProps> = ({ routes }) => {
  routes = [{ to: '/home', title: 'Головна' }, ...routes];

  return (
    <div className='catalog-nav'>
      <ul className='catalog-nav__list'>
        {routes.map(route => (
          <NavLink key={route.to} className='catalog-nav__item' to={route.to}>{route.title}</NavLink>
        ))}
      </ul>
    </div>
  )
}

export default CatalogNav