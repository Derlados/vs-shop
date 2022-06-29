import React, { useEffect, useState } from 'react';
import { NavLink, useNavigate, useParams } from 'react-router-dom';
import { ILink } from '../navigation/routes';
import catalog from '../store/catalog';
import shop from '../store/shop';
import '../styles/components/catalog-nav.scss';

const CatalogNav = () => {
    const [routes, setRoutes] = useState<ILink[]>([
        {
            to: '/home',
            title: 'Головна'
        }
    ]);
    const { catalog: categoryRoute, id } = useParams();

    useEffect(() => {
        const newRoutes: ILink[] = [
            {
                to: '/home',
                title: 'Головна'
            }
        ];

        if (categoryRoute) {
            const category = shop.getCategoryByRoute(categoryRoute);

            if (category) {
                newRoutes.push({
                    to: `../${category.routeName}`,
                    title: category.name
                })
            }
        }

        if (id && Number.isInteger(parseInt(id))) {
            const product = catalog.getProductById(+id);
            if (product) {
                newRoutes.push({
                    to: `../../${categoryRoute}/${product.id.toString()}`,
                    title: product?.title
                })
            }
        }

        setRoutes(newRoutes);
    }, [categoryRoute, id])

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