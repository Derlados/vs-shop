import React, { FC } from 'react'
import { NavLink } from 'react-router-dom';
import { ICategory } from '../types/ICategory';

interface CategoryCardProps {
    category: ICategory;
    onClick?: () => void;
}

const CategoryCard: FC<CategoryCardProps> = ({ category, onClick }) => {
    return (
        <div className='category-list__category-card  rlc' onClick={onClick}>
            <div className='category-list__category-text'>
                <div className='category-list__category-name'>{category.name}</div>
                <div className='category-list__category-count-products'>Products ({category.productsCount})</div>
                <NavLink className='category-list__category-shop-now' to={`/${category.routeName}`}>Shop now</NavLink>
            </div>
            <img className='category-list__category-img' alt='' src={category.img} />
        </div>
    )
}

export default CategoryCard