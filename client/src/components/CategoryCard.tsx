import React, { FC } from 'react'
import { NavLink } from 'react-router-dom';
import { ICategory } from '../types/ICategory'

interface CategoryCardProps {
    category: ICategory;
    onClick?: () => void;
}

const CategoryCard: FC<CategoryCardProps> = ({ category, onClick }) => {
    return (
        <div className='home__category-card rlc' onClick={onClick}>
            <div className='home__category-text'>
                <div className='home__category-name'>{category.name}</div>
                <div className='home__category-count-products'>Products ({category.productsCount})</div>
                <NavLink className='home__category-shop-now' to={`/${category.routeName}`}>Shop now</NavLink>
            </div>
            <img className='home__category-img' alt='' src={category.img} />
        </div>
    )
}

export default CategoryCard