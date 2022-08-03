import React, { FC } from 'react'
import { NavLink } from 'react-router-dom'
import { IProduct } from '../../../../types/IProduct';
import './popular-products.scss';

interface PopularProductsProps {
    categoryRoute: string;
    products: IProduct[];
}

const PopularProducts: FC<PopularProductsProps> = ({ categoryRoute, products }) => {
    return (
        <div className='popular-products'>
            <div className='popular-products__head'>Популярні товари</div>
            <ul className='popular-products__list clc'>
                {products.map(p => (
                    <li key={p.id} className='popular-products__item rlc'>
                        <NavLink to={`/${categoryRoute}/${p.id}`}>
                            <img className='popular-products__img' src={p.images.find(img => img.isMain)?.url} alt={p.id.toString()} />
                        </NavLink>
                        <div className='popular-products__info clc'>
                            <NavLink to={`/${categoryRoute}/${p.id}`} className='popular-products__title'>{p.title}</NavLink>
                            <div className='popular-products__price'>{p.price}₴</div>
                        </div>
                    </li>
                ))}

            </ul>
        </div>
    )
}

export default PopularProducts