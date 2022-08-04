import React, { FC } from 'react'
import { NavLink } from 'react-router-dom';
import CategoryCard from './CategoryCard';
import './category-list.scss';
import { ICategory } from '../../../types/ICategory';


interface CategoryListProps {
    categories: ICategory[];
    onClick?: (category: ICategory) => void;
}

const CategoryList: FC<CategoryListProps> = ({ categories, onClick }) => {
    return (
        <div className='category-list rlc'>
            {categories.map((category) => (
                <CategoryCard key={category.id} category={category} onClick={onClick ? () => onClick(category) : undefined} />
            ))}
            {categories.length % 3 == 2 &&
                <div className='category-list__category-card category-list__category-card_empty  rlc'>

                </div>
            }
        </div>
    )
}

export default CategoryList