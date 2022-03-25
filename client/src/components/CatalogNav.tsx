import React, { useEffect, useState } from 'react';
import { NavLink, useNavigate, useParams } from 'react-router-dom';
import { ILink } from '../navigation/routes';
import shop from '../store/shop';
import '../styles/components/catalog-nav.scss';

const CatalogNav = () => {
    const navigation = useNavigate();
    const [routes, setRoutes] = useState<ILink[]>([
        {
            to: '/home',
            title: 'Головна'
        }
    ]);
    const { catalog, id } = useParams();

    useEffect(() => {
        const newRoutes: ILink[] = [
            {
                to: '/home',
                title: 'Головна'
            }
        ];

        if (catalog) {
            const categoryName = shop.categories.get(catalog);

            if (categoryName) {
                newRoutes.push({
                    to: `../${catalog}`,
                    title: categoryName
                })
            } else if (!categoryName) {
                navigation('/home');
            }
        }

        if (id) {
            try {
                const product = shop.findProductById(+id);
                newRoutes.push({
                    to: `../../${catalog}/${product.id.toString()}`,
                    title: product.title
                })
            } catch (e) {
                navigation(`/${catalog}`);
            }
        }

        setRoutes(newRoutes);
    }, [catalog, id])

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